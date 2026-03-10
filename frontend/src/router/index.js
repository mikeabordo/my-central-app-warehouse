/**
 * Router Configuration
 * Aggregates all route modules into a single router instance
 */
import { createRouter, createWebHistory } from 'vue-router'

// Route modules
import authRoutes from './modules/auth'
import dashboardRoutes from './modules/dashboard'
import warehouseSetupRoutes from './modules/warehouse-setup'
import stockMonitoringRoutes from './modules/stock-monitoring'
import inboundRoutes from './modules/inbound'
import branchFulfillmentRoutes from './modules/branch-fulfillment'
import pullOutRoutes from './modules/pull-out'
import stockTransferRoutes from './modules/stock-transfer'
import invoicePicklistRoutes from './modules/invoice-picklist'
import skuRequestRoutes from './modules/sku-request'
import specialStockIssuanceRoutes from './modules/special-stock-issuance'
import onsitePreparationRoutes from './modules/onsite-preparation'
import inventoryAdjustmentsRoutes from './modules/inventory-adjustments'
import reportsRoutes from './modules/reports'


const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...warehouseSetupRoutes,
  ...stockMonitoringRoutes,
  ...inboundRoutes,
  ...branchFulfillmentRoutes,
  ...pullOutRoutes,
  ...stockTransferRoutes,
  ...invoicePicklistRoutes,
  ...skuRequestRoutes,
  ...specialStockIssuanceRoutes,
  ...onsitePreparationRoutes,
  ...inventoryAdjustmentsRoutes,
  ...reportsRoutes,

]

export const router = createRouter({
  history: createWebHistory('/vuejs/template/'),
  linkActiveClass: 'active',
  routes,
})

router.beforeEach((to, from, next) => {
  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  // Continue with the navigation
  next()
})
