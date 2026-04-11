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
              Edit Pending Transfer
            </div>
          </div>
        </nav>

        <!-- Page Header -->
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Edit Transfer</h4>
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
            <edit-form v-else :fields="fields" :item="item" :summaryFields="summaryFields" submitLabel="Update Transfer"
              @update="handleUpdate" @cancel="$router.push('/stock-transfer/pending-transfer')">
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
            </edit-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditForm from "@/components/form/edit-form.vue";
import api from "@/services/api";

export default {
  name: "EditPendingTransfer",
  components: {
    EditForm,
  },
  data() {
    return {
      loading: false,
      item: {},
      branchOptions: [],
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "lines",
          label: "Product Name",
          type: "search",
          required: true,
          placeholder: "Search product by name or code…",
          method: "get",
          endpoint: "/books/search",
          labelKey: "name",
          valueKey: "id",
          minChars: 1,
          debounce: 350,
          col: 12,
          tableColumns: [
            { label: "Item Key", key: "item_key" },
            { label: "Product Details", key: "product_details" },
            { label: "Quantity", key: "qty", editable: true },
          ],
        },
      ];
    },
    summaryFields() {
      return [
        {
          label: "Reference",
          key: "stfNo",
          type: "text",
          disabled: true
        },
        {
          label: "Memo",
          key: "remarks",
          type: "textarea",
          placeholder: "Enter memo...",
        },
        {
          label: "Status",
          key: "status",
        },
      ];
    },
  },
  async created() {
    await this.fetchBranches();
    await this.fetchTransferDetails();
  },
  methods: {
    async fetchBranches() {
      try {
        const responseData = await api.get("/warehouse/departments");
        const raw = Array.isArray(responseData)
          ? responseData
          : responseData?.data ?? [];
        this.branchOptions = raw.map((b) => ({
          value: b.id || b.branchId || b.value || b.name,
          label: b.name || b.branchName || b.label,
        }));
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    },
    async fetchTransferDetails() {
      this.loading = true;
      const stfNo = this.$route.params.id;
      try {
        const responseData = await api.get(`/warehouse/stf/items?stfNo=${stfNo}`);

        if (responseData.info) {
          // Clone the info object to item
          this.item = { ...responseData.info };
          
          // Map lines directly into item_id so the edit-form search field picks it up as an array
          if (Array.isArray(responseData.lines)) {
            this.item.lines = responseData.lines.map(line => ({
              ...line,
              id: line.id || line.value, 
              name: line.name || line.title || line.itemKey,
              qty: line.qty || line.qtyDelivered || 1
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch transfer details:", error);
      } finally {
        this.loading = false;
      }
    },
    async handleUpdate(formData) {
      this.loading = true;
      try {
        // Clean up data for the backend
        const payload = { ...formData };
        
        // Remove 'status' string to avoid triggering the backend bug with fail($message, $status)
        delete payload.status;
        
        await api.post("/warehouse/stf/update", payload);
        this.$router.push("/stock-transfer/pending-transfer");
      } catch (error) {
        console.error("Failed to update transfer:", error);
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
</style>
