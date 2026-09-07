import { ref, watch } from 'vue'
import { storage } from '../services/storage'
import { sound } from '../services/audio'

const settings = ref(storage.getSettings())

// Sinkronkan sound service dengan preferensi user
sound.setEnabled(settings.value.soundEnabled)

// Terapkan tema pada document root
if (typeof document !== 'undefined') {
  if (settings.value.theme === 'light') {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  } else {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
  }
}

watch(settings, (newVal) => {
  storage.saveSettings(newVal)
  sound.setEnabled(newVal.soundEnabled)

  if (typeof document !== 'undefined') {
    if (newVal.theme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }
}, { deep: true })

export function useSettings() {
  const updateSettings = (newSettings) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  const toggleTheme = () => {
    settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark'
  }

  return {
    settings,
    updateSettings,
    toggleTheme
  }
}
