<template>
  <div class="todo-card glass-card">
    <!-- Header with Filter Tabs -->
    <div class="todo-header">
      <div class="header-left">
        <h2 class="section-title">Daftar Tugas</h2>
        <span class="task-count-badge">{{ stats.remaining }} aktif</span>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button 
          @click="filter = 'all'" 
          class="filter-tab" 
          :class="{ active: filter === 'all' }"
        >
          Semua
        </button>
        <button 
          @click="filter = 'active'" 
          class="filter-tab" 
          :class="{ active: filter === 'active' }"
        >
          Aktif
        </button>
        <button 
          @click="filter = 'completed'" 
          class="filter-tab" 
          :class="{ active: filter === 'completed' }"
        >
          Selesai
        </button>
      </div>
    </div>

    <!-- Add Task Card / Input Bar -->
    <form @submit.prevent="handleAddTask" class="add-task-form">
      <div class="input-wrapper">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Apa yang ingin kamu selesaikan?..."
          class="task-input"
          maxlength="120"
        />
      </div>

      <!-- Estimasi Pomodoro Stepper & Submit Button -->
      <div class="add-actions">
        <div class="est-stepper" title="Estimasi jumlah pomodoro">
          <span class="est-label">🍅 Est:</span>
          <button type="button" @click="decreaseEst" class="step-btn" :disabled="newEst <= 1">-</button>
          <span class="step-val">{{ newEst }}</span>
          <button type="button" @click="increaseEst" class="step-btn" :disabled="newEst >= 10">+</button>
        </div>

        <button type="submit" class="submit-task-btn" :disabled="!newTitle.trim()">
          <Plus class="btn-icon" />
          <span>Tambah</span>
        </button>
      </div>
    </form>

    <!-- Tasks List -->
    <div class="tasks-list">
      <template v-if="filteredTasks.length > 0">
        <TodoItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          :is-active="activeTaskId === task.id"
          @toggle="toggleTask"
          @delete="deleteTask"
          @update="updateTask"
          @set-active="setActiveTask"
        />
      </template>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <ClipboardList class="empty-icon-svg" />
        <p class="empty-text">
          <span v-if="filter === 'completed'">Belum ada tugas yang selesai. Tetap semangat!</span>
          <span v-else-if="filter === 'active'">Semua tugas sudah selesai! Kerja bagus.</span>
          <span v-else>Belum ada tugas. Tambahkan tugas pertamamu di atas!</span>
        </p>
      </div>
    </div>

    <!-- Footer Stats / Summary -->
    <div v-if="tasks.length > 0" class="todo-footer">
      <span class="summary-text">
        Total Pomodoro: <b>{{ totalCompletedPomos }}</b> / {{ totalEstimatedPomos }} 🍅
      </span>
      <span class="summary-text estimated-time">
        ≈ {{ estimatedRemainingMinutes }} menit fokus tersisa
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, ClipboardList } from 'lucide-vue-next'
import { useTodos } from '../composables/useTodos'
import { useSettings } from '../composables/useSettings'
import TodoItem from './TodoItem.vue'

const {
  tasks,
  activeTaskId,
  filter,
  filteredTasks,
  stats,
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
  setActiveTask
} = useTodos()

const { settings } = useSettings()

const newTitle = ref('')
const newEst = ref(1)

const increaseEst = () => {
  if (newEst.value < 10) newEst.value++
}

const decreaseEst = () => {
  if (newEst.value > 1) newEst.value--
}

const handleAddTask = () => {
  if (!newTitle.value.trim()) return
  addTask(newTitle.value.trim(), newEst.value)
  newTitle.value = ''
  newEst.value = 1
}

const totalCompletedPomos = computed(() => {
  return tasks.value.reduce((sum, t) => sum + (t.completedPomodoros || 0), 0)
})

const totalEstimatedPomos = computed(() => {
  return tasks.value.reduce((sum, t) => sum + (t.estimatedPomodoros || 1), 0)
})

const estimatedRemainingMinutes = computed(() => {
  const remainingPomos = tasks.value
    .filter(t => !t.completed)
    .reduce((sum, t) => {
      const needed = Math.max(0, (t.estimatedPomodoros || 1) - (t.completedPomodoros || 0))
      return sum + needed
    }, 0)
  return remainingPomos * settings.value.focusDuration
})
</script>

<style scoped>
.todo-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.todo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.task-count-badge {
  font-size: 0.72rem;
  font-weight: 600;
  background: var(--bg-input);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  background: var(--bg-input);
  padding: 0.25rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  gap: 0.2rem;
}

.filter-tab {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.filter-tab:hover {
  color: var(--text-primary);
}

.filter-tab.active {
  background: var(--accent-primary);
  color: #ffffff;
}

/* Add Task Form */
.add-task-form {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s ease;
}

.add-task-form:focus-within {
  border-color: var(--border-active);
}

.task-input {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.95rem;
  padding: 0.25rem 0.5rem;
}

.task-input::placeholder {
  color: var(--text-muted);
}

.add-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.est-stepper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-card);
  padding: 0.25rem 0.6rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.step-btn {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-weight: bold;
}

.step-btn:hover:not(:disabled) {
  background: var(--bg-card-hover);
}

.step-val {
  font-family: var(--font-mono);
  min-width: 16px;
  text-align: center;
  color: var(--text-primary);
}

.submit-task-btn {
  background: var(--accent-primary);
  color: #ffffff;
  padding: 0.45rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.4rem;
}

.submit-task-btn:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Tasks list */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon-svg {
  width: 44px;
  height: 44px;
  margin-bottom: 0.75rem;
  opacity: 0.5;
  color: var(--text-muted);
}

.empty-text {
  font-size: 0.9rem;
  max-width: 280px;
}

/* Footer Summary */
.todo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.estimated-time {
  font-style: italic;
}

@media (max-width: 480px) {
  .todo-card {
    padding: 1.15rem 0.85rem;
    border-radius: 20px;
  }

  .section-title {
    font-size: 1.05rem;
  }

  .filter-tab {
    padding: 0.25rem 0.55rem;
    font-size: 0.72rem;
  }

  .task-input {
    font-size: 0.88rem;
  }

  .est-stepper {
    padding: 0.2rem 0.45rem;
    font-size: 0.75rem;
  }

  .step-btn {
    width: 20px;
    height: 20px;
  }

  .submit-task-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }

  .todo-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    font-size: 0.75rem;
  }
}
</style>
