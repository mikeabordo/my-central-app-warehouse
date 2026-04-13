<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Completed Transfer</h4>
            <h6>Manage Completed Transfer</h6>
          </div>
          <div class="page-btn">
            <router-link to="/stock-transfer/add-new-transfer" class="btn btn-added btn-gradient warm">
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Transfer
            </router-link>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table :headers="headers" :items="items" :loading="loading"
                  searchPlaceholder="Search items...">
                  <!-- We can add specific scoped slots for items here if needed -->
                  <!-- Status Badge -->
                  <template #item-status="item">
                    <span class="badge badge-success-light">
                      {{ item.status }}
                    </span>
                  </template>
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
                        title="Cancel" data-bs-toggle="modal" data-bs-target="#cancel-item" @click="cancelItem(item)">
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
</template>

<script>
import api from '@/services/api';

export default {
  name: "CompletedTransfer",
  components: {
  },
  data() {
    return {
      items: [],
      selectedItem: null,
      loading: false,
      addTransferFields: [],
      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Reference No", value: "stfNo", sortable: true },
        { text: "Location", value: "fromBranch", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "User", value: "fullName", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
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
          t => t.status && t.status.toLowerCase() === 'completed'
        );
        console.log("Completed transfers fetched:", this.items);
      } catch (error) {
        console.error("Failed to fetch transfers:", error);
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
  },
};
</script>

<style scoped>
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 10px;
}

.badge-success-light {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
</style>
