<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Warehouse Mapping</h4>
            </div>
          </div>
        </div>

        <!-- Warehouse Mapping Table -->
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="datatable table table-hover table-center mb-0">
                    <thead>
                      <tr>
                        <th>Warehouse Name</th>
                        <th>Warehouse Code</th>
                        <th>Warehouse Type</th>
                        <th>Status</th>
                        <th class="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="warehouse in warehouses" :key="warehouse.id">
                        <td>{{ warehouse.name }}</td>
                        <td>{{ warehouse.code }}</td>
                        <td>{{ warehouse.type }}</td>
                        <td>
                          <span :class="['badge', warehouse.status === 'Active' ? 'badge-success' : 'badge-danger']">
                            {{ warehouse.status }}
                          </span>
                        </td>
                        <td class="text-end">
                          <div class="actions">
                            <a class="btn btn-sm bg-success-light" href="javascript:void(0);">
                              <i class="fe fe-pencil"></i> Edit
                            </a>
                            <a class="btn btn-sm bg-danger-light" href="javascript:void(0);">
                              <i class="fe fe-trash"></i> Delete
                            </a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
  name: "WarehouseMapping",
  data() {
    return {
      warehouses: [
        {
          id: 1,
          name: "Main Warehouse",
          code: "WH-001",
          type: "Main",
          status: "Active"
        },
        {
          id: 2,
          name: "Secondary Warehouse",
          code: "WH-002",
          type: "Secondary",
          status: "Active"
        },
        {
          id: 3,
          name: "Damaged Warehouse",
          code: "WH-003",
          type: "Damaged",
          status: "Inactive"
        }
      ]
    };
  },
  mounted() {
    
  }
};
</script>