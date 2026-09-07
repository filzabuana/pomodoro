<template>
  <div class="timer-card glass-card" :style="modeAccentStyle">
    <!-- Mode Switcher Pills -->
    <div class="mode-tabs">
      <button 
        @click="switchMode('focus')" 
        class="mode-tab" 
        :class="{ active: mode === 'focus' }"
      >
        🎯 Fokus
      </button>
      <button 
        @click="switchMode('shortBreak')" 
        class="mode-tab" 
        :class="{ active: mode === 'shortBreak' }"
      >
        ☕ Istirahat
      </button>
      <button 
        @click="switchMode('longBreak')" 
        class="mode-tab" 
        :class="{ active: mode === 'longBreak' }"
      >
        🌴 Santai
      </button>
    </div>

    <!-- Circular Progress Ring & Timer Display -->
    <div class="ring-container">
      <svg class="progress-ring" viewBox="0 0 320 320">
        <!-- Background Track -->
        <circle
          class="ring-track"
          cx="160"
          cy="160"
          r="135"
          fill="none"
          stroke-width="10"
        />
        <!-- Animated Progress Stroke -->
        <circle
          class="ring-stroke"
          cx="160"
          cy="160"
          r="135"
          fill="none"
          stroke-width="12"
          stroke-linecap="round"
          :style="strokeDashStyle"
        />
      </svg>

      <!-- Center Countdown Info -->
      <div class="timer-center-content">
        <span class="mode-badge">{{ modeLabel }}</span>
        <div class="countdown-display" :class="{ 'is-running': isRunning }">
          {{ formattedTime }}
        </div>
        
        <!-- Active Task Chip inside timer -->
        <div v-if="activeTask" class="active-task-chip" :title="activeTask.title">
          <span class="chip-dot"></span>
          <span class="chip-text">{{ activeTask.title }}</span>
          <span class="chip-pomo">🍅 {{ activeTask.completedPomodoros }}/{{ activeTask.estimatedPomodoros }}</span>
        </div>
        <div v-else class="no-task-hint">
          <span>Pilih tugas untuk fokus</span>
        </div>
      </div>
    </div>

    <!-- Timer Control Actions -->
    <div class="timer-controls">
      <!-- Reset Button -->
      <button 
        @click="resetTimer" 
        class="ctrl-btn secondary" 
        title="Reset Timer"
      >
        <RotateCcw class="ctrl-icon" />
      </button>

      <!-- Main Play / Pause Button -->
      <button 
        @click="toggleTimer" 
        class="ctrl-btn primary" 
        :class="{ running: isRunning }"
        :title="isRunning ? 'Jeda Timer' : 'Mulai Timer'"
      >
        <Pause v-if="isRunning" class="ctrl-icon main" />
        <Play v-else class="ctrl-icon main pl-1" />
      </button>

      <!-- Skip Button -->
      <button 
        @click="skipTimer" 
        class="ctrl-btn secondary" 
        title="Lewati ke Sesi Berikutnya"
      >
        <SkipForward class="ctrl-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-vue-next'
import { usePomodoro } from '../composables/usePomodoro'
import { useTodos } from '../composables/useTodos'

const {
  mode,
  isRunning,
  formattedTime,
  progressPercentage,
  startTimer,
  pauseTimer,
  resetTimer,
  switchMode,
  skipTimer
} = usePomodoro()

const { activeTask } = useTodos()

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const modeLabel = computed(() => {
  if (mode.value === 'focus') return 'SESI FOKUS'
  if (mode.value === 'shortBreak') return 'ISTIRAHAT PENDEK'
  return 'ISTIRAHAT PANJANG'
})

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

// Radius = 135 => Circumference = 2 * PI * 135 = 848.23
const circumference = 2 * Math.PI * 135

const strokeDashStyle = computed(() => {
  const percent = progressPercentage.value
  const offset = circumference - (percent / 100) * circumference
  return {
    strokeDasharray: `${circumference}`,
    strokeDashoffset: `${offset}`,
    stroke: 'var(--current-accent)'
  }
})
</script>

<style scoped>
.timer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.25rem 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 36px -8px var(--current-glow);
  transition: all 0.4s ease;
}

/* Mode Tabs */
.mode-tabs {
  display: flex;
  background: var(--bg-input);
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  gap: 0.25rem;
  margin-bottom: 1.75rem;
}

.mode-tab {
  padding: 0.5rem 1.15rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.25s ease;
}

.mode-tab:hover {
  color: var(--text-primary);
}

.mode-tab.active {
  background: var(--current-accent);
  color: #ffffff;
  box-shadow: 0 2px 14px var(--current-glow);
}

/* Circular Ring Area */
.ring-container {
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  stroke: var(--border-color);
}

.ring-stroke {
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease;
  filter: drop-shadow(0 0 10px var(--current-glow));
}

.timer-center-content {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  max-width: 250px;
}

.mode-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.countdown-display {
  font-family: var(--font-mono);
  font-size: 4.25rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  line-height: 1;
  user-select: none;
  transition: transform 0.2s ease;
}

.countdown-display.is-running {
  transform: scale(1.02);
}

.active-task-chip {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: var(--bg-input);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  font-size: 0.8rem;
  max-width: 210px;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--current-accent);
  flex-shrink: 0;
}

.chip-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-primary);
  font-weight: 500;
}

.chip-pomo {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
}

.no-task-hint {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Controls */
.timer-controls {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1.75rem;
}

.ctrl-btn {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctrl-btn.secondary {
  width: 50px;
  height: 50px;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.ctrl-btn.secondary:hover {
  color: var(--text-primary);
  border-color: var(--border-active);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.ctrl-btn.primary {
  width: 72px;
  height: 72px;
  background: var(--current-accent);
  color: #ffffff;
  box-shadow: 0 4px 24px var(--current-glow);
}

.ctrl-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 30px var(--current-glow);
}

.ctrl-btn.primary.running {
  background: var(--current-accent);
  animation: pulseGlow 2s infinite ease-in-out;
}

.ctrl-icon {
  width: 20px;
  height: 20px;
}

.ctrl-icon.main {
  width: 28px;
  height: 28px;
}

.pl-1 {
  margin-left: 2px;
}

@media (max-width: 480px) {
  .ring-container {
    width: 280px;
    height: 280px;
  }
  .countdown-display {
    font-size: 3.6rem;
  }
}
</style>
