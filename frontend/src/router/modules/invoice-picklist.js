/**
 * Invoice Picklist Routes
 */
import { RouterView } from 'vue-router'
import PendingInvoicePicklist from '@/views/pages/invoice-picklist/pending-invoice-picklist.vue'
import PickedOrders from '@/views/pages/invoice-picklist/picked-orders.vue'
import ReleasedOrders from '@/views/pages/invoice-picklist/released-orders.vue'

export default [
    {
        path: '/invoice-picklist',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'pending-invoice-picklist'
            },
            {
                path: 'pending-invoice-picklist',
                name: 'pending-invoice-picklist',
                component: PendingInvoicePicklist
            },
            {
                path: 'picked-orders',
                name: 'picked-orders',
                component: PickedOrders
            },
            {
                path: 'released-orders',
                name: 'released-orders',
                component: ReleasedOrders
            },
        ]
    }
]
