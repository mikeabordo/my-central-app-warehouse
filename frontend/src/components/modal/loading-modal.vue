<template>
  <transition name="loading-modal">
    <div v-if="visible" class="loading-modal-overlay">
      <transition name="loading-modal-content" appear>
        <div class="loading-modal-card" v-if="visible">
          <!-- Animated Loader -->
          <div class="loading-modal-icon-wrapper">
            <div class="loading-modal-icon-ring"></div>
            <div class="loading-modal-icon">
              <!-- Animated Spinner SVG -->
              <svg class="loading-spinner" viewBox="0 0 50 50">
                <circle
                  class="spinner-path"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke-width="4"
                />
              </svg>
            </div>
          </div>

          <!-- Text Content -->
          <h4 class="loading-modal-title">{{ title }}</h4>
          <p class="loading-modal-message">{{ message }}</p>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "LoadingModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Processing...",
    },
    message: {
      type: String,
      default: "Please wait while we process your request.",
    },
  },
};
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────── */
.loading-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* ── Card ─────────────────────────────────────────── */
.loading-modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(59, 130, 246, 0.08); /* Blue tint shadow */
  overflow: hidden;
}

/* Decorative top gradient bar (Blue Theme) */
.loading-modal-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb);
  background-size: 200% 100%;
  animation: shimmer-blue 2.5s ease-in-out infinite;
}

@keyframes shimmer-blue {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* ── Animated Icon ────────────────────────────────── */
.loading-modal-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

/* Pulse ring behind the icon */
.loading-modal-icon-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.08);
  animation: ring-pulse 2s ease-in-out infinite;
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.08);
    opacity: 0.6;
  }
}

/* The blue circle background */
.loading-modal-icon {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3),
    0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* ── SVG Spinner ──────────────────────────────────── */
.loading-spinner {
  width: 40px;
  height: 40px;
  animation: rotate 2s linear infinite;
}

.spinner-path {
  stroke: #ffffff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* ── Text ─────────────────────────────────────────── */
.loading-modal-title {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.loading-modal-message {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 8px; /* Slightly less margin bottom as there is no button below */
  line-height: 1.6;
  padding: 0 8px;
}

/* ── Transitions ──────────────────────────────────── */
.loading-modal-enter-active {
  transition: opacity 0.3s ease;
}

.loading-modal-leave-active {
  transition: opacity 0.25s ease;
}

.loading-modal-enter,
.loading-modal-leave-to {
  opacity: 0;
}

.loading-modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.loading-modal-content-leave-active {
  transition: all 0.2s ease-in;
}

.loading-modal-content-enter {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.loading-modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
