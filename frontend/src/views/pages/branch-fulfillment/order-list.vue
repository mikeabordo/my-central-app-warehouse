<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Order List</h4>
            <h6>Manage Order List</h6>
          </div>
          <div class="page-btn"></div>
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-body">
                <dynamic-data-table :headers="headers" :items="orders" :loading="loading"
                  searchPlaceholder="Search orders...">
                  <template #item-status="{ status }">
                    <span :class="['badge', getStatusBadgeClass(status)]">
                      {{ formatStatus(status) }}
                    </span>
                  </template>
                  <template #item-action="{ action }">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="{
                        name: 'view-order-list',
                        // Prefer RSNo (API expects `rsNo`), but keep fallbacks to avoid breaking older payloads.
                        params: { id: action?.RSNo || action?.rsNo || action?.id },
                        query: {
                          backPath: '/branch-fulfillment/order-list',
                          backLabel: 'Order List',
                        },
                      }" class="btn btn-sm btn-icon-only btn-outline-secondary">
                        <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
                      <button class="btn btn-sm btn-icon-only btn-outline-info" @click="printOrder(action)">
                        <vue-feather type="printer" size="14"></vue-feather>
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
import api from "@/services/api";

export default {
  name: "OrderList",
  data() {
    return {
      // Helps the table show a loader while the API call is in-flight.
      loading: false,
      headers: [
        { text: "#", value: "id", sortable: true },
        { text: "Date", value: "createdAt", sortable: true },
        { text: "Ref No", value: "RSNo", sortable: true },
        { text: "Origin", value: "fromBranch", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Memo", value: "remarks", sortable: true },
        { text: "Requested By", value: "requestedBy", sortable: true },
        { text: "Action", value: "action", sortable: true },
      ],
      orders: [],
    };
  },
  created() {
    this.fetchOrders();
  },

  methods: {
    normalizeStatusValue(status) {
      return (status ?? "").toString().trim().toLowerCase();
    },
    getOrderReference(order) {
      return order?.RSNo || order?.rsNo || order?.id;
    },
    normalizeOrder(order) {
      const reference = this.getOrderReference(order);
      const normalizedStatus =
        this.normalizeStatusValue(order?.status ?? order?.Status) || "pending";

      return {
        ...order,
        id: order?.id ?? reference,
        RSNo: reference,
        status: normalizedStatus.toUpperCase(),
        action: order,
      };
    },
    extractOrdersArray(response) {
      return Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];
    },
    mergeOrders(pendingOrders, processingOrders) {
      const ordersByReference = new Map();

      pendingOrders.forEach((order) => {
        const normalizedOrder = this.normalizeOrder(order);
        ordersByReference.set(this.getOrderReference(normalizedOrder), normalizedOrder);
      });

      // Processing should win if the same RS exists in both endpoint responses.
      processingOrders.forEach((order) => {
        const normalizedOrder = this.normalizeOrder(order);
        ordersByReference.set(this.getOrderReference(normalizedOrder), normalizedOrder);
      });

      return Array.from(ordersByReference.values());
    },
    async fetchOrders() {
      this.loading = true;
      try {
        const [pendingResponse, processingResponse] = await Promise.all([
          api.get("/warehouse/order/list?status=pending"),
          api.get("/warehouse/order/list?status=processing"),
        ]);

        this.orders = this.mergeOrders(
          this.extractOrdersArray(pendingResponse),
          this.extractOrdersArray(processingResponse),
        );
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        this.loading = false;
      }
    },

    getStatusBadgeClass(status) {
      const normalizedStatus = this.normalizeStatusValue(status);

      if (normalizedStatus === "processing") return "badge-processing-light";
      if (normalizedStatus === "pending") return "badge-pending-light";
      return "";
    },

    formatStatus(status) {
      const normalizedStatus = this.normalizeStatusValue(status);

      if (normalizedStatus === "processing") return "Processing";
      if (normalizedStatus === "pending") return "Pending";
      return (status ?? "").toString();
    },

    viewOrder(order) {
      // Placeholder handler: keeps the button safe even if routing isn't wired up yet.
      // If/when a view page exists, route from here using a stable order identifier.
      console.log("View order:", order);
    },
  },
};
</script>

<style scoped>
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.badge-pending-light {
  background-color: rgba(255, 159, 67, 0.12);
  color: #ff9f43;
}

.badge-processing-light {
  background-color: rgba(24, 144, 255, 0.12);
  color: #1890ff;
}
</style>
