/**
 * Global Component Registration
 * Registers all globally-used components (layouts, page components, modals)
 */

/********* Layout components **********/
import Header from "@/views/layouts/pos-header.vue";
import Sidebar from "@/views/layouts/pos-sidebar.vue";
import UserMenu from "@/views/layouts/user-menu.vue";
import FilesSidebar from "@/views/layouts/files-sidebar.vue";
import Settings_Sidebar from "@/views/layouts/settings-sidebar.vue";
import Collapsed_Sidebar from "@/views/layouts/collapsed-sidebar.vue";
import Horizontal_Sidebar from "@/views/layouts/horizontal-sidebar.vue";
import SideSettings from "@/views/layouts/side-settings.vue";

/********* Breadcrumb component **********/
import Breadcrumb from "@/components/breadcrumb/layout-breadcrumb.vue";

/********* Page components **********/
import DynamicDataTable from "@/components/DynamicDataTable.vue";

import VectorMap from "@/views/pages/dashboard/vector-map.vue";



export function registerGlobalComponents(app) {
  /********* Layout components **********/
  app.component("layout-header", Header);
  app.component("layout-sidebar", Sidebar);
  app.component("user-menu", UserMenu);
  app.component("files-sidebar", FilesSidebar);
  app.component("settings-sidebar", Settings_Sidebar);
  app.component("collapsed-sidebar", Collapsed_Sidebar);
  app.component("horizontal-sidebar", Horizontal_Sidebar);
  app.component("side-settings", SideSettings);

  /********* Breadcrumb component **********/
  app.component("layout-breadcrumb", Breadcrumb);

  /********* Page components **********/
  app.component("dynamic-data-table", DynamicDataTable);

  app.component("vector-map", VectorMap);


}
