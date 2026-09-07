<template>
  <div class="app-wrapper" :style="modeAccentStyle">
    <!-- Ambient Background Glow -->
    <div class="ambient-glow"></div>

    <!-- Navigation Header -->
    <Navbar 
      @open-settings="showSettings = true" 
      @open-stats="showStats = true" 
      @open-about="showAbout = true"
    />

    <!-- Main Content Area -->
    <main class="main-container">
      <!-- Mobile Segmented View Switcher (Hanya aktif di mobile < 768px) -->
      <div class="mobile-view-tabs">
        <button 
          @click="mobileTab = 'timer'" 
          class="view-tab-btn" 
          :class="{ active: mobileTab === 'timer' }"
        >
          <Clock class="tab-btn-icon" />
          <span>Timer</span>
        </button>
        <button 
          @click="mobileTab = 'todos'" 
          class="view-tab-btn" 
          :class="{ active: mobileTab === 'todos' }"
        >
          <ListTodo class="tab-btn-icon" />
          <span>Tugas</span>
          <span v-if="stats.remaining > 0" class="tab-badge">{{ stats.remaining }}</span>
        </button>
      </div>

      <div class="content-grid">
        <!-- Left Column: Current Task Banner + Pomodoro Timer -->
        <section class="timer-section" :class="{ 'mobile-hidden': mobileTab !== 'timer' }">
          <CurrentTaskBanner />
          <PomodoroTimer />
          
          <!-- Tombol pintasan di layar HP untuk langsung buka daftar tugas -->
          <button @click="mobileTab = 'todos'" class="mobile-switch-btn">
            <ListTodo class="shortcut-icon" />
            <span>Buka Daftar Tugas ({{ stats.remaining }} aktif)</span>
          </button>
        </section>

        <!-- Right Column: To-Do List -->
        <section class="todo-section" :class="{ 'mobile-hidden': mobileTab !== 'todos' }">
          <TodoList />
        </section>
      </div>
    </main>

    <!-- App Footer -->
    <footer class="app-footer">
      <div class="footer-content">
        <button @click="showAbout = true" class="footer-about-link">
          <span class="footer-tomato">🍅</span>
          <span>Pelajari Teknik Pomodoro</span>
        </button>
        <div class="footer-author">
          <span class="credit-text">by <strong class="author-name">Filza Buana Putra</strong></span>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <AboutPomodoroModal
      v-if="showAbout"
      @close="showAbout = false"
    />

    <SettingsModal 
      v-if="showSettings" 
      @close="showSettings = false" 
      @open-guide="openGuideFromSettings"
    />

    <StatsModal 
      v-if="showStats" 
      @close="showStats = false" 
    />

    <SetupGuideModal 
      v-if="showGuide" 
      @close="showGuide = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Clock, ListTodo } from 'lucide-vue-next'
import Navbar from './components/Navbar.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import CurrentTaskBanner from './components/CurrentTaskBanner.vue'
import TodoList from './components/TodoList.vue'
import SettingsModal from './components/SettingsModal.vue'
import StatsModal from './components/StatsModal.vue'
import SetupGuideModal from './components/SetupGuideModal.vue'
import AboutPomodoroModal from './components/AboutPomodoroModal.vue'
import { usePomodoro } from './composables/usePomodoro'
import { useTodos } from './composables/useTodos'

const { mode } = usePomodoro()
const { stats } = useTodos()

const mobileTab = ref('timer') // 'timer' | 'todos'
const showSettings = ref(false)
const showStats = ref(false)
const showGuide = ref(false)
const showAbout = ref(false)

const openGuideFromSettings = () => {
  showSettings.value = false
  showGuide.value = true
}

const modeAccentStyle = computed(() => {
  if (mode.value === 'shortBreak') {
    return {
      '--current-accent': 'var(--accent-short-break)',
      '--current-glow': 'var(--accent-short-glow)'
    }
  }
  if (mode.value === 'longBreak') {
    return {
      '--current-accent': 'var(--accent-long-break)',
      '--current-glow': 'var(--accent-long-glow)'
    }
  }
  return {
    '--current-accent': 'var(--accent-focus)',
    '--current-glow': 'var(--accent-focus-glow)'
  }
})
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-container {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  z-index: 1;
}

/* Mobile View Tabs - hidden by default on desktop */
.mobile-view-tabs {
  display: none;
}

.mobile-switch-btn {
  display: none;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 2rem;
  align-items: start;
}

.timer-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.todo-section {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.25rem 1rem 2rem;
    min-height: calc(100vh - 120px);
  }

  .mobile-view-tabs {
    display: flex;
    background: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 999px;
    padding: 0.35rem;
    gap: 0.35rem;
    margin-bottom: 1.5rem;
    width: 100%;
    max-width: 380px;
  }

  .view-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.55rem 0.85rem;
    border-radius: 999px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .view-tab-btn.active {
    background: var(--accent-primary);
    color: #ffffff;
    box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
  }

  .tab-btn-icon {
    width: 16px;
    height: 16px;
  }

  .tab-badge {
    background: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    font-size: 0.72rem;
    font-family: var(--font-mono);
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    line-height: 1;
  }

  .content-grid {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .timer-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .todo-section {
    width: 100%;
  }

  .mobile-hidden {
    display: none !important;
  }

  .mobile-switch-btn {
    width: 100%;
    max-width: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--bg-card);
    border: 1px dashed var(--border-color);
    border-radius: 16px;
    padding: 0.85rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
    font-weight: 600;
    margin-top: 0.75rem;
    transition: all 0.2s ease;
  }

  .mobile-switch-btn:hover {
    color: var(--text-primary);
    border-color: var(--border-active);
  }

  .shortcut-icon {
    width: 16px;
    height: 16px;
    color: var(--accent-primary);
  }
}

/* App Footer */
.app-footer {
  width: 100%;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  padding: 1.25rem 1.5rem;
  z-index: 10;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-about-link {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.4rem 0.85rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  transition: all 0.2s ease;
}

.footer-about-link:hover {
  color: var(--text-primary);
  border-color: var(--border-active);
  background: var(--bg-card-hover);
  transform: translateY(-1px);
}

.footer-tomato {
  font-size: 0.95rem;
}

.footer-author {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.credit-text {
  font-weight: 500;
}

.author-name {
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--text-primary) 20%, var(--accent-focus) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
