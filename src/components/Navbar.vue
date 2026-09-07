<template>
  <header class="navbar-container">
    <div class="navbar-content">
      <!-- Logo & Branding -->
      <div class="logo-area">
        <div class="logo-icon">🍅</div>
        <div class="logo-text">
          <span class="brand-name">PomoSheets</span>
          <span class="brand-tag">Focus & Sync</span>
        </div>
      </div>

      <!-- Right Actions: Sync Pill, Stats, Settings, Theme -->
      <div class="navbar-actions">
        <!-- Sync Status Button (Cloud / Google Sheets) -->
        <button 
          @click="$emit('open-settings')" 
          class="sync-pill"
          :class="syncPillClass"
          :title="syncTitle"
        >
          <span class="sync-icon-wrapper">
            <RefreshCw v-if="syncStatus === 'syncing'" class="sync-icon icon-spin" />
            <CloudOff v-else-if="!isOnline" class="sync-icon" />
            <Cloud v-else class="sync-icon" />
            <span class="sync-dot-badge"></span>
          </span>
          <span class="sync-text">{{ syncLabel }}</span>
        </button>

        <!-- About Pomodoro Button -->
        <button @click="$emit('open-about')" class="nav-icon-btn" title="Tentang Teknik Pomodoro">
          <BookOpen class="icon" />
        </button>

        <!-- Stats Button -->
        <button @click="$emit('open-stats')" class="nav-icon-btn" title="Statistik & Riwayat">
          <BarChart2 class="icon" />
        </button>

        <!-- Theme Toggle -->
        <button @click="toggleTheme" class="nav-icon-btn" title="Ubah Tema">
          <Sun v-if="settings.theme === 'dark'" class="icon" />
          <Moon v-else class="icon" />
        </button>

        <!-- Settings Button -->
        <button @click="$emit('open-settings')" class="nav-icon-btn" title="Pengaturan & Google Sheets">
          <Settings class="icon" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Settings, BarChart2, Sun, Moon, BookOpen, Cloud, CloudOff, RefreshCw } from 'lucide-vue-next'
import { useSettings } from '../composables/useSettings'
import { useSync } from '../composables/useSync'

defineEmits(['open-settings', 'open-stats', 'open-about'])

const { settings, toggleTheme } = useSettings()
const { syncStatus, lastSyncTime, isOnline } = useSync()

const syncLabel = computed(() => {
  if (!isOnline.value) return 'Offline'
  if (!settings.value.googleSheetUrl) return 'Lokal'
  if (syncStatus.value === 'syncing') return 'Menyinkronkan...'
  if (syncStatus.value === 'synced') return lastSyncTime.value ? `Tersinkron ${lastSyncTime.value}` : 'Tersinkron'
  if (syncStatus.value === 'error') return 'Sync Error'
  return 'Google Sheets'
})

const syncPillClass = computed(() => {
  if (!isOnline.value) return 'status-offline'
  if (!settings.value.googleSheetUrl) return 'status-local'
  if (syncStatus.value === 'syncing') return 'status-syncing'
  if (syncStatus.value === 'synced') return 'status-synced'
  if (syncStatus.value === 'error') return 'status-error'
  return 'status-connected'
})

const syncTitle = computed(() => {
  if (!settings.value.googleSheetUrl) return 'Klik untuk menghubungkan ke Google Sheets'
  return 'Status koneksi Google Sheets. Klik untuk pengaturan.'
})
</script>

<style scoped>
.navbar-container {
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0.75rem 1.5rem;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  user-select: none;
}

.logo-icon {
  font-size: 1.75rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(244, 63, 94, 0.4));
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent-focus) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-tag {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Sync Button (Pill on desktop, Icon on mobile) */
.sync-pill {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.sync-pill:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}

.sync-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sync-icon {
  width: 15px;
  height: 15px;
}

.sync-icon.icon-spin {
  animation: spin 1s linear infinite;
  color: var(--accent-amber);
}

.sync-dot-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid var(--bg-input);
}

.status-synced .sync-dot-badge {
  background: var(--accent-emerald);
  box-shadow: 0 0 6px var(--accent-emerald);
}

.status-syncing .sync-dot-badge {
  background: var(--accent-amber);
}

.status-offline .sync-dot-badge {
  background: var(--accent-amber);
}

.status-error .sync-dot-badge {
  background: var(--accent-focus);
  box-shadow: 0 0 6px var(--accent-focus);
}

.status-local .sync-dot-badge {
  background: var(--text-muted);
}

.nav-icon-btn {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-icon-btn:hover {
  color: var(--text-primary);
  border-color: var(--border-active);
  background: var(--bg-card-hover);
}

.nav-icon-btn .icon {
  width: 18px;
  height: 18px;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .navbar-container {
    padding: 0.5rem 0.75rem;
  }

  .logo-area {
    gap: 0.4rem;
  }

  .logo-icon {
    font-size: 1.4rem;
  }

  .brand-name {
    font-size: 1rem;
  }

  .brand-tag {
    display: none;
  }

  .navbar-actions {
    gap: 0.35rem;
  }

  .sync-pill {
    width: 32px;
    height: 32px;
    padding: 0;
    justify-content: center;
    border-radius: 9px;
  }

  .sync-text {
    display: none;
  }

  .sync-icon {
    width: 16px;
    height: 16px;
  }

  .nav-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 9px;
  }

  .nav-icon-btn .icon {
    width: 15px;
    height: 15px;
  }
}
</style>
