<template>
    <transition name="confirm-modal">
      <div v-if="visible" class="confirm-modal-overlay" @click.self="cancel">
        <transition name="confirm-modal-content" appear>
          <div class="confirm-modal-card" v-if="visible">
            <!-- Close Button -->
            <button class="confirm-modal-close" @click="cancel" aria-label="Close">
              <vue-feather type="x" size="18"></vue-feather>
            </button>
  
            <!-- Warning Icon -->
            <div class="confirm-modal-icon-wrapper">
              <div class="confirm-modal-icon-ring"></div>
              <div class="confirm-modal-icon">
                <vue-feather type="alert-triangle" size="32" class="warning-icon"></vue-feather>
              </div>
            </div>
  
            <!-- Text Content -->
            <h4 class="confirm-modal-title">{{ title }}</h4>
            <p class="confirm-modal-message">{{ message }}</p>
  
            <!-- Action Buttons -->
            <div class="confirm-modal-actions">
              <button class="btn-cancel" @click="cancel">
                {{ cancelButtonText }}
              </button>
              <button class="btn-confirm" @click="confirm" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ confirmButtonText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: "ConfirmationModal",
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: "Are you sure?",
      },
      message: {
        type: String,
        default: "This action cannot be undone.",
      },
      confirmButtonText: {
        type: String,
        default: "Confirm",
      },
      cancelButtonText: {
        type: String,
        default: "Cancel",
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      confirm() {
        this.$emit("confirm");
      },
      cancel() {
        if (!this.loading) {
          this.$emit("update:visible", false);
          this.$emit("cancel");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* ── Overlay ──────────────────────────────────────── */
  .confirm-modal-overlay {
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
  .confirm-modal-card {
    position: relative;
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 36px 32px;
    width: 100%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    overflow: hidden;
  }
  
  /* Decorative top gradient bar */
  .confirm-modal-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b, #ef4444, #b91c1c);
    background-size: 200% 100%;
    animation: shimmer-red 2.5s ease-in-out infinite;
  }
  
  @keyframes shimmer-red {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  /* ── Close Button ─────────────────────────────────── */
  .confirm-modal-close {
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
  
  .confirm-modal-close:hover {
    background: #e2e8f0;
    color: #334155;
    transform: scale(1.05);
  }
  
  /* ── Animated Icon ────────────────────────────────── */
  .confirm-modal-icon-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
  }
  
  .confirm-modal-icon-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.08);
    animation: ring-pulse 2s ease-in-out infinite;
  }
  
  @keyframes ring-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: 0.6; }
  }
  
  .confirm-modal-icon {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  }
  
  .warning-icon {
    color: #ffffff;
  }
  
  /* ── Text ─────────────────────────────────────────── */
  .confirm-modal-title {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .confirm-modal-message {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 28px;
    line-height: 1.6;
  }
  
  /* ── Actions ──────────────────────────────────────── */
  .confirm-modal-actions {
    display: flex;
    gap: 12px;
  }
  
  .btn-cancel, .btn-confirm {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;
    border: none;
  }
  
  .btn-cancel {
    background: #f1f5f9;
    color: #64748b;
  }
  
  .btn-cancel:hover {
    background: #e2e8f0;
    color: #334155;
  }
  
  .btn-confirm {
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
  }
  
  .btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
  }
  
  .btn-confirm:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  /* ── Transitions ──────────────────────────────────── */
  .confirm-modal-enter-active, .confirm-modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .confirm-modal-enter, .confirm-modal-leave-to {
    opacity: 0;
  }
  
  .confirm-modal-content-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .confirm-modal-content-leave-active {
    transition: all 0.2s ease-in;
  }
  
  .confirm-modal-content-enter {
    opacity: 0;
    transform: scale(0.85) translateY(20px);
  }
  
  .confirm-modal-content-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  </style>