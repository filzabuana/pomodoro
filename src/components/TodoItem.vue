<template>
  <div 
    class="todo-item"
    :class="{ 
      'is-completed': task.completed,
      'is-active': isActive
    }"
  >
    <!-- Checkbox -->
    <button 
      @click="$emit('toggle', task.id)" 
      class="todo-check-btn" 
      :class="{ checked: task.completed }"
      :title="task.completed ? 'Tandai belum selesai' : 'Tandai selesai'"
    >
      <Check v-if="task.completed" class="check-icon" />
    </button>

    <!-- Task Content: Editing vs Display -->
    <div class="todo-content" @dblclick="startEdit">
      <input 
        v-if="isEditing" 
        ref="editInputRef"
        v-model="editedTitle"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
        class="todo-edit-input"
        type="text"
      />
      <div v-else class="todo-title-row">
        <span class="todo-title" :title="task.title">{{ task.title }}</span>
      </div>
    </div>

    <!-- Pomodoro Progress Pill -->
    <div class="pomo-badge" :title="`${task.completedPomodoros} dari ${task.estimatedPomodoros} sesi pomodoro selesai`">
      <span class="tomato-emoji">🍅</span>
      <span class="pomo-count">{{ task.completedPomodoros }} / {{ task.estimatedPomodoros }}</span>
    </div>

    <!-- Actions: Focus Now / Edit / Delete -->
    <div class="todo-actions">
      <!-- Focus Toggle Button -->
      <button 
        v-if="!task.completed"
        @click="$emit('set-active', task.id)" 
        class="action-btn focus-btn"
        :class="{ active: isActive }"
        :title="isActive ? 'Sedang difokuskan di timer' : 'Jadikan tugas aktif untuk timer'"
      >
        <Target class="action-icon" />
      </button>

      <!-- Edit Button -->
      <button 
        @click="startEdit" 
        class="action-btn" 
        title="Edit nama tugas"
      >
        <Edit3 class="action-icon" />
      </button>

      <!-- Delete Button -->
      <button 
        @click="$emit('delete', task.id)" 
        class="action-btn delete-btn" 
        title="Hapus tugas"
      >
        <Trash2 class="action-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Check, Target, Edit3, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'delete', 'update', 'set-active'])

const isEditing = ref(false)
const editedTitle = ref(props.task.title)
const editInputRef = ref(null)

const startEdit = () => {
  editedTitle.value = props.task.title
  isEditing.value = true
  nextTick(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
      editInputRef.value.select()
    }
  })
}

const saveEdit = () => {
  if (!isEditing.value) return
  if (editedTitle.value.trim() && editedTitle.value.trim() !== props.task.title) {
    emit('update', props.task.id, { title: editedTitle.value.trim() })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editedTitle.value = props.task.title
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.2s ease;
  position: relative;
}

.todo-item:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-active);
  transform: translateX(2px);
}

.todo-item.is-active {
  border-color: var(--accent-focus);
  background: rgba(244, 63, 94, 0.08);
  box-shadow: 0 0 16px -4px var(--accent-focus-glow);
}

.todo-item.is-completed {
  opacity: 0.6;
}

.todo-item.is-completed .todo-title {
  text-decoration: line-through;
  color: var(--text-muted);
}

/* Checkbox */
.todo-check-btn {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 2px solid var(--border-color);
  background: var(--bg-input);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.todo-check-btn:hover {
  border-color: var(--accent-emerald);
}

.todo-check-btn.checked {
  background: var(--accent-emerald);
  border-color: var(--accent-emerald);
}

.check-icon {
  width: 14px;
  height: 14px;
  color: #ffffff;
  stroke-width: 3;
}

/* Content */
.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 0.92rem;
  color: var(--text-primary);
  word-break: break-word;
  line-height: 1.4;
  font-weight: 500;
}

.todo-edit-input {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  font-size: 0.92rem;
}

/* Pomodoro Badge */
.pomo-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
  font-family: var(--font-mono);
}

.tomato-emoji {
  font-size: 0.85rem;
}

/* Action buttons */
.todo-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  color: var(--text-primary);
  background: var(--bg-input);
}

.action-btn.focus-btn:hover,
.action-btn.focus-btn.active {
  color: var(--accent-focus);
  background: rgba(244, 63, 94, 0.15);
}

.action-btn.delete-btn:hover {
  color: var(--accent-focus);
}

.action-icon {
  width: 15px;
  height: 15px;
}
</style>
