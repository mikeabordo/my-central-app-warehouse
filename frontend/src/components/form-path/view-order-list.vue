<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>

    <div class="page-wrapper">
      <div class="content">
        <!-- Breadcrumb (matches the stock-transfer "backPath/backLabel" pattern) -->
        <nav aria-label="breadcrumb" class="mb-4 d-none d-md-flex">
          <div class="minimal-breadcrumb">
            <router-link :to="backPath" class="mb-item">
              {{ backLabel }}
            </router-link>
            <div class="mb-separator">
              <vue-feather type="chevron-right" size="16"></vue-feather>
            </div>
            <div class="mb-item active">View {{ backLabel }}</div>
          </div>
        </nav>

        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>View Order Details</h4>
          </div>
          <div class="page-btn d-flex gap-2">
            <button v-if="canShowGenerateStockNo" type="button"
              class="btn btn-added btn-gradient warm d-flex align-items-center" :disabled="loading || generatingStf"
              @click="generateStockNo">
              <vue-feather type="loader" class="me-2" size="18"></vue-feather>
              {{ generatingStf ? "Generating..." : "Generate Stock No." }}
            </button>
            <router-link :to="backPath" class="btn btn-added btn-dark d-flex align-items-center">
              <vue-feather type="arrow-left" class="me-2" size="18"></vue-feather>Back to Order List
            </router-link>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <view-detail v-else :item="item" :summaryFields="summaryFields" :columns="columns" :tableItems="tableItems">
              <template #col-item_key="row">
                <span class="fw-bold text-dark fs-6">{{ row.booktype }}</span>:{{ row.bookitemkey }}
              </template>
              <template #col-book_details="row">
                <div class="d-flex flex-column gap-1">
                  <span class="fw-bold text-dark fs-6">{{
                    row.title || "—"
                  }}</span>
                  <div class="text-secondary small d-flex flex-column">
                    <span v-if="row.author">Author: {{ row.author }}</span>
                    <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                    <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                  </div>
                </div>
              </template>
              <template #col-qty_requested="row">
                {{ row.qtyRequested ?? "—" }}
              </template>
            </view-detail>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewDetail from "@/components/form/view-item-table.vue";
import api from "@/services/api";

export default {
  name: "ViewOrderList",
  components: {
    ViewDetail,
  },
  props: {
    // Used by the breadcrumb/back button; passed via router query just like ViewTransfer.
    backPath: {
      type: String,
      default: "/branch-fulfillment/order-list",
    },
    backLabel: {
      type: String,
      default: "Order List",
    },
    // Route param; maps to `rsNo` for the `/warehouse/order/items` endpoint.
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      generatingStf: false,
      orderDetailsLoaded: false,
      item: {},
      summaryFields: [
        { label: "Reference No", key: "RSNo" },
        { label: "Origin", key: "fromBranch" },
        { label: "Date Created", key: "createdAt" },
        { label: "Memo", key: "remarks" },
        { label: "Status", key: "status" },
        { label: "Requested By", key: "requestedBy" },
      ],
      columns: [
        { label: "Item Key", key: "item_key", width: "30%" },
        { label: "Book Details", key: "book_details", width: "50%" },
        { label: "Qty Requested", key: "qty_requested", width: "20%" },
      ],
      tableItems: [],
    };
  },
  computed: {
    isProcessingStatus() {
      return this.normalizeStatusValue(this.item?.status) === "processing";
    },
    canShowGenerateStockNo() {
      return this.orderDetailsLoaded && !this.isProcessingStatus;
    },
  },
  created() {
    this.fetchOrderDetails();
  },
  methods: {
    normalizeStatusValue(status) {
      return (status ?? "").toString().trim().toLowerCase();
    },
    async fetchOrderDetails() {
      this.loading = true;
      this.orderDetailsLoaded = false;
      const rsNo = this.id;
      try {
        const responseData = await api.get(
          `/warehouse/order/items?rsNo=${rsNo}`,
        );

        // Response follows the same { info, lines } convention as stock-transfer endpoints.
        const info = responseData?.info ?? {};
        // Normalize a couple of common key variants so the summary row stays populated.
        this.item = {
          ...info,
          RSNo: info?.RSNo || info?.rsNo || rsNo,
        };
        this.tableItems = Array.isArray(responseData?.lines)
          ? responseData.lines
          : [];
        this.orderDetailsLoaded = true;
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        this.loading = false;
      }
    },
    async generateStockNo() {
      if (this.isProcessingStatus) {
        return;
      }

      const reference = this.item?.RSNo || this.item?.rsNo || this.id;
      const payload = {
        reference,
        remarks: this.item?.remarks || "",
      };

      this.generatingStf = true;
      try {
        const responseData = await api.post("/warehouse/stf/generate", payload);
        const stfNo =
          responseData?.stfNo ||
          responseData?.info?.stfNo ||
          responseData?.data?.stfNo ||
          responseData?.data?.info?.stfNo;

        if (!stfNo) {
          throw new Error("STF number was not returned by /warehouse/stf/generate.");
        }

        this.$router.push({
          path: `/branch-fulfillment/fulfill/${stfNo}`,
          query: { backPath: this.backPath, backLabel: this.backLabel },
        });
      } catch (error) {
        console.error("Failed to generate STF:", error);
      } finally {
        this.generatingStf = false;
      }
    },
  },
};
</script>

<style scoped>
.minimal-breadcrumb {
  display: inline-flex;
  align-items: center;
  background: transparent;
  padding: 0;
}

.mb-item {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding-bottom: 2px;
  font-style: italic;
}

.mb-item:hover:not(.active) {
  color: #ff9f43;
}

.mb-item.active {
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #ff9f43;
}

.mb-separator {
  display: flex;
  align-items: center;
  margin: 0 12px;
  color: #abb2ba;
  font-weight: 500;
}
</style>
