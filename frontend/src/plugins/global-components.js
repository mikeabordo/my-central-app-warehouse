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
import Product_Header from "@/views/pages/inventory/product-list/product-header.vue";
import Inputsize from "@/views/pages/uiinterface/forms/form-elements/formbasic/input-size.vue";
import Carouselthree from "@/views/pages/uiinterface/baseui/carousel/carousel-three.vue";
import Carouseltwo from "@/views/pages/uiinterface/baseui/carousel/carousel-two.vue";
import Carouselone from "@/views/pages/uiinterface/baseui/carousel/carousel-one.vue";
import LightBoxOne from "@/views/pages/uiinterface/baseui/lightbox/lightbox-one.vue";
import LightBoxTwo from "@/views/pages/uiinterface/baseui/lightbox/lightbox-two.vue";
import Payment from "@/views/pages/reports/supplier-report/pos-payment.vue";
import Return from "@/views/pages/reports/supplier-report/pos-return.vue";
import Salestax_Report from "@/views/pages/reports/tax-report/salestax-report.vue";
import Out_Of_Stocks from "@/views/pages/inventory/low-stocks/out-of-stocks.vue";
import ChatContent from "@/views/pages/application/chat/chat-content.vue";
import FolderCarousel from "@/views/pages/application/folder-carousel.vue";
import FileCarousel from "@/views/pages/application/files/files-carousel.vue";
import FileTable from "@/views/pages/application/files/file-table.vue";
import NotesCarousel from "@/views/pages/application/notes-carousel.vue";
import VectorMap from "@/views/pages/dashboard/vector-map.vue";
import ChatImage from "@/views/pages/application/chat/chat-images.vue";
import ChatRightimage from "@/views/pages/application/chat/chat-right-image.vue";
import ChatRightVideo from "@/views/pages/application/chat/chat-right-video.vue";

/********* Modal components **********/
import ManageStocksModal from "@/components/modal/manage-stocks-modal.vue";
import StockTransferModal from "@/components/modal/stock-transfer-modal.vue";
import StockAdjustmentModal from "@/components/modal/stock-adjustment-modal.vue";
import purchaseListModal from "@/components/modal/purchase-list-modal.vue";
import purchaseReturnsModal from "@/components/modal/purchase-returns-modal.vue";
import ProductlistModal from "@/components/modal/product-list-modal.vue";
import AddProductModal from "@/components/modal/add-product-modal.vue";
import ExpiredProductsModal from "@/components/modal/expired-products-modal.vue";
import ExpensesListModal from "@/components/modal/expenses-list-modal.vue";
import CustomersModal from "@/components/modal/customers-modal.vue";
import CategoryListModal from "@/components/modal/category-list-modal.vue";
import SubCategoriesModal from "@/components/modal/sub-categories-modal.vue";
import BrandListModal from "@/components/modal/brand-list-modal.vue";
import WarrantyModal from "@/components/modal/warranty-modal.vue";
import UnitsModal from "@/components/modal/units-modal.vue";
import VariantAttributesModal from "@/components/modal/varriant-attributes-modal.vue";
import BarcodeModal from "@/components/modal/barcode-modal.vue";
import UsersListModal from "@/components/modal/users-list-modal.vue";
import RolesPermissionsModal from "@/components/modal/roles-permissions-modal.vue";
import WarehouseModal from "@/components/modal/warehouse-modal.vue";
import SalesListModal from "@/components/modal/sales-list-modal.vue";
import SalesReturnsModal from "@/components/modal/sales-returns-modal.vue";
import SuppliersModal from "@/components/modal/suppliers-modal.vue";
import StoreListModal from "@/components/modal/store-list-modal.vue";
import StatesModal from "@/components/modal/states-modal.vue";
import CountriesModal from "@/components/modal/countries-modal.vue";
import CalendarModal from "@/components/modal/calendar-modal.vue";
import PosModal from "@/components/modal/pos-modal.vue";
import QuotationListModal from "@/components/modal/quotation-list-modal.vue";
import DepartmentGridModal from "@/components/modal/department-grid-modal.vue";
import DepartmentListModal from "@/components/modal/department-list-modal.vue";
import DesignationModal from "@/components/modal/designation-modal.vue";
import ShiftModal from "@/components/modal/shift-modal.vue";
import LeaveTypesModal from "@/components/modal/leave-types-modal.vue";
import LeavesEmployeeModal from "@/components/modal/leaves-employee-modal.vue";
import HolidayModal from "@/components/modal/holiday-modal.vue";
import PayrollListModal from "@/components/modal/payroll-list-modal.vue";
import SystemSettingsModal from "@/components/modal/system-settings-modal.vue";
import SocialModal from "@/components/modal/social-modal.vue";
import LanguageSettingsWebModal from "@/components/modal/language-settings-web-modal.vue";
import EmailSettingsModal from "@/components/modal/email-settings-modal.vue";
import SmsGatewayModal from "@/components/modal/sms-gateway-modal.vue";
import CustomFieldsModal from "@/components/modal/custom-fields-modal.vue";
import PaymentGatewaySettingsModal from "@/components/modal/payment-gateway-settings-modal.vue";
import PrinterModal from "@/components/modal/printer-modal.vue";
import BankSettingsGridModal from "@/components/modal/bank-settings-grid-modal.vue";
import TaxRatesModal from "@/components/modal/tax-rates-modal.vue";
import CurrencySettingsModal from "@/components/modal/currency-settings-modal.vue";
import StorageSettingsModal from "@/components/modal/storage-settings-modal.vue";
import BanIpAddressModal from "@/components/modal/ban-ip-address-modal.vue";
import FileManagerModal from "@/components/modal/file-manager-modal.vue";
import NotesModal from "@/components/modal/notes-modal.vue";

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
  app.component("product-header", Product_Header);
  app.component("input-size", Inputsize);
  app.component("carousel-one", Carouselone);
  app.component("carousel-two", Carouseltwo);
  app.component("carousel-three", Carouselthree);
  app.component("lightbox-one", LightBoxOne);
  app.component("lightbox-two", LightBoxTwo);
  app.component("pos-payment", Payment);
  app.component("pos-return", Return);
  app.component("salestax-report", Salestax_Report);
  app.component("out-of-stocks", Out_Of_Stocks);
  app.component("chat-content", ChatContent);
  app.component("folder-carousel", FolderCarousel);
  app.component("files-carousel", FileCarousel);
  app.component("file-table", FileTable);
  app.component("notes-carousel", NotesCarousel);
  app.component("vector-map", VectorMap);
  app.component("chat-image", ChatImage);
  app.component("chat-right-image", ChatRightimage);
  app.component("chat-right-video", ChatRightVideo);

  /********* Modal components **********/
  app.component("manage-stocks-modal", ManageStocksModal);
  app.component("stock-transfer-modal", StockTransferModal);
  app.component("stock-adjustment-modal", StockAdjustmentModal);
  app.component("purchase-list-modal", purchaseListModal);
  app.component("purchase-returns-modal", purchaseReturnsModal);
  app.component("product-list-modal", ProductlistModal);
  app.component("add-product-modal", AddProductModal);
  app.component("expired-products-modal", ExpiredProductsModal);
  app.component("expenses-list-modal", ExpensesListModal);
  app.component("customers-modal", CustomersModal);
  app.component("category-list-modal", CategoryListModal);
  app.component("sub-categories-modal", SubCategoriesModal);
  app.component("brand-list-modal", BrandListModal);
  app.component("warranty-modal", WarrantyModal);
  app.component("units-modal", UnitsModal);
  app.component("varriant-attributes-modal", VariantAttributesModal);
  app.component("barcode-modal", BarcodeModal);
  app.component("users-list-modal", UsersListModal);
  app.component("roles-permissions-modal", RolesPermissionsModal);
  app.component("warehouse-modal", WarehouseModal);
  app.component("sales-list-modal", SalesListModal);
  app.component("sales-returns-modal", SalesReturnsModal);
  app.component("suppliers-modal", SuppliersModal);
  app.component("store-list-modal", StoreListModal);
  app.component("states-modal", StatesModal);
  app.component("countries-modal", CountriesModal);
  app.component("calendar-modal", CalendarModal);
  app.component("pos-modal", PosModal);
  app.component("quotation-list-modal", QuotationListModal);
  app.component("department-grid-modal", DepartmentGridModal);
  app.component("department-list-modal", DepartmentListModal);
  app.component("designation-modal", DesignationModal);
  app.component("shift-modal", ShiftModal);
  app.component("leave-types-modal", LeaveTypesModal);
  app.component("leaves-employee-modal", LeavesEmployeeModal);
  app.component("holiday-modal", HolidayModal);
  app.component("payroll-list-modal", PayrollListModal);
  app.component("system-settings-modal", SystemSettingsModal);
  app.component("social-modal", SocialModal);
  app.component("language-settings-web-modal", LanguageSettingsWebModal);
  app.component("email-settings-modal", EmailSettingsModal);
  app.component("sms-gateway-modal", SmsGatewayModal);
  app.component("custom-fields-modal", CustomFieldsModal);
  app.component("payment-gateway-settings-modal", PaymentGatewaySettingsModal);
  app.component("printer-modal", PrinterModal);
  app.component("bank-settings-grid-modal", BankSettingsGridModal);
  app.component("tax-rates-modal", TaxRatesModal);
  app.component("currency-settings-modal", CurrencySettingsModal);
  app.component("storage-settings-modal", StorageSettingsModal);
  app.component("ban-ip-address-modal", BanIpAddressModal);
  app.component("file-manager-modal", FileManagerModal);
  app.component("notes-modal", NotesModal);
}
