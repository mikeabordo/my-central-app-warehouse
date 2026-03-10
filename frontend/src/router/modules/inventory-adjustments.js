/**
 * Inventory Adjustments Routes
 */
import { RouterView } from 'vue-router'
import AdjustmentRequest from '@/views/pages/inventory-adjustments/adjustment-request.vue'
import ApprovedAdjustments from '@/views/pages/inventory-adjustments/approved-adjustments.vue'

export default [
    {
        path: '/inventory-adjustments',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'adjustment-request'
            },
            {
                path: 'adjustment-request',
                name: 'adjustment-request',
                component: AdjustmentRequest
            },
            {
                path: 'approved-adjustments',
                name: 'approved-adjustments',
                component: ApprovedAdjustments
            },
        ]
    }
]
