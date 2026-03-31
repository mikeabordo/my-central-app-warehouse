<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Add New Warehouse</h4>
            <h6>Create a new warehouse location</h6>
          </div>
          <div class="page-btn">
            <router-link to="/warehouse-setup/warehouse-list" class="btn btn-added btn-dark">
              <vue-feather type="arrow-left" class="me-2"></vue-feather>Back to Warehouse List
            </router-link>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <add-form
              submitLabel="Submit Warehouse"
              :fields="fields"
              :loading="loading"
              @create="submitWarehouse"
              @cancel="$router.push('/warehouse-setup/warehouse-list')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddForm from "@/components/form/add-form.vue";
import api from "@/services/api";

export default {
  name: "AddNewWarehouse",
  components: {
    AddForm,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    fields() {
      return [
        {
          label: "Branch Name",
          key: "branchstorename",
          type: "text",
          required: true,
          placeholder: "Enter branch name",
          col: 12,
        },
        {
          label: "Branch Address",
          key: "branchaddress",
          type: "text",
          required: true,
          placeholder: "Enter branch address",
          col: 12,
        },
        {
          label: "Branch Contact",
          key: "branchcontact",
          type: "text",
          required: true,
          placeholder: "Enter branch contact",
          col: 12,
        },
      ];
    },
  },
  methods: {
    async submitWarehouse(formData) {
      this.loading = true;
      try {
        await api.post("/warehouse/warehouse", formData);
        this.$router.push("/warehouse-setup/warehouse-list");
      } catch (error) {
        console.error("Warehouse submission failed:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
