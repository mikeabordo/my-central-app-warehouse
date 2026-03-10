/**
 * Inbound Routes
 */
import { RouterView } from 'vue-router'
import ProductionDelivery from '@/views/pages/inbound/production-delivery.vue'
import ReceivingLog from '@/views/pages/inbound/receiving-log.vue'

export default [
    {
        path: '/inbound',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'production-delivery'
            },
            {
                path: 'production-delivery',
                name: 'production-delivery',
                component: ProductionDelivery
            },
            {
                path: 'receiving-log',
                name: 'receiving-log',
                component: ReceivingLog
            },
        ]
    }
]
