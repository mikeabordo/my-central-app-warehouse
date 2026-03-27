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
                <DynamicDataTable :headers="headers" :items="items" searchPlaceholder="Search items...">
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="`/stock-monitoring/item-list/view/${item.id}`"
                        class="btn btn-sm btn-icon-only btn-outline-dark" title="View Details">
                        <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
                    </div>
                  </template>
                </DynamicDataTable>
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
  name: "ItemList",
  data() {
    return {
      selectedItem: {},
      viewItemFields: [
        { label: "SKU", key: "sku" },
        { label: "Product", key: "product" },
        { label: "Edition", key: "edition" },
        { label: "ISBN", key: "isbn" },
        { label: "Page No.", key: "page_no" },
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
          id: 1,
          index: 1,
          sku: "ITM-001",
          product: "Laptop Pro X",
          edition: "Electronics",
          isbn: "45",
          page_no: "In Stock",
          regular_price: "In Stock",
        },
        {
          id: 2,
          index: 2,
          sku: "ITM-002",
          product: "Wireless Mouse M3",
          edition: "Accessories",
          isbn: "0",
          page_no: "Out of Stock",
          regular_price: "In Stock",
        },
        {
          id: 3,
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
