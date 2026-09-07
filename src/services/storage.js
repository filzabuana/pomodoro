/**
 * LocalStorage Service
 * Mengelola persistensi data to-do, sesi pomodoro, dan pengaturan aplikasi.
 */

const STORAGE_KEYS = {
  TASKS: 'pomosheets_tasks_v1',
  SESSIONS: 'pomosheets_sessions_v1',
  SETTINGS: 'pomosheets_settings_v1',
  ACTIVE_TASK_ID: 'pomosheets_active_task_id',
  SYNC_QUEUE: 'pomosheets_sync_queue'
};

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoro: false,
  soundEnabled: true,
  notificationsEnabled: false,
  googleSheetUrl: '',
  theme: 'dark' // 'dark' | 'light'
};

export const storage = {
  getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [
        {
          id: 'task_demo_1',
          title: 'Mulai sesi fokus pertama hari ini 🎯',
          completed: false,
          completedPomodoros: 0,
          estimatedPomodoros: 2,
          createdAt: new Date().toISOString()
        }
      ];
    } catch (e) {
      console.error('Failed to read tasks from localStorage', e);
      return [];
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  },

  getSessions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read sessions from localStorage', e);
      return [];
    }
  },

  saveSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions to localStorage', e);
    }
  },

  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.error('Failed to read settings from localStorage', e);
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  getActiveTaskId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID) || null;
  },

  setActiveTaskId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  },

  getSyncQueue() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveSyncQueue(queue) {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.error('Failed to save sync queue', e);
    }
  },

  exportAllData() {
    return {
      tasks: this.getTasks(),
      sessions: this.getSessions(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  },

  importAllData(payload) {
    if (payload.tasks) this.saveTasks(payload.tasks);
    if (payload.sessions) this.saveSessions(payload.sessions);
    if (payload.settings) this.saveSettings(payload.settings);
  }
};
