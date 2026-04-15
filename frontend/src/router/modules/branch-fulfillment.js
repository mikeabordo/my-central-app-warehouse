/**
 * Branch Fulfillment Routes
 */
import { RouterView } from 'vue-router'
import OrderList from '@/views/pages/branch-fulfillment/order-list.vue'
import InTransit from '@/views/pages/branch-fulfillment/in-transit.vue'
import Delivered from '@/views/pages/branch-fulfillment/delivered.vue'

import ViewOrderList from '@/components/form-path/view-order-list.vue'
import FulfillOrder from '@/components/form-path/fulfill-order.vue'

export default [
    {
        path: '/branch-fulfillment',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'order-list'
            },
            {
                path: 'order-list',
                name: 'order-list',
                component: OrderList
            },
            {
                // Keep the URL consistent with other modules (e.g. stock-transfer/view/:id).
                path: 'view/:id',
                name: 'view-order-list',
                component: ViewOrderList,
                props: route => ({
                    id: route.params.id,
                    backPath: route.query.backPath || '/branch-fulfillment/order-list',
                    backLabel: route.query.backLabel || 'Order List'
                })
            },
            {
                path: 'fulfill/:id',
                name: 'fulfill-order',
                component: FulfillOrder,
                props: route => ({
                    id: route.params.id,
                    backPath: route.query.backPath || '/branch-fulfillment/order-list',
                    backLabel: route.query.backLabel || 'Order List'
                })
            },
            {
                path: 'in-transit',
                name: 'in-transit',
                component: InTransit
            },
            {
                path: 'delivered',
                name: 'delivered',
                component: Delivered
            },
        ]
    }
]
