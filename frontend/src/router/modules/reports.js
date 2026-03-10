/**
 * Reports Routes
 */
import { RouterView } from 'vue-router'
import StockByLocation from '@/views/pages/reports/stock-by-location.vue'
import MovementSummary from '@/views/pages/reports/movement-summary.vue'
import SkuRequestFulfillment from '@/views/pages/reports/sku-request-fulfillment.vue'
import ComplimentaryExamCopies from '@/views/pages/reports/complimentary-exam-copies.vue'
import OnsiteSalesReconciliation from '@/views/pages/reports/onsite-sales-reconciliation.vue'

export default [
    {
        path: '/reports',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'stock-by-location'
            },
            {
                path: 'stock-by-location',
                name: 'reports-stock-by-location',
                component: StockByLocation
            },
            {
                path: 'movement-summary',
                name: 'movement-summary',
                component: MovementSummary
            },
            {
                path: 'sku-request-fulfillment',
                name: 'sku-request-fulfillment',
                component: SkuRequestFulfillment
            },
            {
                path: 'complimentary-exam-copies',
                name: 'complimentary-exam-copies',
                component: ComplimentaryExamCopies
            },
            {
                path: 'onsite-sales-reconciliation',
                name: 'onsite-sales-reconciliation',
                component: OnsiteSalesReconciliation
            },
        ]
    }
]
