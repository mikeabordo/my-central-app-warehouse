<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Cancelled Transfer</h4>
            <h6>Manage Cancelled Transfer</h6>
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
                  <template #item-actions="item">
                    <div class="actions">
                      <button type="button" class="btn btn-sm btn-info" data-bs-toggle="modal"
                        data-bs-target="#print-item" @click="printItem(item)">
                        Print
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
  name: "CancelledTransfer",
  components: {
  },
  data() {
    return {
      isOwner: true,
      items: [],
      selectedItem: null,
      loading: false,
      addTransferFields: [],
      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Reference", value: "stfNo", sortable: true },
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
          t => t.status && t.status.toLowerCase() === 'cancelled'
        );
        console.log("Cancelled transfers fetched:", this.items);
      } catch (error) {
        console.error("Failed to fetch cancelled transfers:", error);
      } finally {
        this.loading = false;
      }
    },
    printItem(item) {
      this.selectedItem = { ...item };
    },
    editItem(item) {
      this.selectedItem = { ...item };
    },
  },
};
</script>

<style scoped></style>
