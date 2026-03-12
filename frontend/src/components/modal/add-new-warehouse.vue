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
                    v-model="formData[field.key]"
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
                    {{ submitLabel }}
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
  name: "AddNewWarehouse",
  props: {
    /**
     * The Bootstrap modal ID (without the #).
     * Must match the data-bs-target on the trigger button.
     * Example: "add-warehouse"
     */
    modalId: {
      type: String,
      required: true,
    },
    /**
     * The heading displayed in the modal header.
     * Example: "Create Warehouse"
     */
    title: {
      type: String,
      default: "Add New",
    },
    /**
     * Label for the submit button.
     * Example: "Submit" or "Create"
     */
    submitLabel: {
      type: String,
      default: "Submit",
    },
    /**
     * Field definitions to render in the form.
     * Each entry: { label, key, type?, placeholder? }
     * Example:
     *   { label: "Branch Name",    key: "branchstorename" }
     *   { label: "Branch Address", key: "branchaddress" }
     */
    fields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["create"],
  data() {
    return {
      formData: {},
    };
  },
  watch: {
    fields: {
      handler(newFields) {
        // Re-initialise formData keys whenever fields change
        const fresh = {};
        newFields.forEach((f) => {
          fresh[f.key] = "";
        });
        this.formData = fresh;
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("create", { ...this.formData });
      // Reset form after submission
      const fresh = {};
      this.fields.forEach((f) => {
        fresh[f.key] = "";
      });
      this.formData = fresh;
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
