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
            <button
              type="button"
              class="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-transfer"
            >
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Transfer
            </button>
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
                  <template #item-actions=" item ">
                    <div class="actions">
                      <button
                        type="button"
                        class="btn btn-sm bg-info-light me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#print-item"
                        @click="printItem(item)"
                      >
                        <vue-feather type="printer" class="action-print"></vue-feather>
                      </button>
                      <button
                        v-if="item.isOwner"
                        type="button"
                        class="btn btn-sm bg-success-dark me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-transfer"
                        @click="editItem(item)"
                      >
                        <vue-feather type="edit" class="action-edit"></vue-feather>
                      </button>
                      <button
                        v-if="item.isOwner"
                        type="button"
                        class="btn btn-sm bg-danger-light me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#cancel-transfer"
                        @click="cancelItem(item)"
                      >
                        <vue-feather type="trash-2" class="action-delete"></vue-feather>
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

  <!-- Add New Transfer Modal -->
  <add-modal
    modal-id="add-transfer"
    title="Add New Transfer"
    submit-label="Submit"
    size="lg"
    :fields="addTransferFields"
    @create="handleAddTransfer"
  />

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
    :fields="addTransferFields"
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
import AddModal from "@/components/modal/add-modal.vue";
import CancelModal from "@/components/action-modal/cancel-modal.vue";
import EditModal from "@/components/action-modal/edit-modal.vue";
import PrintModal from "@/components/action-modal/print-modal.vue";
import api from "@/services/api";

export default {
  name: "PendingTransfer",
  components: {
    AddModal,
    CancelModal,
    EditModal,
    PrintModal,
  },
  data() {
    return {
      items: [],
      selectedItem: null,
      loading: false,
      addTransferFields: [
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
          col: 12,                          // column: full-width, prominent
        },
        {
          label: "Reference No",
          key: "ref",
          type: "text",
          placeholder: "Enter reference number",
          col: 12,                          // column: full-width row
        },
        {
          label: "From Location",
          key: "fromBranch",
          type: "select",
          placeholder: "Select from location",
          col: 6,                           // grid: 2 dropdowns side-by-side
          options: [],
        },
        {
          label: "To Location",
          key: "toBranch",
          type: "select",
          placeholder: "Select to location",
          col: 6,                           // grid: sits next to Transfer Type
          options: [],
        },
        {
          label: "Remarks",
          key: "remarks",
          type: "text",
          placeholder: "Enter remarks",
          col: 12,                          // column: full-width row
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
      // Hook your cancel API call here (the modal passes back the selected item).
      // Example:
      // await api.post("/warehouse/stf/cancel", { id: item.id });
      console.log("Cancel confirmed for:", item);
    },
    async handleAddTransfer(newData) {
      console.log("Add Transfer Data:", newData);
      this.loading = true;
      try {
        await api.post("/warehouse/stf/add", newData);
        await this.fetchTransfers();
      } catch (error) {
        console.error("Failed to create transfer:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>

.actions .btn {
  font-size: 13px;
  padding: 3px 6px;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.actions .btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

</style>

