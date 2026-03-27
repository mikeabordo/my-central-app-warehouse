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
              <router-link to="/stock-transfer/add-new-transfer" class="btn btn-added">
                <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Transfer
              </router-link>
            </div>
        </div>
        <!-- End Page Header -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table
                  :headers="headers"
                  :items="items"
                  :loading="loading"
                  searchPlaceholder="Search items..."
                >
                  <!-- We can add specific scoped slots for items here if needed -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <button type="button" class="btn btn-sm btn-icon-only btn-outline-info" title="Print"
                        data-bs-toggle="modal" data-bs-target="#print-item" @click="printItem(item)">
                        <vue-feather type="printer" size="14"></vue-feather>
                      </button>
                      <button v-if="item.isOwner" type="button" class="btn btn-sm btn-icon-only btn-outline-success"
                        title="Edit" data-bs-toggle="modal" data-bs-target="#edit-transfer" @click="editItem(item)">
                        <vue-feather type="edit" size="14"></vue-feather>
                      </button>
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



  <cancel-modal
    modal-id="cancel-transfer"
    title="Cancel Transfer"
    :message="`Are you sure you want to cancel this transfer?`"
    :details="selectedItem ? `Reference: ${selectedItem.stfNo || ''}` : ''"
    :item="selectedItem"
    confirm-label="Yes, cancel"
    cancel-label="No"
    @confirm="handleCancelConfirm"
  />

  <!-- Edit Transfer Modal -->
  <edit-modal
    modal-id="edit-transfer"
    title="Edit Transfer"
    :item="selectedItem || {}"
    :fields="editTransferFields"
    @update="handleEditTransfer"
  />

  <!-- Print Transfer Modal -->
  <print-modal
    modal-id="print-item"
    :item="selectedItem"
    title="Stock Transfer Slip"
    :fields="printFields"
  />
</template>

<script>

import CancelModal from "@/components/action-modal/cancel-modal.vue";
import EditModal from "@/components/action-modal/edit-modal.vue";
import PrintModal from "@/components/action-modal/print-modal.vue";
import api from "@/services/api";

export default {
  name: "PendingTransfer",
  components: {
    CancelModal,
    EditModal,
    PrintModal,
  },
  data() {
    return {
      items: [],
      selectedItem: null,
      loading: false,
      editTransferFields: [
        {
          label: "Item",
          key: "item_id",
          type: "search",
          endpoint: "/items/search",
          labelKey: "name",
          valueKey: "id",
          placeholder: "Search item…",
          minChars: 1,
          debounce: 350,
          col: 12,
        },
        {
          label: "Reference No",
          key: "ref",
          type: "text",
          placeholder: "Enter reference number",
          col: 12,
        },
        {
          label: "From Location",
          key: "fromBranch",
          type: "select",
          placeholder: "Select from location",
          col: 6,
          options: [],
        },
        {
          label: "To Location",
          key: "toBranch",
          type: "select",
          placeholder: "Select to location",
          col: 6,
          options: [],
        },
        {
          label: "Remarks",
          key: "remarks",
          type: "text",
          placeholder: "Enter remarks",
          col: 12,
        },
      ],

      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Reference No", value: "stfNo", sortable: true },
        { text: "Location", value: "fromBranch", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "User", value: "fullName", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      printFields: [
        { label: "Reference No", key: "stfNo" },
        { label: "Location", key: "fromBranch" },
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
    editItem(item) {
      this.selectedItem = { ...item };
    },
    async handleEditTransfer(updatedData) {
      console.log("Edit Transfer Data:", updatedData);
      this.loading = true;
      try {
        await api.post("/warehouse/stf/update", updatedData);
        await this.fetchTransfers();
      } catch (error) {
        console.error("Failed to update transfer:", error);
      } finally {
        this.loading = false;
      }
    },
    cancelItem(item) {
      this.selectedItem = { ...item };
    },
    handleCancelConfirm(item) {
      console.log("Cancel confirmed for:", item);
    },

  },
};
</script>


