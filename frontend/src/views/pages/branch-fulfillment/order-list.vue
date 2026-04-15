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
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await api.get("/warehouse/order/list");
        console.log(response);
        // Be defensive: API shapes can vary (array payload vs wrapped payload).
        const responseData = response?.data;
        const ordersArray = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData?.data)
            ? responseData.data
            : [];

        // NOTE: `/warehouse/order/list` only returns PENDING requests (per backend behavior),
        // but some payloads may omit `status` or use different casing/keys. We normalize here so the UI
        // never accidentally shows a "danger" badge due to a mismatch like "PENDING" vs "Pending".
        //
        // Ensure the "action" column always has something usable even if the API doesn't provide it.
        this.orders = ordersArray.map((order) => ({
          ...order,
          // This page is ONLY for pending requests; keep a default to prevent blank/unknown UI states.
          status: order?.status ?? order?.Status ?? "PENDING",
          action: order,
        }));
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        this.loading = false;
      }
    },

    // `/warehouse/order/list` returns pending orders only, so the badge should always be the warning style.
    getStatusBadgeClass(status) {
      // Keep `status` param to match the slot API, even though we don't use it.
      void status;
      return "badge-warning";
    },

    formatStatus(status) {
      // Display is always "Pending" because the API endpoint returns pending orders only.
      void status;
      return "Pending";
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
  color: #fff;
}

.badge-warning {
  background-color: #ff9f43;
}
</style>
