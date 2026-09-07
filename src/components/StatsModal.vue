<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">📈 Statistik & Riwayat Fokus</h3>
        <button @click="$emit('close')" class="close-btn">
          <X class="icon" />
        </button>
      </div>

      <div class="modal-body">
        <!-- 3 Stat Highlight Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value">{{ formattedFocusTime }}</span>
            <span class="stat-label">Total Waktu Fokus</span>
          </div>

          <div class="stat-card">
            <span class="stat-icon">🍅</span>
            <span class="stat-value">{{ totalSessions }}</span>
            <span class="stat-label">Sesi Selesai</span>
          </div>

          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <span class="stat-value">{{ completedTasksCount }}</span>
            <span class="stat-label">Tugas Tuntas</span>
          </div>
        </div>

        <!-- Recent Sessions History Table -->
        <div class="history-section">
          <div class="history-header">
            <h4 class="history-title">Riwayat Sesi Terbaru</h4>
            <button 
              v-if="sessions.length > 0" 
              @click="clearHistory" 
              class="clear-history-btn"
            >
              Hapus Riwayat
            </button>
          </div>

          <div class="history-list">
            <template v-if="sessions.length > 0">
              <div v-for="s in sessions.slice(0, 15)" :key="s.id" class="history-item">
                <div class="item-left">
                  <span class="item-badge">🍅 {{ s.durationMinutes }}m</span>
                  <div class="item-details">
                    <span class="item-task">{{ s.taskTitle || 'Fokus Umum' }}</span>
                    <span class="item-date">{{ formatDate(s.completedAt) }}</span>
                  </div>
                </div>
                <span class="item-mode">{{ s.mode === 'focus' ? 'Fokus' : 'Istirahat' }}</span>
              </div>
            </template>
            <div v-else class="empty-history">
              <span>Belum ada riwayat sesi. Mulai sesi pertama Anda sekarang! 🎯</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="primary-modal-btn">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { storage } from '../services/storage'
import { useTodos } from '../composables/useTodos'

defineEmits(['close'])

const { tasks } = useTodos()
const sessions = ref(storage.getSessions())

const totalMinutes = computed(() => {
  return sessions.value.reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0)
})

const formattedFocusTime = computed(() => {
  const mins = totalMinutes.value
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  if (hours > 0) return `${hours}j ${rem}m`
  return `${rem}m`
})

const totalSessions = computed(() => sessions.value.length)

const completedTasksCount = computed(() => {
  return tasks.value.filter(t => t.completed).length
})

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const clearHistory = () => {
  if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat sesi lokal?')) {
    storage.saveSessions([])
    sessions.value = []
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* History Section */
.history-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.clear-history-btn {
  font-size: 0.75rem;
  color: var(--accent-focus);
}

.clear-history-btn:hover {
  text-decoration: underline;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 0.85rem;
  background: var(--bg-input);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.item-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-primary);
  background: var(--bg-card);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-task {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.item-date {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.item-mode {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  flex-shrink: 0;
}

.empty-history {
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
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

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
