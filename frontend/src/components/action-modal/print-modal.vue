<template>
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body print-section-content">
          <div v-if="item" class="transfer-slip">
            <div class="slip-header text-center mb-4">
              <img src="@/assets/img/logo/mycentralapp-logo-v3.webp" alt="Logo" class="print-logo mb-2">
              <h3>{{ title }}</h3>
              <p class="text-muted">{{ new Date().toLocaleString() }}</p>
            </div>
            
            <div class="slip-details">
              <div v-for="(field, index) in fields" :key="index" class="row mb-2">
                <div class="col-4 font-weight-bold">{{ field.label }}:</div>
                <div class="col-8" :class="{ 'text-uppercase': field.uppercase }">
                  {{ item[field.key] || '---' }}
                </div>
              </div>
            </div>

            <hr>
            
            <div class="signature-section mt-5 pt-4">
              <div class="row justify-content-between">
                <div class="col-5 border-top text-center pt-2">
                  Requested By
                </div>
                <div class="col-5 border-top text-center pt-2">
                  Approved By
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="handlePrint">
            <vue-feather type="printer" class="me-2 feather-16"></vue-feather>Print Slip
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PrintModal",
  props: {
    modalId: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      default: null,
    },
    title: {
      type: String,
      default: "Print Slip",
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handlePrint() {
      window.print();
    },
  },
};
</script>

<style scoped>
.print-logo {
  max-width: 150px;
}
.transfer-slip {
  padding: 20px;
  background: #fff;
}
.font-weight-bold {
  font-weight: 700;
}
.feather-16 {
  width: 16px;
  height: 16px;
}

</style>

<style>
/* Global Print Styles - applied when this component is present */
@media print {
  /* Hide all main layout elements that shouldn't be printed */
  .header, 
  .sidebar, 
  .page-header, 
  .page-btn, 
  .actions, 
  .datatable-search,
  .vue3-easy-data-table__footer,
  .layout-header,
  .layout-sidebar,
  .btn,
  .btn-close,
  .whirly-loader-wrapper {
    display: none !important;
  }

  /* Reset main containers for full width print */
  body, html, #app, .main-wrapper, .page-wrapper, .content, .card, .card-body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    box-shadow: none !important;
    overflow: visible !important;
    height: auto !important;
    width: 100% !important;
    position: static !important;
    display: block !important;
  }

  /* Modal-specific overrides for print */
  .modal {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    display: block !important;
    opacity: 1 !important;
    z-index: 9999 !important;
  }

  .modal-dialog {
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .modal-content {
    border: none !important;
    box-shadow: none !important;
    background: white !important;
  }

  .modal-header, .modal-footer, .btn-close {
    display: none !important;
  }

  /* Ensure the slip content is visible */
  .print-section-content {
    display: block !important;
    padding: 0 !important;
  }
  
  .transfer-slip {
    padding: 0 !important;
  }
}
</style>
