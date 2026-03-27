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
                <dynamic-data-table :headers="headers" :items="items" searchPlaceholder="Search items...">
                  <!-- We can add specific scoped slots for items here if needed -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="`/stock-monitoring/item-pricing/view/${item.id}`"
                        class="btn btn-sm btn-icon-only btn-outline-dark" title="View Details">
                        <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
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

export default {
  name: "ItemPricing",
  components: {
  },
  data() {
    return {
      selectedItem: {},
      viewItemFields: [
        { label: "SKU", key: "sku" },
        { label: "Product", key: "product" },
        { label: "Edition", key: "edition" },
      ],
      headers: [
        { text: "#", value: "index", sortable: false },
        { text: "SKU", value: "sku", sortable: true },
        { text: "Product", value: "product", sortable: true },
        { text: "Edition", value: "edition", sortable: true },
        { text: "Actions", value: "actions", sortable: false },
      ],
      items: [
        {
          id: 1,
          index: 1,
          sku: "ITM-001",
          product: "Laptop Pro X",
          edition: "Electronics",
        },
        {
          id: 2,
          index: 2,
          sku: "ITM-002",
          product: "Wireless Mouse M3",
          edition: "Accessories",
        },
        {
          id: 3,
          index: 3,
          sku: "ITM-003",
          product: "Desk Chair Ergonomic",
          edition: "Furniture",
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

