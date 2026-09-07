<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content pomosheets-guide-modal">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <div class="logo-pill">
            <span class="logo-emoji">🍅</span>
            <span class="logo-title">PomoSheets</span>
          </div>
          <h3 class="modal-title">Panduan Lengkap & Cara Kerja</h3>
        </div>
        <button @click="$emit('close')" class="close-btn" title="Tutup">
          <X class="icon" />
        </button>
      </div>

      <!-- Navigation Tabs Inside Modal -->
      <div class="guide-tabs">
        <button 
          @click="activeTab = 'about'" 
          class="guide-tab-btn" 
          :class="{ active: activeTab === 'about' }"
        >
          <Sparkles class="tab-icon" />
          <span>Tentang PomoSheets</span>
        </button>
        <button 
          @click="activeTab = 'workflow'" 
          class="guide-tab-btn" 
          :class="{ active: activeTab === 'workflow' }"
        >
          <Cpu class="tab-icon" />
          <span>Cara Kerja Sistem</span>
        </button>
        <button 
          @click="activeTab = 'tutorial'" 
          class="guide-tab-btn" 
          :class="{ active: activeTab === 'tutorial' }"
        >
          <BookOpen class="tab-icon" />
          <span>Tutorial Penggunaan</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div class="modal-body">
        <!-- TAB 1: Tentang PomoSheets -->
        <div v-if="activeTab === 'about'" class="tab-pane">
          <div class="hero-box">
            <h4 class="hero-title">Apa itu PomoSheets?</h4>
            <p class="hero-text">
              <b>PomoSheets</b> adalah aplikasi produktivitas modern yang menggabungkan <b>Teknik Pomodoro</b> dan <b>To-Do List</b> dengan kemampuan pencadangan otomatis langsung ke <b>Google Sheets</b> pribadi Anda tanpa membutuhkan server backend berbayar.
            </p>
          </div>

          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon-box text-red">
                <Target class="f-icon" />
              </div>
              <div class="feature-info">
                <strong>Timer Fokus Presisi</strong>
                <p>Dilengkapi animasi circular progress, audio chime Web Audio API, dan efek perayaan konfeti.</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box text-indigo">
                <CheckSquare class="f-icon" />
              </div>
              <div class="feature-info">
                <strong>To-Do dengan Estimasi</strong>
                <p>Tentukan target estimasi pomodoro per tugas (🍅 1-10) dan pantau progres secara realtime.</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box text-green">
                <Cloud class="f-icon" />
              </div>
              <div class="feature-info">
                <strong>Google Sheets Sync</strong>
                <p>Data Anda otomatis tersimpan rapi di spreadsheet Google Drive Anda tanpa biaya langganan.</p>
              </div>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box text-amber">
                <ShieldCheck class="f-icon" />
              </div>
              <div class="feature-info">
                <strong>100% Milik Anda (Privasi Penuh)</strong>
                <p>Data hanya berada di browser Anda (LocalStorage) dan Google Drive Anda sendiri. Tidak ada database pihak ketiga.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: Cara Kerja Sistem (Arsitektur) -->
        <div v-if="activeTab === 'workflow'" class="tab-pane">
          <div class="arch-box">
            <h4 class="box-title">
              <Layers class="mini-icon text-indigo" />
              <span>Arsitektur Serverless & Offline-First</span>
            </h4>
            <p class="box-desc">
              PomoSheets dirancang dengan pendekatan <b>Offline-First</b>, sehingga aplikasi tetap berjalan cepat seketika (0ms delay) meskipun koneksi internet lambat atau terputus.
            </p>

            <div class="flow-diagram">
              <div class="flow-node">
                <span class="node-badge">Langkah 1</span>
                <strong>Aksi Pengguna di Browser</strong>
                <span>Tambah tugas / Selesai fokus</span>
              </div>
              <div class="flow-arrow">&darr;</div>
              <div class="flow-node highlight">
                <span class="node-badge">Penyimpanan Primer (0ms)</span>
                <strong>LocalStorage Browser</strong>
                <span>UI ter-update instan & data aman offline</span>
              </div>
              <div class="flow-arrow">&darr;</div>
              <div class="flow-node">
                <span class="node-badge">Background Sync</span>
                <strong>Google Apps Script Webhook</strong>
                <span>Mengirim data di latar belakang via API gratis</span>
              </div>
              <div class="flow-arrow">&darr;</div>
              <div class="flow-node sheet-node">
                <span class="node-badge">Pencadangan Pusat</span>
                <strong>Google Sheets Anda</strong>
                <span>Tersimpan di tab 'Tasks' & 'Sessions'</span>
              </div>
            </div>
          </div>

          <div class="faq-box">
            <h5 class="faq-title">Keunggulan Arsitektur Ini:</h5>
            <ul class="faq-list">
              <li><b>Gratis Selamanya:</b> Tidak memerlukan server database berbayar seperti PostgreSQL atau Firebase.</li>
              <li><b>Mudah Dianalisis:</b> Anda bisa membuka Google Sheets Anda kapan saja untuk membuat grafik atau laporan produktivitas sendiri.</li>
              <li><b>Bisa Dideploy di Mana Saja:</b> Sangat ideal untuk hosting statis gratis seperti <b>Cloudflare Pages</b> atau Vercel.</li>
            </ul>
          </div>
        </div>

        <!-- TAB 3: Tutorial Penggunaan -->
        <div v-if="activeTab === 'tutorial'" class="tab-pane">
          <div class="tutorial-steps">
            <div class="tutorial-card">
              <div class="tutorial-num">1</div>
              <div class="tutorial-content">
                <strong>Buat Tugas & Tentukan Estimasi Sesi</strong>
                <p>Ketik nama tugas di kolom input, gunakan tombol <code>+</code> / <code>-</code> untuk menentukan berapa sesi pomodoro (🍅) yang diperkirakan dibutuhkan, lalu klik <b>Tambah</b>.</p>
              </div>
            </div>

            <div class="tutorial-card">
              <div class="tutorial-num">2</div>
              <div class="tutorial-content">
                <strong>Tautkan Tugas ke Timer (Focus Now)</strong>
                <p>Klik tombol target (<Target class="inline-icon text-red" />) pada salah satu tugas. Banner tugas aktif akan muncul di atas timer, menandakan tugas tersebut sedang dikerjakan.</p>
              </div>
            </div>

            <div class="tutorial-card">
              <div class="tutorial-num">3</div>
              <div class="tutorial-content">
                <strong>Mulai Sesi Fokus (25 Menit)</strong>
                <p>Tekan tombol <b>Play</b> bulat merah. Timer akan menghitung mundur dan judul tab browser akan memperbarui sisa waktu secara otomatis.</p>
              </div>
            </div>

            <div class="tutorial-card">
              <div class="tutorial-num">4</div>
              <div class="tutorial-content">
                <strong>Selesai Sesi & Ambil Istirahat</strong>
                <p>Saat alarm berbunyi, konfeti akan merayakan keberhasilan Anda! Hitungan pomodoro pada tugas aktif bertambah secara otomatis, dan timer beralih ke mode <b>Istirahat (5m)</b>.</p>
              </div>
            </div>

            <div class="tutorial-card highlight-step">
              <div class="tutorial-num">5</div>
              <div class="tutorial-content">
                <strong>Hubungkan ke Google Sheets (Opsional)</strong>
                <p>Buka menu <b>Pengaturan (<Settings class="inline-icon" />)</b>, klik <b>Panduan Setup (2 Menit)</b>, dan salin kode Apps Script ke spreadsheet baru Anda. Tempel URL Web App untuk sinkronisasi otomatis!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="primary-modal-btn">
          Tutup Panduan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  X, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Target, 
  CheckSquare, 
  Cloud, 
  ShieldCheck, 
  Layers, 
  Settings 
} from 'lucide-vue-next'

defineEmits(['close'])

const activeTab = ref('about') // 'about' | 'workflow' | 'tutorial'
</script>

<style scoped>
.pomosheets-guide-modal {
  max-width: 660px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logo-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  width: fit-content;
}

.logo-emoji {
  font-size: 0.85rem;
}

.logo-title {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent-primary);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
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

/* Guide Tabs inside Modal */
.guide-tabs {
  display: flex;
  padding: 0.75rem 1.5rem 0;
  gap: 0.4rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.guide-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.95rem;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.guide-tab-btn:hover {
  color: var(--text-primary);
}

.guide-tab-btn.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.tab-icon {
  width: 15px;
  height: 15px;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: fadeIn 0.25s ease forwards;
}

/* Hero Box */
.hero-box {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(244, 63, 94, 0.08) 100%);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.hero-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.hero-text {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.hero-text b {
  color: var(--text-primary);
}

/* Features Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

.feature-card {
  display: flex;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.feature-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon-box.text-red { color: var(--accent-focus); }
.feature-icon-box.text-indigo { color: var(--accent-primary); }
.feature-icon-box.text-green { color: var(--accent-emerald); }
.feature-icon-box.text-amber { color: var(--accent-amber); }

.f-icon {
  width: 20px;
  height: 20px;
}

.feature-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.feature-info strong {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.feature-info p {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Architecture Flow */
.arch-box {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.box-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.box-desc {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.flow-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0;
}

.flow-node {
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.65rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.15rem;
}

.flow-node.highlight {
  border-color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.1);
}

.flow-node.sheet-node {
  border-color: var(--accent-emerald);
  background: rgba(16, 185, 129, 0.1);
}

.node-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
}

.flow-node strong {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.flow-node span:last-child {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.flow-arrow {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1;
}

.faq-box {
  background: rgba(99, 102, 241, 0.05);
  border: 1px solid var(--border-active);
  border-radius: 14px;
  padding: 1rem 1.25rem;
}

.faq-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.faq-list {
  padding-left: 1.2rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  line-height: 1.45;
}

.faq-list b {
  color: var(--text-primary);
}

/* Tutorial Steps */
.tutorial-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tutorial-card {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.85rem 1rem;
}

.tutorial-card.highlight-step {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.08);
}

.tutorial-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: #ffffff;
  font-weight: 800;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.tutorial-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.tutorial-content strong {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.tutorial-content p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.inline-icon {
  width: 14px;
  height: 14px;
  display: inline;
  vertical-align: middle;
}

.text-red { color: var(--accent-focus); }
.text-indigo { color: var(--accent-primary); }

/* Modal Footer */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.primary-modal-btn {
  background: var(--accent-primary);
  color: #ffffff;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
}

.primary-modal-btn:hover {
  filter: brightness(1.1);
}

@media (max-width: 540px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
