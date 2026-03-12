<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Warehouse List</h4>
            <h6>Manage your Warehouses</h6>
          </div>
          <div class="page-btn">
            <button
              type="button"
              class="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-warehouse"
            >
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Warehouse
            </button>
          </div>
        </div>

        <!-- Warehouse List Table -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table
                  :headers="headers"
                  :items="warehouses"
                  searchPlaceholder="Search warehouses..."
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

                  <template #item-actions="item">
                    <div class="actions">
                      <button
                        type="button"
                        class="btn btn-sm bg-success-dark me-1"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-warehouse"
                        @click="editWarehouse(item)"
                      >
                        <vue-feather type="edit" class="action-edit"></vue-feather>
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
  <add-new-warehouse
    modal-id="add-warehouse"
    title="Create Warehouse"
    submit-label="Submit"
    :fields="addWarehouseFields"
    @create="handleAddWarehouse"
  />
  <edit-warehouse
    modal-id="edit-warehouse"
    title="Edit Warehouse"
    :item="selectedWarehouse"
    :fields="editWarehouseFields"
    @update="handleUpdateWarehouse"
  />
</template>

<script>
import AddNewWarehouse from "@/components/modal/add-new-warehouse.vue";
import EditWarehouse from "@/components/action-modal/edit-warehouse.vue";
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import api from "@/services/api";

export default {
  name: "WarehouseList",
  components: {
    AddNewWarehouse,
    EditWarehouse,
    DynamicDataTable,
  },
  data() {
    return {
      addWarehouseFields: [
        { label: "Branch Name",    key: "branchstorename", placeholder: "Enter branch name" },
        { label: "Branch Address", key: "branchaddress",   placeholder: "Enter branch address" },
        { label: "Branch Contact", key: "branchcontact",   placeholder: "Enter branch contact" },
      ],
      editWarehouseFields: [
        { label: "Warehouse Code", key: "whcode",          disabled: true },
        { label: "Branch Name",    key: "branchstorename" },
        { label: "Branch Address", key: "branchaddress"   },
        { label: "Branch Contact", key: "branchcontact"   },
      ],
      headers: [
        { text: "ID", value: "id", sortable: true},
        { text: "Warehouse Code", value: "whcode", sortable: true },
        { text: "Branch Name", value: "branchstorename", sortable: true },
        { text: "Branch Address", value: "branchaddress", sortable: true },
        { text: "Branch Contact", value: "branchcontact", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      warehouses: [],
      selectedWarehouse: null,
    };
  },
  async created() {
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      try {
        const responseData = await api.get('/warehouse/warehouse/list');
        // Ensure we always assign an Array to this.warehouses to prevent rendering crashes
        let fetchedWarehouses = responseData.data || responseData || [];
        this.warehouses = Array.isArray(fetchedWarehouses) ? fetchedWarehouses : [];
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    },
    addWarehouse() {
      this.selectedWarehouse = null;
    },
    async handleAddWarehouse(newData) {
      try {
        // Post new data
        await api.post('/warehouse/warehouse', newData);
        
        // Refetch the entire list from the backend to ensure we have the new auto-generated ID 
        // and that it is fully in sync with the server database.
        await this.fetchWarehouses();
      } catch (error) {
        console.error("Failed to add warehouse:", error);
      }
    },
    editWarehouse(warehouse) {
      this.selectedWarehouse = { ...warehouse };
    },
    async handleUpdateWarehouse(updatedData) {
      try {
        // TODO: Update the endpoint URL and method as per your backend
        await api.put(`/warehouse/warehouse/${updatedData.id}`, updatedData);
        
        const index = this.warehouses.findIndex(w => w.id === updatedData.id);
        if (index !== -1) {
          this.warehouses.splice(index, 1, updatedData);
        }
      } catch (error) {
        console.error("Failed to update warehouse:", error);
      }
    }
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