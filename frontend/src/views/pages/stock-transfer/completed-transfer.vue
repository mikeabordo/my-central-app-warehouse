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
                        class="btn btn-sm btn-info"
                        data-bs-toggle="modal"
                        data-bs-target="#print-item"
                        @click="printItem(item)"
                      >
                        Print
                      </button>
                      <button
                        v-if="item.isOwner"
                        type="button"
                        class="btn btn-sm btn-warning ms-1"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-transfer"
                        @click="editItem(item)"
                      >
                        Edit
                      </button>
                      <button
                        v-if="item.isOwner"
                        type="button"
                        class="btn btn-sm btn-danger ms-1"
                        data-bs-toggle="modal"
                        data-bs-target="#cancel-item"
                        @click="cancelItem(item)"
                      >
                        Cancel
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
  <!-- Edit Transfer Modal -->
  <edit-modal
    modal-id="edit-transfer"
    title="Edit Transfer"
    submit-label="Save Changes"
    size="lg"
    :fields="addTransferFields"
    :initial-data="selectedItem"
    @update="handleEditTransfer"
  />
</template>

<script>
import api from '@/services/api';
import AddModal from '@/components/modal/add-modal.vue';
import EditModal from '@/components/action-modal/edit-modal.vue';

export default {
  name: "CompletedTransfer",
  components: {
    AddModal,
    EditModal,
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
    editItem(item) {
      this.selectedItem = { ...item };
    },
    handleEditTransfer(updatedData) {
      this.selectedItem = { ...updatedData };
    },
    async handleAddTransfer(newData) {
      this.loading = true;
      try {
        await api.post("/warehouse/stf/add", newData);
        // TODO: refetch list from backend once the endpoint is ready
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

</style>
