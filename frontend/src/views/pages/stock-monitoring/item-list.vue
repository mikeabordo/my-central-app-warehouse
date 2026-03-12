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
        { label: "ISBN",          key: "isbn" },
        { label: "Page No.",      key: "page_no" },
        { label: "Regular Price", key: "regular_price" },
      ],
      headers: [
        { text: "#", value: "index", sortable: false },
        { text: "SKU", value: "sku", sortable: true },
        { text: "Product", value: "product", sortable: true },
        { text: "Edition", value: "edition", sortable: true },
        { text: "ISBN", value: "isbn", sortable: true },
        { text: "Page No.", value: "page_no", sortable: true },
        { text: "Regular Price", value: "regular_price", sortable: true },
        { text: "Actions", value: "actions", sortable: true },
      ],
      items: [
        {
          index: 1,
          sku: "ITM-001",
          product: "Laptop Pro X",
          edition: "Electronics",
          isbn: "45",
          page_no: "In Stock",
          regular_price: "In Stock",
        },
        {
          index: 2,
          sku: "ITM-002",
          product: "Wireless Mouse M3",
          edition: "Accessories",
          isbn: "0",
          page_no: "Out of Stock",
          regular_price: "In Stock",
        },
        {
          index: 3,
          sku: "ITM-003",
          product: "Desk Chair Ergonomic",
          edition: "Furniture",
          isbn: "12",
          page_no: "In Stock",
          regular_price: "In Stock",
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
