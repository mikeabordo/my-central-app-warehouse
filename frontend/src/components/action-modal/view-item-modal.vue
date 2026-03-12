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
              <div class="item-details">
                <div
                  v-for="field in fields"
                  :key="field.key"
                  class="mb-3"
                >
                  <label class="form-label">{{ field.label }}</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="item[field.key]"
                    disabled
                  />
                </div>
                <div class="modal-footer-btn">
                  <button
                    type="button"
                    class="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
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
  name: "ViewItemModal",
  props: {
    /**
     * The Bootstrap modal ID (without the #).
     * Must match the data-bs-target used in the trigger button.
     * Example: "view-item"
     */
    modalId: {
      type: String,
      required: true,
    },
    /**
     * The heading displayed inside the modal header.
     * Example: "View Item"
     */
    title: {
      type: String,
      default: "View Details",
    },
    /**
     * The data object whose keys are read by the fields array.
     * Example: { sku: "ITM-001", product: "Laptop Pro X" }
     */
    item: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Array of field definitions to render.
     * Each entry: { label: String, key: String }
     * Example: [{ label: "SKU", key: "sku" }, { label: "Product", key: "product" }]
     */
    fields: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.form-control {
  border-width: 1px;
  border-color: gray;
}
</style>
