<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Item List</h4>
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
                  <template #item-status="{ status }">
                    <span
                      :class="[
                        'badge',
                        status === 'In Stock' ? 'badge-success' : 'badge-danger',
                      ]"
                    >
                      {{ status }}
                    </span>
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
  name: "ItemList",
  data() {
    return {
      headers: [
        { text: "Item Code", value: "code", sortable: true },
        { text: "Item Name", value: "name", sortable: true },
        { text: "Category", value: "category", sortable: true },
        { text: "Quantity", value: "quantity", sortable: true },
        { text: "Status", value: "status", sortable: true },
      ],
      items: [
        {
          code: "ITM-001",
          name: "Laptop Pro X",
          category: "Electronics",
          quantity: 45,
          status: "In Stock",
        },
        {
          code: "ITM-002",
          name: "Wireless Mouse M3",
          category: "Accessories",
          quantity: 0,
          status: "Out of Stock",
        },
        {
          code: "ITM-003",
          name: "Desk Chair Ergonomic",
          category: "Furniture",
          quantity: 12,
          status: "In Stock",
        },
      ],
    };
  },
};
</script>

<style scoped>
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}
.badge-success {
  background-color: #22cc62;
}
.badge-danger {
  background-color: #fc3d39;
}
</style>
