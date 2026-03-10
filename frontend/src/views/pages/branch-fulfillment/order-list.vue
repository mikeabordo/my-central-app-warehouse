<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Order List</h4>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table
                  :headers="headers"
                  :items="orders"
                  searchPlaceholder="Search orders..."
                >
                  <template #item-status="{ status }">
                    <span
                      :class="[
                        'badge',
                        status === 'Completed' ? 'badge-success' : 
                        status === 'Pending' ? 'badge-warning' : 'badge-danger',
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
  name: "OrderList",
  data() {
    return {
      headers: [
        { text: "Order ID", value: "id", sortable: true },
        { text: "Customer Name", value: "customer", sortable: true },
        { text: "Date", value: "date", sortable: true },
        { text: "Total Amount", value: "total", sortable: true },
        { text: "Status", value: "status", sortable: true },
      ],
      orders: [
        {
          id: "ORD-001001",
          customer: "John Doe",
          date: "2026-03-01",
          total: "$150.00",
          status: "Completed",
        },
        {
          id: "ORD-001002",
          customer: "Jane Smith",
          date: "2026-03-05",
          total: "$89.50",
          status: "Pending",
        },
        {
          id: "ORD-001003",
          customer: "Alice Johnson",
          date: "2026-03-06",
          total: "$1,200.00",
          status: "Cancelled",
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
.badge-warning {
  background-color: #ff9f43;
}
.badge-danger {
  background-color: #fc3d39;
}
</style>
