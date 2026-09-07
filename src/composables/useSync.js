import { ref, onMounted, onUnmounted } from 'vue'
import { googleSheetsService } from '../services/googleSheets'
import { storage } from '../services/storage'
import { useSettings } from './useSettings'
import { registerTaskChangeCallback } from './useTodos'

const syncStatus = ref('idle') // 'idle' | 'syncing' | 'synced' | 'offline' | 'error'
const lastSyncTime = ref(null)
const errorMessage = ref('')
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

let debounceTimer = null

export function useSync() {
  const { settings } = useSettings()

  const setStatus = (status, error = '') => {
    syncStatus.value = status
    errorMessage.value = error
    if (status === 'synced') {
      lastSyncTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  // Handle Online / Offline Events
  const handleOnline = () => {
    isOnline.value = true
    if (settings.value.googleSheetUrl) {
      manualSync()
    } else {
      setStatus('idle')
    }
  }

  const handleOffline = () => {
    isOnline.value = false
    setStatus('offline')
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }

  /**
   * Mengirim sync tasks dengan debounce 1.5 detik agar tidak spam request saat mengetik/toggle
   */
  const triggerTaskSync = (tasksList) => {
    if (!settings.value.googleSheetUrl) {
      setStatus('idle')
      return
    }

    if (!isOnline.value) {
      setStatus('offline')
      return
    }

    clearTimeout(debounceTimer)
    setStatus('syncing')

    debounceTimer = setTimeout(async () => {
      try {
        await googleSheetsService.syncTasks(settings.value.googleSheetUrl, tasksList)
        setStatus('synced')
      } catch (err) {
        console.error('Task sync error:', err)
        setStatus('error', err.message || 'Gagal sinkronisasi ke Google Sheets')
      }
    }, 1500)
  }

  // Daftarkan listener perubahan task otomatis
  registerTaskChangeCallback(triggerTaskSync)

  /**
   * Log satu sesi pomodoro yang baru selesai
   */
  const syncSession = async (session) => {
    if (!settings.value.googleSheetUrl || !isOnline.value) return

    try {
      setStatus('syncing')
      await googleSheetsService.logSession(settings.value.googleSheetUrl, session)
      setStatus('synced')
    } catch (err) {
      console.error('Session sync error:', err)
      setStatus('error', 'Gagal mencatat sesi ke Google Sheets')
    }
  }

  /**
   * Sinkronisasi Manual (Full push data dari LocalStorage ke Sheets)
   */
  const manualSync = async () => {
    if (!settings.value.googleSheetUrl) {
      setStatus('error', 'URL Google Sheets belum diatur di Pengaturan')
      return false
    }

    if (!isOnline.value) {
      setStatus('offline')
      return false
    }

    setStatus('syncing')
    try {
      const currentTasks = storage.getTasks()
      await googleSheetsService.syncTasks(settings.value.googleSheetUrl, currentTasks)
      setStatus('synced')
      return true
    } catch (err) {
      setStatus('error', err.message || 'Gagal sinkronisasi')
      return false
    }
  }

  const testConnection = async (url) => {
    return await googleSheetsService.testConnection(url)
  }

  return {
    syncStatus,
    lastSyncTime,
    errorMessage,
    isOnline,
    triggerTaskSync,
    syncSession,
    manualSync,
    testConnection
  }
}
