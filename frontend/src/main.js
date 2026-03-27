import { createApp } from "vue";
import { router } from "@/router";
import App from "@/App.vue";

/********* Layout components **********/
import Header from "@/views/layouts/pos-header.vue";
import Sidebar from "@/views/layouts/pos-sidebar.vue";
import UserMenu from "@/views/layouts/user-menu.vue";
import FilesSidebar from "@/views/layouts/files-sidebar.vue";
import Settings_Sidebar from "@/views/layouts/settings-sidebar.vue";
import Collapsed_Sidebar from "@/views/layouts/collapsed-sidebar.vue";
import Horizontal_Sidebar from "@/views/layouts/horizontal-sidebar.vue";
import SideSettings from "@/views/layouts/side-settings.vue";

/********* Page components **********/
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import VectorMap from "@/views/pages/dashboard/vector-map.vue";

/********* Third-party Plugins **********/
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

/********* Data Table **********/
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

/********* Stylesheets **********/
import "ant-design-vue/dist/reset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "boxicons/css/boxicons.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "pe7-icon/dist/dist/pe-icon-7-stroke.css";
import "typicons.font/src/font/typicons.css";
import "weathericons/css/weather-icons.css";
import "ionicons-npm/css/ionicons.css";
import "@/assets/css/feather.css";
import "@/assets/css/style.css";

// Global instance for sweetalert
window.Swal = swal;

// Create and configure the app
const app = createApp(App);

/********* Global Component Registrations **********/
app.component("layout-header", Header);
app.component("layout-sidebar", Sidebar);
app.component("user-menu", UserMenu);
app.component("files-sidebar", FilesSidebar);
app.component("settings-sidebar", Settings_Sidebar);
app.component("collapsed-sidebar", Collapsed_Sidebar);
app.component("horizontal-sidebar", Horizontal_Sidebar);
app.component("side-settings", SideSettings);

app.component("DynamicDataTable", DynamicDataTable);
app.component("vector-map", VectorMap);

app.component("EasyDataTable", Vue3EasyDataTable);
app.component("vue3-autocounter", Vue3Autocounter);
app.component(VueFeather.name, VueFeather);
app.component("vue-select", VueSelect);
app.component("date-picker", DatePicker);
app.component("star-rating", StarRating);

/********* Plugin installation **********/
app.use(VueSweetalert2);
app.use(VueApexCharts);
app.use(VueEasyLightbox);
app.use(Antd);
app.use(BootstrapVue3);
app.use(BToastPlugin);

app.use(router).mount("#app");
