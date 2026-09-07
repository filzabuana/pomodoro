<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content about-modal">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-left">
          <span class="info-badge">Edukasi & Tips</span>
          <h3 class="modal-title">Tentang Teknik Pomodoro 🍅</h3>
        </div>
        <button @click="$emit('close')" class="close-btn" title="Tutup">
          <X class="icon" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Hero Explanation -->
        <section class="about-hero">
          <p class="hero-quote">
            "Teknik manajemen waktu sederhana namun terbukti secara ilmiah untuk melatih fokus mendalam <i>(deep work)</i> dan mencegah kelelahan mental <i>(burnout)</i>."
          </p>
          <p class="hero-desc">
            Diciptakan pada akhir 1980-an oleh <b>Francesco Cirillo</b> saat masih mahasiswa. Nama <i>"Pomodoro"</i> diambil dari kata bahasa Italia untuk <b>tomat</b>, terinspirasi dari timer dapur berbentuk tomat yang digunakannya saat belajar.
          </p>
        </section>

        <!-- 5 Langkah Kerja Pomodoro -->
        <section class="section-block">
          <h4 class="block-title">
            <Zap class="title-icon-svg text-focus" />
            <span>5 Langkah Menjalankan Teknik Pomodoro</span>
          </h4>
          <div class="steps-grid">
            <div class="step-card">
              <span class="step-number">01</span>
              <div class="step-content">
                <strong>Pilih Tugas (To-Do)</strong>
                <p>Tentukan satu tugas spesifik yang ingin kamu selesaikan dari daftar tugas.</p>
              </div>
            </div>

            <div class="step-card">
              <span class="step-number">02</span>
              <div class="step-content">
                <strong>Set Timer 25 Menit (1 Pomodoro)</strong>
                <p>Mulai timer dan curahkan 100% konsentrasi Anda hanya pada tugas tersebut.</p>
              </div>
            </div>

            <div class="step-card">
              <span class="step-number">03</span>
              <div class="step-content">
                <strong>Fokus Tanpa Distraksi</strong>
                <p>Jauhkan notifikasi media sosial, tab browser tak terpakai, dan interupsi lain hingga bel berbunyi.</p>
              </div>
            </div>

            <div class="step-card">
              <span class="step-number">04</span>
              <div class="step-content">
                <strong>Istirahat Pendek (5 Menit)</strong>
                <p>Saat alarm berbunyi, berhenti! Bangkit dari kursi, regangkan badan, minum air putih, atau istirahatkan mata.</p>
              </div>
            </div>

            <div class="step-card highlight">
              <span class="step-number">05</span>
              <div class="step-content">
                <strong>Istirahat Panjang (15 - 30 Menit)</strong>
                <p>Setelah menyelesaikan 4 sesi pomodoro berturut-turut, ambil waktu santai lebih panjang untuk meregenerasi energi otak.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Manfaat Utama -->
        <section class="section-block">
          <h4 class="block-title">
            <Target class="title-icon-svg text-accent" />
            <span>Mengapa Teknik Ini Sangat Efektif?</span>
          </h4>
          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-icon-wrapper">
                <Brain class="benefit-icon-svg" />
              </div>
              <div class="benefit-text">
                <strong>Mengatasi Rasa Malas / Prokrastinasi</strong>
                <p>Memulai komitmen kecil selama 25 menit jauh lebih mudah diterima otak daripada membayangkan beban kerja seharian.</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon-wrapper">
                <BatteryCharging class="benefit-icon-svg" />
              </div>
              <div class="benefit-text">
                <strong>Mencegah Kelelahan Mental</strong>
                <p>Istirahat terjadwal membuat stamina fokus Anda tetap stabil dari pagi hingga sore tanpa kehabisan energi.</p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon-wrapper">
                <BarChart2 class="benefit-icon-svg" />
              </div>
              <div class="benefit-text">
                <strong>Estimasi Kerja yang Lebih Nyata</strong>
                <p>Dengan menghitung jumlah pomodoro per tugas, Anda jadi tahu persis berapa lama waktu yang dibutuhkan untuk sebuah proyek.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Golden Rules -->
        <section class="section-block tips-box">
          <h4 class="tips-title">
            <Lightbulb class="tips-icon-svg" />
            <span>Aturan Emas Pomodoro</span>
          </h4>
          <ul class="tips-list">
            <li><b>Satu Pomodoro Tak Terbagi:</b> Jangan jeda timer untuk mengecek chat jika tidak darurat. Jika terputus lama, reset timer.</li>
            <li><b>Istirahat adalah Istirahat:</b> Jangan gunakan waktu 5 menit istirahat untuk membaca email kerja berat. Biarkan pikiran rileks.</li>
            <li><b>Tugas Selesai Sebelum 25 Menit?</b> Gunakan sisa waktu untuk meninjau ulang <i>(review)</i> atau menyempurnakan hasil pekerjaan Anda.</li>
          </ul>
        </section>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="primary-modal-btn">
          <Play class="btn-icon" />
          <span>Mulai Fokus Sekarang</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Zap, Target, Brain, BatteryCharging, BarChart2, Lightbulb, Play } from 'lucide-vue-next'

defineEmits(['close'])
</script>

<style scoped>
.about-modal {
  max-width: 680px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.info-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent-focus);
  letter-spacing: 0.05em;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 0.15rem;
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
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-height: 70vh;
  overflow-y: auto;
}

/* Hero Section */
.about-hero {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-quote {
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.5;
}

.hero-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Sections */
.section-block {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.block-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.title-icon-svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.text-focus {
  color: var(--accent-focus);
}

.text-accent {
  color: var(--accent-primary);
}

/* Steps Grid */
.steps-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.step-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.step-card.highlight {
  border-color: rgba(139, 92, 246, 0.4);
  background: rgba(139, 92, 246, 0.08);
}

.step-number {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--accent-focus);
  background: var(--bg-card);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.step-card.highlight .step-number {
  color: var(--accent-long-break);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.step-content strong {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.step-content p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Benefits Grid */
.benefits-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.65rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 14px;
}

.benefit-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--accent-primary);
}

.benefit-icon-svg {
  width: 18px;
  height: 18px;
}

.benefit-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.benefit-text strong {
  font-size: 0.88rem;
  color: var(--text-primary);
}

.benefit-text p {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Tips Box */
.tips-box {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 1rem 1.25rem;
  border-radius: 16px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--accent-amber);
  margin-bottom: 0.5rem;
}

.tips-icon-svg {
  width: 18px;
  height: 18px;
  color: var(--accent-amber);
}

.tips-list {
  list-style-type: disc;
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tips-list b {
  color: var(--text-primary);
}

/* Footer */
.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.primary-modal-btn {
  background: var(--accent-focus);
  color: #ffffff;
  padding: 0.65rem 1.4rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 16px var(--accent-focus-glow);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.primary-modal-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}
</style>
