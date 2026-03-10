/**
 * Third-party Plugin Registration
 * Configures and installs all external Vue plugins and libraries
 */
import { BootstrapVue3, BToastPlugin } from "bootstrap-vue-3";
import Vue3Autocounter from "vue3-autocounter";
import VueApexCharts from "vue3-apexcharts";
import VueSelect from "vue3-select2-component";
import DatePicker from "vue3-datepicker";
import StarRating from "vue-star-rating";
import Antd from "ant-design-vue";
import VueFeather from "vue-feather";

import VueSweetalert2 from "vue-sweetalert2";

import VueEasyLightbox from "vue-easy-lightbox";



import swal from "sweetalert2";

export function registerThirdPartyPlugins(app) {
    // Global third-party components
    app.component("vue3-autocounter", Vue3Autocounter);
    app.component(VueFeather.name, VueFeather);
    app.component("vue-select", VueSelect);
    app.component("date-picker", DatePicker);
    app.component("star-rating", StarRating);

    // Plugin installation
    app.use(VueSweetalert2);
    app.use(VueApexCharts);
    app
        .use(VueEasyLightbox)
        .use(Antd)
        .use(BootstrapVue3)
        .use(BToastPlugin);

    // Global sweetalert2 instance
    window.Swal = swal;
}
