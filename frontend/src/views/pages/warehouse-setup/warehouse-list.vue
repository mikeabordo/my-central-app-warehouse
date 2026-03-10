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
            <a
              href="javascript:void(0);"
              class="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-warehouse"
            >
              <vue-feather type="plus-circle" class="me-2"></vue-feather>Add New Warehouse
            </a>
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

                  <!-- Actions column -->
                  <template #item-actions>
                    <div class="actions">
                      <a
                        class="btn btn-sm bg-success-dark me-1"
                        href="javascript:void(0);"
                      >
                        <vue-feather type="edit" class="action-edit"></vue-feather>
                      </a>
                      <a
                        class="btn btn-sm bg-danger-light"
                        href="javascript:void(0);"
                      >
                        <vue-feather type="trash-2" class="action-delete"></vue-feather>
                      </a>
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
  <add-new-warehouse></add-new-warehouse>
</template>

<script>
import AddNewWarehouse from "@/components/modal/add-new-warehouse.vue";

export default {
  name: "WarehouseList",
  components: {
    AddNewWarehouse,
  },
  data() {
    return {
      headers: [
        { text: "Warehouse Name", value: "name", sortable: true },
        { text: "Location", value: "location", sortable: true },
        { text: "Contact", value: "contact", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      warehouses: [
        {
          id: 1,
          name: "Main Warehouse",
          location: "Phoenix Building, 927 Quezon Avenue, Quezon City, Metro Manila",
          contact: "8372-3550",
          status: "Active",
        },
        {
          id: 2,
          name: "Secondary Warehouse",
          location: "WH-002",
          contact: "Secondary",
          status: "Active",
        },
        {
          id: 3,
          name: "Damaged Warehouse",
          location: "WH-003",
          contact: "Damaged",
          status: "Inactive",
        },
      ],
    };
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
  
}
:deep(.action-edit) {
  width: 16px;
  height: 14px;
  color: #22cc62;
}
:deep(.action-delete) {
  width: 16px;
  height: 14px;
  color: #fc3d39;
}
</style>