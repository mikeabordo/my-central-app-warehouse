<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Item Pricing Master</h4>
              <h6>Manage Item Pricing</h6>
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
                  <template #item-actions="{ item }">
                    <div class="actions">
                      <button 
                      type="button"
                      class="btn btn-sm btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#view-item"
                      @click="viewItem(item)"
                      >
                      View
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
    <view-item-modal
      modal-id="view-item"
      title="View Item"
      :item="selectedItem"
      :fields="viewItemFields"
    />
  </div>
</template>

<script>
import ViewItemModal from "@/components/action-modal/view-item-modal.vue";

export default {
  name: "ItemList",
  components: {
    ViewItemModal,
  },
  data() {
    return {
      selectedItem: {},
      viewItemFields: [
        { label: "SKU",           key: "sku" },
        { label: "Product",       key: "product" },
        { label: "Edition",       key: "edition" },
        { label: "Location Code", key: "location_code" },
        { label: "Other Location", key: "other_location" },
      ],
      headers: [
        { text: "#", value: "index", sortable: false },
        { text: "SKU", value: "sku", sortable: true },
        { text: "Product", value: "product", sortable: true },
        { text: "Edition", value: "edition", sortable: true },
        { text: "Location Code", value: "location_code", sortable: true },
        { text: "Other Location", value: "other_location", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [
        {
          index: 1,
          sku: "ITM-001",
          product: "Laptop Pro X",
          edition: "Electronics",
          location_code: "LOC-001",
          other_location: "LOC-002",
        },
        {
          index: 2,
          sku: "ITM-002",
          product: "Wireless Mouse M3",
          edition: "Accessories",
          location_code: "LOC-002",
          other_location: "LOC-003",
        },
        {
          index: 3,
          sku: "ITM-003",
          product: "Desk Chair Ergonomic",
          edition: "Furniture",
          location_code: "LOC-003",
          other_location: "LOC-004",
        },
      ],
    };
  },
  methods: {
    viewItem(item) {
      this.selectedItem = { ...item };
    },
  },
};
</script>

<style scoped>

</style>
