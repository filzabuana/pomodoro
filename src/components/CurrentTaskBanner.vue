<template>
  <div v-if="activeTask" class="active-banner glass-card">
    <div class="banner-left">
      <span class="focusing-label">SEDANG MENGKERJAKAN</span>
      <div class="task-title-group">
        <span class="task-title">{{ activeTask.title }}</span>
        <span class="pomo-count-tag">🍅 {{ activeTask.completedPomodoros }} / {{ activeTask.estimatedPomodoros }}</span>
      </div>
    </div>

    <div class="banner-actions">
      <button 
        @click="toggleTask(activeTask.id)" 
        class="banner-action-btn complete" 
        title="Tandai Selesai"
      >
        <Check class="btn-icon" />
        <span>Selesai</span>
      </button>

      <button 
        @click="setActiveTask(activeTask.id)" 
        class="banner-action-btn dismiss" 
        title="Lepas Fokus Tugas Ini"
      >
        <X class="btn-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Check, X } from 'lucide-vue-next'
import { useTodos } from '../composables/useTodos'

const { activeTask, toggleTask, setActiveTask } = useTodos()
</script>

<style scoped>
.active-banner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid var(--accent-focus-glow);
  border-radius: 18px;
  gap: 1rem;
}

.banner-left {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.focusing-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--accent-focus);
}

.task-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.task-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pomo-count-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.banner-action-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  gap: 0.35rem;
  border: 1px solid var(--border-color);
}

.banner-action-btn.complete {
  background: var(--accent-emerald);
  color: #ffffff;
  border-color: transparent;
}

.banner-action-btn.complete:hover {
  filter: brightness(1.1);
}

.banner-action-btn.dismiss {
  background: var(--bg-input);
  color: var(--text-muted);
  padding: 0.35rem;
}

.banner-action-btn.dismiss:hover {
  color: var(--text-primary);
}

.btn-icon {
  width: 14px;
  height: 14px;
}
</style>
