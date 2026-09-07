<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <div class="header-title-group">
          <span class="guide-badge">Panduan Cepat</span>
          <h3 class="modal-title">Hubungkan ke Google Sheets (2 Menit)</h3>
        </div>
        <button @click="$emit('close')" class="close-btn">
          <X class="icon" />
        </button>
      </div>

      <div class="modal-body">
        <ol class="guide-steps">
          <li class="step-item">
            <span class="step-num">1</span>
            <div class="step-details">
              <strong>Buat Spreadsheet Baru</strong>
              <p>Buka <a href="https://sheets.new" target="_blank" rel="noopener">sheets.new</a> di browser Anda untuk membuat Google Spreadsheet baru.</p>
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">2</span>
            <div class="step-details">
              <strong>Buka Apps Script</strong>
              <p>Di spreadsheet tersebut, klik menu <b>Ekstensi</b> (Extensions) &rarr; <b>Apps Script</b>.</p>
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">3</span>
            <div class="step-details">
              <strong>Salin & Tempel Kode Script</strong>
              <p>Hapus semua kode di editor `Code.gs`, lalu tempelkan kode di bawah ini:</p>
              <div class="code-action-box">
                <button @click="copyCode" class="copy-code-btn">
                  <Check v-if="copied" class="btn-icon text-green" />
                  <Copy v-else class="btn-icon" />
                  <span>{{ copied ? 'Kode Berhasil Disalin!' : 'Salin Kode Google Apps Script' }}</span>
                </button>
              </div>
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">4</span>
            <div class="step-details">
              <strong>Terapkan Sebagai Aplikasi Web (Deploy)</strong>
              <p>Klik tombol biru <b>Terapkan</b> (Deploy) &rarr; <b>Penerapan baru</b> (New deployment).</p>
              <div class="important-note">
                <p>⚙️ Pilih jenis: <b>Aplikasi Web</b> (Web app)</p>
                <p>👤 Pada kolom <i>"Yang memiliki akses" (Who has access)</i>: <b>Siapa saja (Anyone)</b> <span class="badge-vital">PENTING</span></p>
              </div>
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">5</span>
            <div class="step-details">
              <strong>Salin URL & Masukkan ke Pengaturan</strong>
              <p>Klik <b>Terapkan</b> (izinkan otorisasi Google jika diminta). Salin <b>URL Aplikasi Web</b> yang berakhiran <code>/exec</code>, lalu tempelkan di Pengaturan aplikasi ini!</p>
            </div>
          </li>
        </ol>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="primary-modal-btn">
          Saya Mengerti, Kembali ke Pengaturan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Copy, Check } from 'lucide-vue-next'

defineEmits(['close'])

const copied = ref(false)

const appsScriptCode = `function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsConfigured(ss);

    if (action === 'ping') {
      return jsonResponse({ status: 'success', message: 'Koneksi ke Google Sheets berhasil!', timestamp: new Date().toISOString() });
    }

    if (action === 'getAll') {
      return jsonResponse({ status: 'success', tasks: getTasksData(ss), sessions: getSessionsData(ss), syncedAt: new Date().toISOString() });
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
      return jsonResponse({ status: 'error', message: 'No payload' });
    }

    const payload = JSON.parse(e.postData.contents);
    if (payload.action === 'syncTasks') {
      saveTasksData(ss, payload.tasks || []);
      return jsonResponse({ status: 'success', count: (payload.tasks || []).length });
    }
    if (payload.action === 'logSession') {
      if (payload.session) appendSessionLog(ss, payload.session);
      return jsonResponse({ status: 'success' });
    }
    return jsonResponse({ status: 'error', message: 'Invalid action' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function ensureSheetsConfigured(ss) {
  let taskSheet = ss.getSheetByName('Tasks');
  if (!taskSheet) {
    taskSheet = ss.insertSheet('Tasks');
    const headers = ['ID', 'Judul Tugas', 'Status', 'Pomodoro Selesai', 'Estimasi Pomodoro', 'Dibuat Pada', 'Selesai Pada'];
    taskSheet.appendRow(headers);
    taskSheet.getRange(1, 1, 1, headers.length).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
    taskSheet.setFrozenRows(1);
  }
  let sessionSheet = ss.getSheetByName('Sessions');
  if (!sessionSheet) {
    sessionSheet = ss.insertSheet('Sessions');
    const headers = ['ID Sesi', 'Mode', 'Durasi (Menit)', 'Nama Tugas Terkait', 'Waktu Selesai'];
    sessionSheet.appendRow(headers);
    sessionSheet.getRange(1, 1, 1, headers.length).setBackground('#0f172a').setFontColor('#ffffff').setFontWeight('bold');
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
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  if (tasks.length === 0) return;
  const rows = tasks.map(t => [t.id, t.title, t.completed ? 'Selesai' : 'Belum Selesai', t.completedPomodoros || 0, t.estimatedPomodoros || 1, t.createdAt || '', t.completedAt || '']);
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
  sheet.appendRow([session.id || 'ses_' + Date.now(), session.mode || 'focus', session.durationMinutes || 25, session.taskTitle || '-', session.completedAt || new Date().toISOString()]);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(appsScriptCode)
    copied.value = true
    setTimeout(() => { copied.value = false }, 3000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>

<style scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.guide-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-primary);
  letter-spacing: 0.05em;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.2rem;
}

.close-btn {
  color: var(--text-muted);
  padding: 0.4rem;
  border-radius: 8px;
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--bg-input);
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.guide-steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.step-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.step-details {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.step-details strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.step-details a {
  color: var(--accent-primary);
  text-decoration: underline;
  font-weight: 600;
}

.code-action-box {
  margin-top: 0.75rem;
}

.copy-code-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.copy-code-btn:hover {
  background: var(--bg-card-hover);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.text-green {
  color: var(--accent-emerald);
}

.important-note {
  margin-top: 0.5rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.6rem 0.85rem;
  border-radius: 10px;
  font-size: 0.82rem;
  color: var(--text-primary);
}

.badge-vital {
  background: var(--accent-focus);
  color: #fff;
  font-size: 0.65rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-weight: 700;
}

code {
  background: var(--bg-input);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.primary-modal-btn {
  background: var(--accent-primary);
  color: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.primary-modal-btn:hover {
  filter: brightness(1.1);
}
</style>
