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
                  searchPlaceholder="Search items..."
                >
                  <!-- We can add specific scoped slots for items here if needed -->
                  <template #item-actions="{ item }">
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
                        v-if="isOwner"
                        type="button"
                        class="btn btn-sm btn-warning ms-1"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-item"
                        @click="editItem(item)"
                      >
                        Edit
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
</template>

<script>
import AddModal from '@/components/modal/add-modal.vue';

export default {
  name: "CompletedTransfer",
  components: {
    AddModal
  },
  data() {
    return {
      isOwner: true,
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
          label: "Transfer Type",
          key: "transfer_type",
          type: "select",
          placeholder: "Select transfer type",
          col: 6,                           // grid: 2 dropdowns side-by-side
          options: [
            { value: "branch_to_branch",     label: "Branch to Branch" },
            { value: "warehouse_to_branch",  label: "Warehouse to Branch" },
            { value: "branch_to_warehouse",  label: "Branch to Warehouse" },
          ],
        },
        {
          label: "Status",
          key: "status",
          type: "select",
          placeholder: "Select status",
          col: 6,                           // grid: sits next to Transfer Type
          options: ["Pending", "In Transit", "Completed", "Cancelled"],
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
        { text: "#", value: "index", sortable: false },
        { text: "Ref", value: "ref", sortable: true },
        { text: "Location", value: "location", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "User", value: "user", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [
        {
          index: 1,
          ref: "ITM-001",
          location: "Laptop Pro X",
          remarks: "Electronics",
          status: "LOC-001",
          user: "John Doe",
        },
        {
          index: 2,
          ref: "ITM-002",
          location: "Wireless Mouse M3",
          remarks: "Accessories",
          status: "LOC-002",
          user: "Jane Doe",
        },
        {
          index: 3,
          ref: "ITM-003",
          location: "Desk Chair Ergonomic",
          remarks: "Furniture",
          status: "LOC-003",
          user: "John Doe",
        },
      ],
    };
  },
  methods: {
    printItem(item) {
      this.selectedItem = { ...item };
    },
    editItem(item) {
      this.selectedItem = { ...item };
    },
  },
};
</script>

<style scoped>

</style>
