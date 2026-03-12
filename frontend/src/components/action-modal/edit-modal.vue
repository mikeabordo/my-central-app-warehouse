<template>
  <div class="modal fade" :id="modalId">
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
              <form @submit.prevent="handleSubmit">
                <div
                  v-for="field in fields"
                  :key="field.key"
                  class="mb-3"
                >
                  <label class="form-label">{{ field.label }}</label>
                  <input
                    :type="field.type || 'text'"
                    class="form-control"
                    :class="{ 'bg-light': field.disabled }"
                    v-model="formData[field.key]"
                    :disabled="field.disabled || false"
                    :placeholder="field.placeholder || ''"
                  />
                </div>
                <div class="modal-footer-btn">
                  <button
                    type="button"
                    class="btn btn-cancel me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-submit"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditModal",
  props: {
    /**
     * The Bootstrap modal ID (without the #).
     * Must match the data-bs-target on the trigger button.
     * Example: "edit-modal"
     */
    modalId: {
      type: String,
      required: true,
    },
    /**
     * The heading displayed in the modal header.
     * Example: "Edit Warehouse"
     */
    title: {
      type: String,
      default: "Edit",
    },
    /**
     * The data object to pre-populate the form.
     * Keys must match the `key` values in the fields array.
     */
    item: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Field definitions to render in the form.
     * Each entry: { label, key, type?, disabled?, placeholder? }
     * Example:
     *   { label: "Warehouse Code", key: "whcode", disabled: true }
     *   { label: "Branch Name",    key: "branchstorename" }
     */
    fields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update"],
  data() {
    return {
      formData: {},
    };
  },
  watch: {
    item: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("update", { ...this.formData });
    },
  },
};
</script>

<style scoped>
.form-control {
  border-width: 1px;
  border-color: gray;
}
.form-control:focus {
  border-width: 2px;
  border-color: #67748e;
}
</style>
