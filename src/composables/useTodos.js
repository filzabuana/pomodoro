import { ref, computed, watch } from 'vue'
import { storage } from '../services/storage'
import { sound } from '../services/audio'

const tasks = ref(storage.getTasks())
const activeTaskId = ref(storage.getActiveTaskId())
const filter = ref('all') // 'all' | 'active' | 'completed'

// Callback trigger untuk sync manager
let onTaskChangeCallback = null

export function registerTaskChangeCallback(fn) {
  onTaskChangeCallback = fn
}

watch(tasks, (newVal) => {
  storage.saveTasks(newVal)
  if (onTaskChangeCallback) {
    onTaskChangeCallback(newVal)
  }
}, { deep: true })

watch(activeTaskId, (newVal) => {
  storage.setActiveTaskId(newVal)
})

export function useTodos() {
  const activeTask = computed(() => {
    if (!activeTaskId.value) return null
    return tasks.value.find(t => t.id === activeTaskId.value) || null
  })

  const filteredTasks = computed(() => {
    if (filter.value === 'active') {
      return tasks.value.filter(t => !t.completed)
    }
    if (filter.value === 'completed') {
      return tasks.value.filter(t => t.completed)
    }
    return tasks.value
  })

  const stats = computed(() => {
    const total = tasks.value.length
    const completed = tasks.value.filter(t => t.completed).length
    const remaining = total - completed
    return { total, completed, remaining }
  })

  const addTask = (title, estimatedPomodoros = 1) => {
    if (!title || !title.trim()) return
    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      completed: false,
      completedPomodoros: 0,
      estimatedPomodoros: Number(estimatedPomodoros) || 1,
      createdAt: new Date().toISOString(),
      completedAt: null
    }

    tasks.value.unshift(newTask)
    sound.playClick()

    // Jika belum ada active task, jadikan ini active task otomatis
    if (!activeTaskId.value) {
      activeTaskId.value = newTask.id
    }
    return newTask
  }

  const toggleTask = (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return

    task.completed = !task.completed
    task.completedAt = task.completed ? new Date().toISOString() : null

    if (task.completed) {
      sound.playTaskComplete()
      if (activeTaskId.value === id) {
        // Cari tugas berikutnya yang belum selesai
        const nextActive = tasks.value.find(t => !t.completed && t.id !== id)
        activeTaskId.value = nextActive ? nextActive.id : null
      }
    } else {
      sound.playClick()
    }
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
    if (activeTaskId.value === id) {
      const nextActive = tasks.value.find(t => !t.completed)
      activeTaskId.value = nextActive ? nextActive.id : null
    }
    sound.playClick()
  }

  const updateTask = (id, updates) => {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updates }
    }
  }

  const setActiveTask = (id) => {
    if (activeTaskId.value === id) {
      activeTaskId.value = null // Toggle unselect
    } else {
      activeTaskId.value = id
    }
    sound.playClick()
  }

  const incrementTaskPomodoro = (id) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completedPomodoros = (task.completedPomodoros || 0) + 1
    }
  }

  const replaceAllTasks = (newTasksList) => {
    tasks.value = newTasksList
  }

  return {
    tasks,
    activeTaskId,
    activeTask,
    filter,
    filteredTasks,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    setActiveTask,
    incrementTaskPomodoro,
    replaceAllTasks
  }
}
