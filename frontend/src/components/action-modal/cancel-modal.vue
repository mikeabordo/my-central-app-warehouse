<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered custom-modal-two">
      <div class="modal-content">
        <div class="page-wrapper-new p-0">
          <div class="content">
            <div class="modal-header border-0 custom-modal-header justify-content-between">
              <div class="page-title">
                <h4>{{ title }}</h4>
              </div>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="modal-body custom-modal-body">
              <p class="mb-2">{{ message }}</p>

              <div v-if="details" class="text-muted small mb-3">
                {{ details }}
              </div>

              <div class="modal-footer-btn">
                <button
                  type="button"
                  class="btn btn-cancel me-2"
                  data-bs-dismiss="modal"
                >
                  {{ cancelLabel }}
                </button>
                <button
                  type="button"
                  class="btn btn-submit"
                  data-bs-dismiss="modal"
                  :disabled="disabled"
                  @click="confirm"
                >
                  {{ confirmLabel }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CancelModal",
  props: {
    modalId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Cancel",
    },
    message: {
      type: String,
      default: "Are you sure you want to cancel?",
    },
    details: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: null,
    },
    confirmLabel: {
      type: String,
      default: "Yes, cancel",
    },
    cancelLabel: {
      type: String,
      default: "No",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["confirm"],
  methods: {
    confirm() {
      this.$emit("confirm", this.item);
    },
  },
};
</script>

<style scoped>
.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
