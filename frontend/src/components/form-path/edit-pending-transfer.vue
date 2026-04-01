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
              @update="handleUpdate" @cancel="$router.push('/stock-transfer/pending-transfer')" />
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
      summaryFields: [
        { label: "Reference No", key: "stfNo" },
        { label: "Status", key: "status" },
      ],
    };
  },
  computed: {
    fields() {
      return [
        {
          label: "Item",
          key: "item_id",
          type: "search",
          endpoint: "/items/search",
          labelKey: "name",
          valueKey: "id",
          placeholder: "Search item…",
          minChars: 1,
          debounce: 350,
          col: 12,
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
        const responseData = await api.get("/warehouse/branches");
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
      const id = this.$route.params.id;
      try {
        const responseData = await api.get("/warehouse/stf/list");
        const list = Array.isArray(responseData.data) ? responseData.data
          : Array.isArray(responseData) ? responseData : [];
        const found = list.find(t => String(t.id) === String(id));
        if (found) {
          // Map itemName to name so EditForm's search field pre-fills correctly
          this.item = {
            ...found,
            name: found.itemName || found.itemKey || ""
          };
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
        await api.post("/warehouse/stf/update", formData);
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
