/**
 * Google Sheets Service (via Google Apps Script Web App)
 */

export const googleSheetsService = {
  /**
   * Menguji apakah URL Web App Google Apps Script dapat diakses
   */
  async testConnection(url) {
    if (!url || !url.startsWith('https://script.google.com/')) {
      throw new Error('URL harus berupa alamat Google Apps Script yang valid (https://script.google.com/macros/s/.../exec)');
    }

    const testUrl = new URL(url);
    testUrl.searchParams.set('action', 'ping');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(testUrl.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google Apps Script mengembalikan status HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        return data;
      } else {
        throw new Error(data.message || 'Gagal memvalidasi respons dari Google Apps Script');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Koneksi timeout (lebih dari 12 detik). Pastikan deployment Apps Script disetel "Who has access: Anyone"');
      }
      throw err;
    }
  },

  /**
   * Mengirim seluruh daftar tasks ke Google Sheets
   */
  async syncTasks(url, tasks) {
    if (!url) return null;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Menghindari preflight CORS yang berat di Google Apps Script
      },
      body: JSON.stringify({
        action: 'syncTasks',
        tasks: tasks
      }),
      redirect: 'follow'
    });

    return await response.json();
  },

  /**
   * Mengirim log sesi yang baru saja selesai
   */
  async logSession(url, session) {
    if (!url) return null;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'logSession',
        session: session
      }),
      redirect: 'follow'
    });

    return await response.json();
  },

  /**
   * Mengambil data tasks dan riwayat sesi dari Google Sheets
   */
  async fetchRemoteData(url) {
    if (!url) return null;

    const fetchUrl = new URL(url);
    fetchUrl.searchParams.set('action', 'getAll');

    const response = await fetch(fetchUrl.toString(), {
      method: 'GET',
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    return await response.json();
  }
};
