<template>
  <div class="app-wrapper" :style="modeAccentStyle">
    <!-- Ambient Background Glow -->
    <div class="ambient-glow"></div>

    <!-- Navigation Header -->
    <Navbar 
      @open-settings="showSettings = true" 
      @open-stats="showStats = true" 
    />

    <!-- Main Content Area -->
    <main class="main-container">
      <div class="content-grid">
        <!-- Left Column: Current Task Banner + Pomodoro Timer -->
        <section class="timer-section">
          <CurrentTaskBanner />
          <PomodoroTimer />
        </section>

        <!-- Right Column: To-Do List -->
        <section class="todo-section">
          <TodoList />
        </section>
      </div>
    </main>

    <!-- Modals -->
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
import Navbar from './components/Navbar.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import CurrentTaskBanner from './components/CurrentTaskBanner.vue'
import TodoList from './components/TodoList.vue'
import SettingsModal from './components/SettingsModal.vue'
import StatsModal from './components/StatsModal.vue'
import SetupGuideModal from './components/SetupGuideModal.vue'
import { usePomodoro } from './composables/usePomodoro'

const { mode } = usePomodoro()

const showSettings = ref(false)
const showStats = ref(false)
const showGuide = ref(false)

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

@media (max-width: 960px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
  .main-container {
    padding: 1.25rem 1rem 2.5rem;
  }
}
</style>
