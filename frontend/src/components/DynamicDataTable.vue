<template>
  <div class="dynamic-datatable-wrapper">
    <!-- Search Input (optional) -->
    <div v-if="showSearch" class="datatable-search mb-3 position-relative" style="max-width: 300px;">
      <vue-feather type="search" class="search-icon"></vue-feather>
      <input
        v-model="internalSearchValue"
        type="text"
        class="form-control"
        :placeholder="searchPlaceholder"
        style="padding-left: 36px;"
      />
    </div>

    <EasyDataTable
      :headers="headers"
      :items="items"
      :search-value="internalSearchValue"
      :rows-per-page="rowsPerPage"
      :theme-color="themeColor"
      table-class-name="customize-table"
      header-text-direction="left"
      body-text-direction="left"
      alternating
      buttons-pagination
    >
      <!-- Dynamically pass through all scoped slots -->
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </EasyDataTable>
  </div>
</template>

<script>
export default {
  name: "DynamicDataTable",
  props: {
    headers: {
      type: Array,
      required: true,
      default: () => [],
    },
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    searchPlaceholder: {
      type: String,
      default: "Search...",
    },
    rowsPerPage: {
      type: Number,
      default: 10,
    },
    themeColor: {
      type: String,
      default: "#7638ff",
    },
  },
  data() {
    return {
      internalSearchValue: "",
    };
  },
};
</script>

<style scoped>
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #67748e;
  pointer-events: none;
}

.customize-table {
  --easy-table-header-font-size: 14px;
  --easy-table-header-font-color: #1b2559;
  --easy-table-header-background-color: #f8f9fa;

  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-font-color: #333;
  --easy-table-body-row-background-color: #fff;
  --easy-table-body-row-hover-background-color: #f5f5ff;

  --easy-table-row-border: 1px solid #e8e8e8;

  --easy-table-footer-font-size: 13px;
  --easy-table-footer-font-color: #666;
  --easy-table-footer-background-color: #fff;
}
</style>
