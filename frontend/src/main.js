import { createApp } from "vue";
import { router } from "@/router";
import App from "@/App.vue";

// Plugin registrations (modularized)
import { registerGlobalComponents, registerThirdPartyPlugins } from "@/plugins";

// Vue3 Easy Data Table
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

// Stylesheets
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

// Create and configure the app
const app = createApp(App);

// Register EasyDataTable globally
app.component("EasyDataTable", Vue3EasyDataTable);

registerGlobalComponents(app);
registerThirdPartyPlugins(app);

app.use(router).mount("#app");
