/**
 * ============================================================================
 * Google Apps Script - PomoSheets Backend Bridge
 * ============================================================================
 * Skrip ini bertindak sebagai API serverless untuk aplikasi Pomodoro & To-Do List.
 * Menghubungkan aplikasi web di Cloudflare Pages langsung ke Google Sheets Anda.
 * 
 * CARA PEMASANGAN:
 * 1. Buat Spreadsheet baru di Google Drive (https://sheets.new).
 * 2. Klik menu 'Ekstensi' (Extensions) -> 'Apps Script'.
 * 3. Hapus semua kode default dan tempel seluruh isi file ini.
 * 4. Klik tombol 'Terapkan' (Deploy) -> 'Penerapan baru' (New deployment).
 * 5. Pilih jenis: 'Aplikasi Web' (Web app).
 * 6. Pada kolom 'Akses' (Who has access), pilih 'Siapa saja' (Anyone).
 * 7. Klik 'Terapkan' (Deploy), berikan izin akses Google Anda.
 * 8. Salin URL Aplikasi Web (Web App URL) yang berakhiran /exec,
 *    lalu tempelkan ke Pengaturan (Settings) di aplikasi PomoSheets!
 * ============================================================================
 */

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsConfigured(ss);

    if (action === 'ping') {
      return jsonResponse({
        status: 'success',
        message: 'Koneksi ke Google Sheets berhasil!',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAll') {
      const tasks = getTasksData(ss);
      const sessions = getSessionsData(ss);
      return jsonResponse({
        status: 'success',
        tasks: tasks,
        sessions: sessions,
        syncedAt: new Date().toISOString()
      });
    }

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsConfigured(ss);

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ status: 'error', message: 'No payload received' });
    }

    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    if (action === 'ping') {
      return jsonResponse({
        status: 'success',
        message: 'Koneksi aktif dan siap menerima data!',
        timestamp: new Date().toISOString()
      });
    }

    // 1. Simpan/Sync Tasks (Timpa atau Update To-Do list)
    if (action === 'syncTasks') {
      const tasks = payload.tasks || [];
      saveTasksData(ss, tasks);
      return jsonResponse({
        status: 'success',
        message: 'Tasks berhasil disinkronkan',
        count: tasks.length,
        syncedAt: new Date().toISOString()
      });
    }

    // 2. Tambah Catatan Sesi Pomodoro Baru
    if (action === 'logSession') {
      const session = payload.session;
      if (session) {
        appendSessionLog(ss, session);
      }
      return jsonResponse({
        status: 'success',
        message: 'Sesi pomodoro berhasil dicatat',
        syncedAt: new Date().toISOString()
      });
    }

    // 3. Full Sync (Simpan Tasks & Riwayat Sekaligus)
    if (action === 'fullSync') {
      if (payload.tasks) {
        saveTasksData(ss, payload.tasks);
      }
      if (payload.newSessions && payload.newSessions.length > 0) {
        payload.newSessions.forEach(function(s) {
          appendSessionLog(ss, s);
        });
      }
      return jsonResponse({
        status: 'success',
        message: 'Sinkronisasi penuh berhasil',
        syncedAt: new Date().toISOString()
      });
    }

    return jsonResponse({ status: 'error', message: 'Invalid action: ' + action });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * Memastikan sheet 'Tasks' dan 'Sessions' telah ada dengan header yang rapi
 */
function ensureSheetsConfigured(ss) {
  // 1. Sheet Tasks
  let taskSheet = ss.getSheetByName('Tasks');
  if (!taskSheet) {
    taskSheet = ss.insertSheet('Tasks');
    const headers = ['ID', 'Judul Tugas', 'Status', 'Pomodoro Selesai', 'Estimasi Pomodoro', 'Dibuat Pada', 'Selesai Pada'];
    taskSheet.appendRow(headers);
    const headerRange = taskSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
    taskSheet.setFrozenRows(1);
  }

  // 2. Sheet Sessions
  let sessionSheet = ss.getSheetByName('Sessions');
  if (!sessionSheet) {
    sessionSheet = ss.insertSheet('Sessions');
    const headers = ['ID Sesi', 'Mode (Fokus/Break)', 'Durasi (Menit)', 'Nama Tugas Terkait', 'Waktu Selesai'];
    sessionSheet.appendRow(headers);
    const headerRange = sessionSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
    sessionSheet.setFrozenRows(1);
  }
}

function getTasksData(ss) {
  const sheet = ss.getSheetByName('Tasks');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const tasks = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] && !row[1]) continue;
    tasks.push({
      id: String(row[0]),
      title: String(row[1]),
      completed: row[2] === 'Selesai' || row[2] === true,
      completedPomodoros: Number(row[3]) || 0,
      estimatedPomodoros: Number(row[4]) || 1,
      createdAt: row[5] ? new Date(row[5]).toISOString() : new Date().toISOString(),
      completedAt: row[6] ? new Date(row[6]).toISOString() : null
    });
  }
  return tasks;
}

function saveTasksData(ss, tasks) {
  const sheet = ss.getSheetByName('Tasks');
  if (!sheet) return;

  // Hapus semua baris data lama (kecuali header)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  }

  if (tasks.length === 0) return;

  const rows = tasks.map(function(t) {
    return [
      t.id,
      t.title,
      t.completed ? 'Selesai' : 'Belum Selesai',
      t.completedPomodoros || 0,
      t.estimatedPomodoros || 1,
      t.createdAt || new Date().toISOString(),
      t.completedAt || ''
    ];
  });

  sheet.getRange(2, 1, rows.length, 7).setValues(rows);
}

function getSessionsData(ss) {
  const sheet = ss.getSheetByName('Sessions');
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const sessions = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue;
    sessions.push({
      id: String(row[0]),
      mode: String(row[1]),
      durationMinutes: Number(row[2]) || 0,
      taskTitle: String(row[3] || '-'),
      completedAt: row[4] ? new Date(row[4]).toISOString() : new Date().toISOString()
    });
  }
  return sessions;
}

function appendSessionLog(ss, session) {
  const sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;

  sheet.appendRow([
    session.id || 'ses_' + new Date().getTime(),
    session.mode || 'focus',
    session.durationMinutes || 25,
    session.taskTitle || '-',
    session.completedAt || new Date().toISOString()
  ]);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
