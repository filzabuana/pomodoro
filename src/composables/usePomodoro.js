import { ref, computed, watch, onMounted } from 'vue'
import { useSettings } from './useSettings'
import { useTodos } from './useTodos'
import { useSync } from './useSync'
import { sound } from '../services/audio'
import { storage } from '../services/storage'
import confetti from 'canvas-confetti'

export function usePomodoro() {
  const { settings } = useSettings()
  const { activeTaskId, activeTask, incrementTaskPomodoro } = useTodos()
  const { syncSession } = useSync()

  const mode = ref('focus') // 'focus' | 'shortBreak' | 'longBreak'
  const isRunning = ref(false)
  const completedFocusSessions = ref(0)
  
  // Ambil durasi berdasarkan mode saat ini
  const currentDuration = computed(() => {
    if (mode.value === 'shortBreak') return settings.value.shortBreakDuration * 60
    if (mode.value === 'longBreak') return settings.value.longBreakDuration * 60
    return settings.value.focusDuration * 60
  })

  const timeLeft = ref(currentDuration.value)
  let timerInterval = null

  // Format MM:SS
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  })

  // Persentase kemajuan (0% -> 100%)
  const progressPercentage = computed(() => {
    const total = currentDuration.value
    if (total <= 0) return 0
    return Math.min(100, Math.max(0, ((total - timeLeft.value) / total) * 100))
  })

  // Perbarui judul tab browser secara dinamis
  watch([formattedTime, mode, isRunning], () => {
    if (typeof document === 'undefined') return
    const modeLabel = mode.value === 'focus' ? '🎯 Fokus' : (mode.value === 'shortBreak' ? '☕ Istirahat' : '🌴 Santai')
    if (isRunning.value) {
      document.title = `(${formattedTime.value}) ${modeLabel} - PomoSheets`
    } else {
      document.title = `PomoSheets - Pomodoro & To-Do List`
    }
  })

  // Sesuaikan timeLeft jika durasi di settings berubah saat timer belum jalan
  watch(currentDuration, (newDuration) => {
    if (!isRunning.value) {
      timeLeft.value = newDuration
    }
  })

  // Request browser notification permission jika diizinkan
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    }
  }

  const showNotification = (title, body) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>'
        })
      } catch (e) {
        console.warn('Browser notification error', e)
      }
    }
  }

  const startTimer = () => {
    if (isRunning.value) return
    isRunning.value = true
    sound.playClick()
    requestNotificationPermission()

    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value -= 1
      } else {
        handleTimerComplete()
      }
    }, 1000)
  }

  const pauseTimer = () => {
    if (!isRunning.value) return
    isRunning.value = false
    sound.playClick()
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const resetTimer = () => {
    pauseTimer()
    timeLeft.value = currentDuration.value
    sound.playClick()
  }

  const switchMode = (newMode) => {
    if (mode.value === newMode) return
    pauseTimer()
    mode.value = newMode
    timeLeft.value = currentDuration.value
    sound.playClick()
  }

  const handleTimerComplete = () => {
    pauseTimer()
    sound.playSessionEnd()

    const finishedMode = mode.value
    const durationMinutes = Math.round(currentDuration.value / 60)

    if (finishedMode === 'focus') {
      completedFocusSessions.value += 1

      // Tambah counter pomodoro pada task yang aktif jika ada
      if (activeTaskId.value) {
        incrementTaskPomodoro(activeTaskId.value)
      }

      // Rayakan dengan konfeti visual
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        })
      } catch (e) {}

      showNotification('Sesi Fokus Selesai! 🎉', 'Kerja bagus! Waktunya istirahat sejenak.')

      // Catat sesi ke LocalStorage & Google Sheets
      const sessionData = {
        id: 'ses_' + Date.now(),
        mode: 'focus',
        durationMinutes: durationMinutes,
        taskTitle: activeTask.value ? activeTask.value.title : 'Fokus Umum',
        completedAt: new Date().toISOString()
      }

      const allSessions = storage.getSessions()
      allSessions.unshift(sessionData)
      storage.saveSessions(allSessions)
      syncSession(sessionData)

      // Transisi otomatis ke istirahat
      if (completedFocusSessions.value % settings.value.longBreakInterval === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }

      if (settings.value.autoStartBreaks) {
        startTimer()
      }
    } else {
      // Selesai Istirahat
      showNotification('Waktu Istirahat Berakhir 🔔', 'Siap untuk kembali fokus?')
      switchMode('focus')

      if (settings.value.autoStartPomodoro) {
        startTimer()
      }
    }
  }

  const skipTimer = () => {
    if (mode.value === 'focus') {
      switchMode('shortBreak')
    } else {
      switchMode('focus')
    }
  }

  return {
    mode,
    isRunning,
    timeLeft,
    currentDuration,
    formattedTime,
    progressPercentage,
    completedFocusSessions,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    skipTimer
  }
}
