<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Pending Transfer</h4>
              <h6>Manage Pending Transfer</h6>
            </div>
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
</template>

<script>

export default {
  name: "PendingTransfer",
  components: {
 
  },
  data() {
    return {
      isOwner: true,
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
