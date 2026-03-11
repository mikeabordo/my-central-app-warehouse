<template>
  <div class="modal fade" id="edit-warehouse">
    <div class="modal-dialog modal-dialog-centered custom-modal-two">
      <div class="modal-content">
        <div class="page-wrapper-new p-0">
          <div class="content">
            <div class="modal-header border-0 custom-modal-header justify-content-between">
              <div class="page-title ">
                <h4>Edit Warehouse</h4>
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
              <form @submit.prevent="updateWarehouse">
                <div class="mb-3">
                  <label class="form-label">Warehouse Code</label>
                  <input type="text" class="form-control bg-light" v-model="formData.whcode" disabled />
                </div>
                <div class="mb-3">
                  <label class="form-label">Branch Name</label>
                  <input type="text" class="form-control" v-model="formData.branchstorename" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Branch Address</label>
                  <input type="text" class="form-control" v-model="formData.branchaddress" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Branch Contact</label>
                  <input type="text" class="form-control" v-model="formData.branchcontact" />
                </div>
                <div class="modal-footer-btn">
                  <button
                    type="button"
                    class="btn btn-cancel me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-submit" data-bs-dismiss="modal">Save Changes</button>
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
  name: "EditWarehouse",
  props: {
    warehouse: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        whcode: '',
        branchstorename: '',
        branchaddress: '',
        branchcontact: '',
        id: null
      }
    };
  },
  watch: {
    warehouse: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...newVal };
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateWarehouse() {
      this.$emit('update', this.formData);
    }
  }
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
