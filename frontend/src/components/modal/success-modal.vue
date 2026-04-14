<template>
  <transition name="success-modal">
    <div v-if="visible" class="success-modal-overlay" @click.self="close">
      <transition name="success-modal-content" appear>
        <div class="success-modal-card" v-if="visible">
          <!-- Close Button -->
          <button class="success-modal-close" @click="close" aria-label="Close">
            <vue-feather type="x" size="18"></vue-feather>
          </button>

          <!-- Animated Checkmark Circle -->
          <div class="success-modal-icon-wrapper">
            <div class="success-modal-icon-ring"></div>
            <div class="success-modal-icon">
              <svg class="success-checkmark" viewBox="0 0 52 52">
                <circle
                  class="checkmark-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  class="checkmark-check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>
          </div>

          <!-- Text Content -->
          <h4 class="success-modal-title">{{ title }}</h4>
          <p class="success-modal-message">{{ message }}</p>

          <!-- Action Button -->
          <button class="success-modal-btn" @click="close">
            {{ buttonText }}
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: "SuccessModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Success!",
    },
    message: {
      type: String,
      default: "Your action was completed successfully.",
    },
    buttonText: {
      type: String,
      default: "Continue",
    },
    autoClose: {
      type: Number,
      default: 0, // 0 = no auto-close, otherwise ms
    },
  },
  watch: {
    visible(val) {
      if (val && this.autoClose > 0) {
        this._autoCloseTimer = setTimeout(() => {
          this.close();
        }, this.autoClose);
      }
      if (!val && this._autoCloseTimer) {
        clearTimeout(this._autoCloseTimer);
      }
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },
  },
  beforeUnmount() {
    if (this._autoCloseTimer) {
      clearTimeout(this._autoCloseTimer);
    }
  },
};
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────── */
.success-modal-overlay {
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
.success-modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 36px 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 159, 67, 0.08);
  overflow: hidden;
}

/* Decorative top gradient bar */
.success-modal-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #34d399, #10b981, #059669);
  background-size: 200% 100%;
  animation: shimmer-green 2.5s ease-in-out infinite;
}

@keyframes shimmer-green {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* ── Close Button ─────────────────────────────────── */
.success-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.success-modal-close:hover {
  background: #e2e8f0;
  color: #334155;
  transform: scale(1.05);
}

/* ── Animated Icon ────────────────────────────────── */
.success-modal-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
}

.success-modal-icon-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.08);
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

.success-modal-icon {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3),
    0 0 0 4px rgba(16, 185, 129, 0.1);
}

/* ── SVG Checkmark ────────────────────────────────── */
.success-checkmark {
  width: 40px;
  height: 40px;
}

.checkmark-circle {
  stroke: rgba(255, 255, 255, 0.25);
  stroke-width: 2;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke-draw 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
}

.checkmark-check {
  stroke: #ffffff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-draw 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes stroke-draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* ── Text ─────────────────────────────────────────── */
.success-modal-title {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.success-modal-message {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 28px;
  line-height: 1.6;
  padding: 0 8px;
}

/* ── Button ───────────────────────────────────────── */
.success-modal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 13px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14.5px;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.success-modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.success-modal-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

/* ── Transitions ──────────────────────────────────── */
.success-modal-enter-active {
  transition: opacity 0.3s ease;
}

.success-modal-leave-active {
  transition: opacity 0.25s ease;
}

.success-modal-enter,
.success-modal-leave-to {
  opacity: 0;
}

.success-modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-modal-content-leave-active {
  transition: all 0.2s ease-in;
}

.success-modal-content-enter {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.success-modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
