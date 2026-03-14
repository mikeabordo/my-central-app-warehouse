<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">
            <h4>Stock Ledger</h4>
            <h6>View Movement of Stock</h6>
          </div>
        </div>

        <!-- Warehouse Mapping Table -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table
                  :headers="headers"
                  :items="warehouses"
                  searchPlaceholder="Search warehouse mapping..."
                >
                  <!-- Status column with badge -->
                  <template #item-status="{ status }">
                    <span
                      :class="[
                        'badge',
                        status === 'Active'
                          ? 'badge-success'
                          : 'badge-danger',
                      ]"
                    >
                      {{ status }}
                    </span>
                  </template>

                  <!-- Actions column -->
                  <template #item-actions="{ item }">
                    <div class="actions">
                      <button
                        type="button"
                        class="btn btn-sm bg-success-dark me-1"
                        @click="editWarehouse(item)"
                      >
                        <vue-feather type="edit" class="action-edit"></vue-feather>
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm bg-danger-light"
                        @click="deleteWarehouse(item.id)"
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
</template>

<script>
import DynamicDataTable from "@/components/DynamicDataTable.vue";

export default {
  name: "WarehouseMapping",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
      headers: [
        { text: "Date", value: "date", sortable: true},
        { text: "SKU", value: "sku", sortable: true },
        { text: "Reference", value: "ref", sortable: true },
        { text: "Location", value: "location", sortable: true },
        { text: "Type", value: "type", sortable: true },
        { text: "User", value: "user", sortable: true },
        { text: "Quantity", value: "quantity", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  mounted() {
    
  },
  methods: {
    editWarehouse(warehouse) {
      console.log("Editing warehouse mapping:", warehouse);
      // Logic for editing
    },
    deleteWarehouse(id) {
      if (confirm("Are you sure you want to delete this warehouse mapping?")) {
        this.warehouses = this.warehouses.filter((w) => w.id !== id);
      }
    },
  },
};
</script>

<style scoped>
.badge-success {
  background-color: #22cc62;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.badge-danger {
  background-color: #fc3d39;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

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

.bg-success-dark {
  background-color: rgba(34, 204, 98, 0.1);
  color: #22cc62;
}

.bg-danger-light {
  background-color: rgba(252, 61, 57, 0.1);
  color: #fc3d39;
}

:deep(.action-edit) {
  width: 16px;
  height: 14px;
}

:deep(.action-delete) {
  width: 16px;
  height: 14px;
}
</style>