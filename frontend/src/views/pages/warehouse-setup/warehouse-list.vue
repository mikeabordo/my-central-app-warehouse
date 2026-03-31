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
            <router-link to="/warehouse-setup/add-new-warehouse" class="btn btn-added btn-gradient warm">
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Warehouse
            </router-link>
          </div>
        </div>
        <!-- end page header -->

        <!-- Warehouse List Table -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table :headers="headers" :items="warehouses" :loading="loading"
                  searchPlaceholder="Search warehouses...">
                  <!-- Status column with badge -->
                  <template #item-status="{ status }">
                    <span :class="[
                      'badge',
                      status === 'Active'
                        ? 'badge-success'
                        : 'badge-danger',
                    ]">
                      {{ status }}
                    </span>
                  </template>

                  <template #item-actions="item">
                    <div class="actions">
                      <button type="button" class="btn btn-sm bg-success-dark me-1" data-bs-toggle="modal"
                        data-bs-target="#edit-modal" @click="editWarehouse(item)">
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

  <edit-modal modal-id="edit-modal" title="Edit Warehouse" :item="selectedWarehouse" :fields="editWarehouseFields"
    @update="handleUpdateWarehouse" />
</template>

<script>

import EditModal from "@/components/action-modal/edit-modal.vue";
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import api from "@/services/api";

export default {
  name: "WarehouseList",
  components: {
    EditModal,
    DynamicDataTable,
  },
  data() {
    return {

      editWarehouseFields: [
        { label: "Warehouse Code", key: "whcode", disabled: true },
        { label: "Branch Name", key: "branchstorename" },
        { label: "Branch Address", key: "branchaddress" },
        { label: "Branch Contact", key: "branchcontact" },
      ],
      headers: [
        { text: "ID", value: "id", sortable: true },
        { text: "Warehouse Code", value: "whcode", sortable: true },
        { text: "Branch Name", value: "branchstorename", sortable: true },
        { text: "Branch Address", value: "branchaddress", sortable: true },
        { text: "Branch Contact", value: "branchcontact", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      warehouses: [],
      selectedWarehouse: null,
      loading: false,
    };
  },
  async created() {
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      this.loading = true;
      try {
        const responseData = await api.get('/warehouse/warehouse/list');
        // Ensure we always assign an Array to this.warehouses to prevent rendering crashes
        let fetchedWarehouses = responseData.data || responseData || [];
        this.warehouses = Array.isArray(fetchedWarehouses) ? fetchedWarehouses : [];
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      } finally {
        this.loading = false;
      }
    },

    editWarehouse(warehouse) {
      this.selectedWarehouse = { ...warehouse };
    },
    async handleUpdateWarehouse(updatedData) {
      this.loading = true;
      try {
        // TODO: Update the endpoint URL and method as per your backend
        await api.put(`/warehouse/warehouse/${updatedData.id}`, updatedData);

        const index = this.warehouses.findIndex(w => w.id === updatedData.id);
        if (index !== -1) {
          this.warehouses.splice(index, 1, updatedData);
        }
      } catch (error) {
        console.error("Failed to update warehouse:", error);
      } finally {
        this.loading = false;
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
</style>