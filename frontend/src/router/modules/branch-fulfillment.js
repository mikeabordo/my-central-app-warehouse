/**
 * Branch Fulfillment Routes
 */
import { RouterView } from 'vue-router'
import OrderList from '@/views/pages/branch-fulfillment/order-list.vue'
import InTransit from '@/views/pages/branch-fulfillment/in-transit.vue'
import Delivered from '@/views/pages/branch-fulfillment/delivered.vue'

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