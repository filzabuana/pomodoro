<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h3 class="modal-title">Pengaturan Aplikasi</h3>
        <button @click="$emit('close')" class="close-btn">
          <X class="icon" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- 1. Google Sheets Integration Section -->
        <!-- 1. Google Sheets Integration Section -->
        <div class="settings-section highlight-box">
          <div class="section-title-row">
            <h4 class="section-heading">
              <FileSpreadsheet class="section-title-icon" />
              <span>Integrasi Google Sheets</span>
            </h4>
            <button @click="$emit('open-guide')" class="guide-link-btn">
              <HelpCircle class="mini-icon" />
              <span>Panduan Setup (2 Menit)</span>
            </button>
          </div>
          <p class="section-desc">
            Masukkan Web App URL dari Google Apps Script untuk mencadangkan to-do list dan riwayat sesi pomodoro Anda secara otomatis.
          </p>

          <div class="input-group">
            <input
              v-model="localUrl"
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              class="text-input"
            />
          </div>

          <div class="sheet-action-row">
            <button 
              @click="handleTestConnection" 
              class="test-btn"
              :disabled="isTesting || !localUrl.trim()"
            >
              <span v-if="isTesting" class="spinner"></span>
              <Activity v-else class="mini-icon" />
              <span>{{ isTesting ? 'Menguji...' : 'Uji Koneksi' }}</span>
            </button>

            <!-- Status Test Connection -->
            <div v-if="testResult" class="test-feedback" :class="testResult.type">
              {{ testResult.message }}
            </div>
          </div>
        </div>

        <!-- 2. Timer Durations Section -->
        <div class="settings-section">
          <h4 class="section-heading">
            <Clock class="section-title-icon" />
            <span>Durasi Timer (Menit)</span>
          </h4>
          <div class="grid-inputs">
            <div class="input-field">
              <label>Sesi Fokus</label>
              <input 
                v-model.number="localSettings.focusDuration" 
                type="number" 
                min="1" 
                max="120" 
                class="num-input"
              />
            </div>
            <div class="input-field">
              <label>Istirahat Pendek</label>
              <input 
                v-model.number="localSettings.shortBreakDuration" 
                type="number" 
                min="1" 
                max="60" 
                class="num-input"
              />
            </div>
            <div class="input-field">
              <label>Istirahat Panjang</label>
              <input 
                v-model.number="localSettings.longBreakDuration" 
                type="number" 
                min="1" 
                max="90" 
                class="num-input"
              />
            </div>
            <div class="input-field">
              <label>Interval Istirahat Panjang</label>
              <input 
                v-model.number="localSettings.longBreakInterval" 
                type="number" 
                min="1" 
                max="10" 
                class="num-input"
              />
            </div>
          </div>
        </div>

        <!-- 3. Audio & Notifications Section -->
        <div class="settings-section">
          <h4 class="section-heading">
            <Bell class="section-title-icon" />
            <span>Audio & Notifikasi</span>
          </h4>
          <div class="toggle-list">
            <label class="toggle-row">
              <span class="toggle-label">Suara Bel & Notifikasi Suara</span>
              <div class="toggle-controls">
                <button type="button" @click="testSound" class="sound-test-btn" title="Uji Suara">
                  <Volume2 class="mini-icon" />
                  <span>Tes</span>
                </button>
                <input type="checkbox" v-model="localSettings.soundEnabled" class="checkbox-switch" />
              </div>
            </label>

            <label class="toggle-row">
              <span class="toggle-label">Otomatis Mulai Istirahat (Auto-break)</span>
              <input type="checkbox" v-model="localSettings.autoStartBreaks" class="checkbox-switch" />
            </label>

            <label class="toggle-row">
              <span class="toggle-label">Otomatis Lanjut Pomodoro Berikutnya</span>
              <input type="checkbox" v-model="localSettings.autoStartPomodoro" class="checkbox-switch" />
            </label>
          </div>
        </div>

        <!-- 4. Backup & Restore Section -->
        <div class="settings-section">
          <h4 class="section-heading">
            <HardDrive class="section-title-icon" />
            <span>Cadangan Lokal (JSON)</span>
          </h4>
          <p class="section-desc">Unduh atau pulihkan seluruh data Anda ke file cadangan JSON.</p>
          <div class="backup-actions">
            <button @click="handleExport" class="backup-btn">
              <Download class="mini-icon" />
              <span>Ekspor Data</span>
            </button>
            <label class="backup-btn import-btn">
              <Upload class="mini-icon" />
              <span>Impor Data</span>
              <input type="file" accept=".json" @change="handleImport" class="hidden-input" />
            </label>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="cancel-btn">Batal</button>
        <button @click="saveAndClose" class="save-btn">Simpan Perubahan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, HelpCircle, Activity, Volume2, Download, Upload, FileSpreadsheet, Clock, Bell, HardDrive } from 'lucide-vue-next'
import { useSettings } from '../composables/useSettings'
import { useSync } from '../composables/useSync'
import { sound } from '../services/audio'
import { storage } from '../services/storage'

const emit = defineEmits(['close', 'open-guide'])

const { settings, updateSettings } = useSettings()
const { testConnection } = useSync()

const localSettings = ref({ ...settings.value })
const localUrl = ref(settings.value.googleSheetUrl || '')

const isTesting = ref(false)
const testResult = ref(null)

const testSound = () => {
  sound.playSessionEnd()
}

const handleTestConnection = async () => {
  if (!localUrl.value.trim()) return
  isTesting.value = true
  testResult.value = null

  try {
    const res = await testConnection(localUrl.value.trim())
    testResult.value = {
      type: 'success',
      message: '✓ Terhubung! ' + (res.message || 'Google Sheets siap digunakan.')
    }
  } catch (err) {
    testResult.value = {
      type: 'error',
      message: '✕ ' + (err.message || 'Gagal terhubung. Pastikan Web App disetel ke Anyone.')
    }
  } finally {
    isTesting.value = false
  }
}

const saveAndClose = () => {
  updateSettings({
    ...localSettings.value,
    googleSheetUrl: localUrl.value.trim()
  })
  sound.playClick()
  emit('close')
}

const handleExport = () => {
  const data = storage.exportAllData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pomosheets_backup_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const handleImport = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result)
      storage.importAllData(parsed)
      alert('Data berhasil dipulihkan! Halaman akan dimuat ulang.')
      window.location.reload()
    } catch (err) {
      alert('Format file cadangan tidak valid!')
    }
  }
  reader.readAsText(file)
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

.modal-title {
  font-size: 1.25rem;
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

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.highlight-box {
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid var(--border-active);
  padding: 1rem;
  border-radius: 16px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-heading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.section-title-icon {
  width: 17px;
  height: 17px;
  color: var(--accent-primary);
  flex-shrink: 0;
}

.section-desc {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.guide-link-btn {
  font-size: 0.75rem;
  color: var(--accent-primary);
  font-weight: 600;
  gap: 0.3rem;
}

.guide-link-btn:hover {
  text-decoration: underline;
}

.text-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.6rem 0.85rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

.sheet-action-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.test-btn {
  background: var(--bg-card-hover);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 0.4rem;
}

.test-feedback {
  font-size: 0.8rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
}

.test-feedback.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--accent-emerald);
}

.test-feedback.error {
  background: rgba(244, 63, 94, 0.15);
  color: var(--accent-focus);
}

.grid-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-field label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.num-input {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  font-family: var(--font-mono);
}

.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--bg-input);
  border-radius: 10px;
  cursor: pointer;
}

.toggle-label {
  font-size: 0.85rem;
  color: var(--text-primary);
}

.toggle-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sound-test-btn {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  gap: 0.25rem;
}

.checkbox-switch {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent-primary);
}

.backup-actions {
  display: flex;
  gap: 0.75rem;
}

.backup-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  gap: 0.4rem;
}

.import-btn {
  cursor: pointer;
}

.hidden-input {
  display: none;
}

.mini-icon {
  width: 14px;
  height: 14px;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.cancel-btn {
  background: var(--bg-input);
  color: var(--text-secondary);
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.save-btn {
  background: var(--accent-primary);
  color: #ffffff;
  padding: 0.6rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.save-btn:hover {
  filter: brightness(1.1);
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--text-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>
