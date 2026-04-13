<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Pending Transfer</h4>
            <h6>Manage Pending Transfer</h6>
          </div>
          <div class="page-btn">
            <router-link to="/stock-transfer/add-new-transfer" class="btn btn-added btn-gradient warm">
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Transfer
            </router-link>
          </div>
        </div>
        <!-- End Page Header -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table :headers="headers" :items="items" :loading="loading"
                  searchPlaceholder="Search items...">
                  <!-- Status Badge -->
                  <template #item-status="item">
                    <span class="badge badge-warning-light">
                      {{ item.status }}
                    </span>
                  </template>

                  <!-- Actions -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="`/stock-transfer/view/${item.stfNo}`"
                        class="btn btn-sm btn-icon-only btn-outline-secondary" title="View">
                        <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
                      <button type="button" class="btn btn-sm btn-icon-only btn-outline-info" title="Print"
                        data-bs-toggle="modal" data-bs-target="#print-item" @click="printItem(item)">
                        <vue-feather type="printer" size="14"></vue-feather>
                      </button>
                      <router-link v-if="item.isOwner" :to="`/stock-transfer/edit/${item.stfNo}`"
                        class="btn btn-sm btn-icon-only btn-outline-success" title="Edit">
                        <vue-feather type="edit" size="14"></vue-feather>
                      </router-link>
                      <button v-if="item.isOwner" type="button" class="btn btn-sm btn-icon-only btn-outline-danger"
                        title="Cancel" data-bs-toggle="modal" data-bs-target="#cancel-transfer"
                        @click="cancelItem(item)">
                        <vue-feather type="x-circle" size="14"></vue-feather>
                      </button>
                    </div>
                  </template>
                </dynamic-data-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>



  <cancel-modal modal-id="cancel-transfer" title="Cancel Transfer"
    :message="`Are you sure you want to cancel this transfer?`"
    :details="selectedItem ? `Reference: ${selectedItem.stfNo || ''}` : ''" :item="selectedItem"
    confirm-label="Yes, cancel" cancel-label="No" @confirm="handleCancelConfirm" />


  <!-- Print Transfer Modal -->
  <print-modal modal-id="print-item" :item="selectedItem" title="Stock Transfer Slip" :fields="printFields" />
</template>

<script>

import CancelModal from "@/components/action-modal/cancel-modal.vue";
import PrintModal from "@/components/action-modal/print-modal.vue";
import api from "@/services/api";

export default {
  name: "PendingTransfer",
  components: {
    CancelModal,
    PrintModal,

  },
  data() {
    return {
      items: [],
      selectedItem: null,
      loading: false,

      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Reference No", value: "stfNo", sortable: true },
        { text: "Location", value: "toBranch", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      printFields: [
        { label: "Reference No", key: "stfNo" },
        { label: "Location", key: "toBranch" },
        { label: "Remarks", key: "remarks" },
        { label: "Status", key: "status", uppercase: true },
        { label: "Requested By", key: "fullName" },
      ],
    };
  },
  created() {
    this.fetchTransfers();
  },
  methods: {
    async fetchTransfers() {
      this.loading = true;
      try {
        const responseData = await api.get("/warehouse/stf/list");
        const allTransfers = Array.isArray(responseData.data) ? responseData.data
          : Array.isArray(responseData) ? responseData : [];
        this.items = allTransfers.filter(
          t => t.status && t.status.toLowerCase() === 'pending'
        );
        console.log("Pending transfers fetched:", this.items);
      } catch (error) {
        console.error("Failed to fetch pending transfers:", error);
      } finally {
        this.loading = false;
      }
    },
    printItem(item) {
      this.selectedItem = { ...item };
    },
    cancelItem(item) {
      this.selectedItem = { ...item };
    },
    async handleCancelConfirm(item) {
      try {
        await api.post("/warehouse/stf/cancel", { stfNo: item.stfNo });
        this.successModalVisible = true;
      } catch (error) {
        console.error("Failed to cancel transfer:", error);
      }
    },

  },
};
</script>

<style scoped>
/* .badge-pending {
  background: rgba(255, 159, 67, 0.1);
  color: #FF9F43;
  border: 1px solid rgba(255, 159, 67, 0.2);
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}
*/
/* .badge-warning:hover {
  background: rgba(255, 159, 67, 0.15);
  transform: translateY(-1px);
} */

.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 10px;
}

.badge-warning-light {
  background-color: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}
</style>
