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
      :loading="loading"
      table-class-name="customize-table"
      header-text-direction="left"
      body-text-direction="left"
      alternating
      buttons-pagination
    >
    <template #loading>
      <div class="table-loader">
        <div class="whirly-loader"></div>
      </div>
    </template>

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
    loading: {
      type: Boolean,
      default: false,
    },
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
  --easy-table-header-font-color: #67748e;

  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-font-color: #333;
  --easy-table-body-row-background-color: #fff;
  --easy-table-body-row-hover-background-color: #f5f5ff;
  --easy-table-body-row-height: 80px;

  --easy-table-row-border: 1px solid #e8e8e8;

  --easy-table-footer-font-size: 13px;
  --easy-table-footer-font-color: #666;
  --easy-table-footer-background-color: #fff;

  padding: 15px;
}

.table-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  position: relative;
  width: 100%;
  min-height: 150px;
}

/* Re-implementing whirly-loader locally to ensure it works without #global-loader parent */
.whirly-loader {
  background: transparent;
  animation: whirly-loader 1.25s linear infinite;
  box-shadow: 0 26px 0 6px #FF9F43, 0.90971px 26.05079px 0 5.93333px #FF9F43, 1.82297px 26.06967px 0 5.86667px #FF9F43, 2.73865px 26.05647px 0 5.8px #FF9F43, 3.65561px 26.01104px 0 5.73333px #FF9F43, 4.57274px 25.93327px 0 5.66667px #FF9F43, 5.48887px 25.8231px 0 5.6px #FF9F43, 6.40287px 25.68049px 0 5.53333px #FF9F43, 7.31358px 25.50548px 0 5.46667px #FF9F43, 8.21985px 25.2981px 0 5.4px #FF9F43, 9.12054px 25.05847px 0 5.33333px #FF9F43, 10.01448px 24.78672px 0 5.26667px #FF9F43, 10.90054px 24.48302px 0 5.2px #FF9F43, 11.77757px 24.1476px 0 5.13333px #FF9F43, 12.64443px 23.78072px 0 5.06667px #FF9F43, 13.5px 23.38269px 0 5px #FF9F43, 14.34315px 22.95384px 0 4.93333px #FF9F43, 15.17277px 22.49455px 0 4.86667px #FF9F43, 15.98776px 22.00526px 0 4.8px #FF9F43, 16.78704px 21.48643px 0 4.73333px #FF9F43, 17.56953px 20.93855px 0 4.66667px #FF9F43, 18.33418px 20.36217px 0 4.6px #FF9F43, 19.07995px 19.75787px 0 4.53333px #FF9F43, 19.80582px 19.12626px 0 4.46667px #FF9F43, 20.5108px 18.468px 0 4.4px #FF9F43, 21.1939px 17.78379px 0 4.33333px #FF9F43, 21.85416px 17.07434px 0 4.26667px #FF9F43, 22.49067px 16.34043px 0 4.2px #FF9F43, 23.10251px 15.58284px 0 4.13333px #FF9F43, 23.68881px 14.80241px 0 4.06667px #FF9F43, 24.24871px 14px 0 4px #FF9F43, 24.7814px 13.1765px 0 3.93333px #FF9F43, 25.28607px 12.33284px 0 3.86667px #FF9F43, 25.76198px 11.46997px 0 3.8px #FF9F43, 26.2084px 10.58888px 0 3.73333px #FF9F43, 26.62462px 9.69057px 0 3.66667px #FF9F43, 27.01001px 8.77608px 0 3.6px #FF9F43, 27.36392px 7.84648px 0 3.53333px #FF9F43, 27.68577px 6.90284px 0 3.46667px #FF9F43, 27.97502px 5.94627px 0 3.4px #FF9F43, 28.23116px 4.97791px 0 3.33333px #FF9F43, 28.4537px 3.99891px 0 3.26667px #FF9F43, 28.64223px 3.01042px 0 3.2px #FF9F43, 28.79635px 2.01364px 0 3.13333px #FF9F43, 28.91571px 1.00976px 0 3.06667px #FF9F43, 29px 0 0 3px #FF9F43, 29.04896px -1.01441px 0 2.93333px #FF9F43, 29.06237px -2.03224px 0 2.86667px #FF9F43, 29.04004px -3.05223px 0 2.8px #FF9F43, 28.98185px -4.07313px 0 2.73333px #FF9F43, 28.88769px -5.09368px 0 2.66667px #FF9F43, 28.75754px -6.1126px 0 2.6px #FF9F43, 28.59138px -7.12863px 0 2.53333px #FF9F43, 28.38926px -8.14049px 0 2.46667px #FF9F43, 28.15127px -9.1469px 0 2.4px #FF9F43, 27.87755px -10.1466px 0 2.33333px #FF9F43, 27.56827px -11.1383px 0 2.26667px #FF9F43, 27.22365px -12.12075px 0 2.2px #FF9F43, 26.84398px -13.09268px 0 2.13333px #FF9F43, 26.42956px -14.05285px 0 2.06667px #FF9F43, 25.98076px -15px 0 2px #FF9F43, 25.49798px -15.93291px 0 1.93333px #FF9F43, 24.98167px -16.85035px 0 1.86667px #FF9F43, 24.43231px -17.75111px 0 1.8px #FF9F43, 23.85046px -18.63402px 0 1.73333px #FF9F43, 23.23668px -19.49789px 0 1.66667px #FF9F43, 22.5916px -20.34157px 0 1.6px #FF9F43, 21.91589px -21.16393px 0 1.53333px #FF9F43, 21.21024px -21.96384px 0 1.46667px #FF9F43, 20.4754px -22.74023px 0 1.4px #FF9F43, 19.71215px -23.49203px 0 1.33333px #FF9F43, 18.92133px -24.2182px 0 1.26667px #FF9F43, 18.10379px -24.91772px 0 1.2px #FF9F43, 17.26042px -25.58963px 0 1.13333px #FF9F43, 16.39217px -26.23295px 0 1.06667px #FF9F43, 15.5px -26.84679px 0 1px #FF9F43, 14.58492px -27.43024px 0 0.93333px #FF9F43, 13.64796px -27.98245px 0 0.86667px #FF9F43, 12.69018px -28.50262px 0 0.8px #FF9F43, 11.7127px -28.98995px 0 0.73333px #FF9F43, 10.71663px -29.4437px 0 0.66667px #FF9F43, 9.70313px -29.86317px 0 0.6px #FF9F43, 8.67339px -30.2477px 0 0.53333px #FF9F43, 7.6286px -30.59666px 0 0.46667px #FF9F43, 6.57001px -30.90946px 0 0.4px #FF9F43, 5.49886px -31.18558px 0 0.33333px #FF9F43, 4.41643px -31.42451px 0 0.26667px #FF9F43, 3.32401px -31.6258px 0 0.2px #FF9F43, 2.22291px -31.78904px 0 0.13333px #FF9F43, 1.11446px -31.91388px 0 0.06667px #FF9F43, 0 -32px 0 0 #FF9F43;
  display: inline-block;
  height: 4px;
  width: 4px;
  border-radius: 100%;
  position: relative;
  /* Centering the visual ring relative to the element */
  transform: translateY(-26px); 
}

.pulse-logo {
  width: 50px;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 1.5s ease-in-out infinite;
  opacity: 1;
  z-index: 2;
}

@keyframes whirly-loader {
  to { transform: translateY(-26px) rotate(1turn); }
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
}
</style>
