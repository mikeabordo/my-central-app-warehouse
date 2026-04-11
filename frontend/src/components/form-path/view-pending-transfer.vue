<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4 d-none d-md-flex">
          <div class="minimal-breadcrumb">
            <router-link to="/stock-transfer/pending-transfer" class="mb-item">
              Pending Transfer
            </router-link>
            <div class="mb-separator">
              <vue-feather type="chevron-right" size="16"></vue-feather>
            </div>
            <div class="mb-item active">
              View Pending Transfer
            </div>
          </div>
        </nav>

        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>View Transfer Details</h4>
          </div>
          <div class="page-btn">
            <router-link to="/stock-transfer/pending-transfer" class="btn btn-added btn-dark">
              <vue-feather type="arrow-left" class="me-2"></vue-feather>Back to List
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
                {{ row.booktype }}:{{ row.bookitemkey }}
              </template>
              <template #col-product_details="row">
                <div class="d-flex flex-column gap-1">
                  <span class="fw-bold text-dark fs-6">{{ row.title || '—' }}</span>
                  <div class="text-secondary small d-flex flex-column">
                    <span v-if="row.author">Author: {{ row.author }}</span>
                    <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                    <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                  </div>
                </div>
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
  name: "ViewPendingTransfer",
  components: {
    ViewDetail,
  },
  data() {
    return {
      loading: false,
      item: {},
      summaryFields: [
        { label: "Reference No", key: "stfNo" },
        { label: "From Location", key: "fromBranch" },
        { label: "To Location", key: "toBranch" },
        { label: "Date Created", key: "createdAt" },
        { label: "Remarks", key: "remarks" },
        { label: "Status", key: "status" },
      ],
      columns: [
        { label: "Item Key", key: "item_key", width: "30%" },
        { label: "Product Details", key: "product_details", width: "50%" },
        { label: "Qty", key: "qtyDelivered", width: "20%" },
      ],
      tableItems: [],
    };
  },
  created() {
    this.fetchTransferDetails();
  },
  methods: {
    async fetchTransferDetails() {
      this.loading = true;
      const stfNo = this.$route.params.id;
      try {
        const responseData = await api.get(`/warehouse/stf/items?stfNo=${stfNo}`);

        // info is an object, lines is an array
        if (responseData.info) {
          this.item = responseData.info;
        }

        this.tableItems = Array.isArray(responseData.lines) ? responseData.lines : [];
      } catch (error) {
        console.error("Failed to fetch transfer details:", error);
      } finally {
        this.loading = false;
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
  color: #FF9F43;
}

.mb-item.active {
  color: #1e293b;
  font-weight: 500;
  border-bottom: 1px solid #FF9F43;
}

.mb-separator {
  display: flex;
  align-items: center;
  margin: 0 12px;
  color: #abb2ba;
  font-weight: 500;
}

.badges {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.bg-lightyellow {
  background-color: #fff8e1;
  color: #f57f17;
}

.bg-lightgreen {
  background-color: #e8f5e9;
  color: #2e7d32;
}
</style>
