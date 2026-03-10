/**
 * Onsite Preparation Routes
 */
import { RouterView } from 'vue-router'
import OnsiteEventPreparation from '@/views/pages/onsite-preparation/onsite-event-preparation.vue'
import StockAllocation from '@/views/pages/onsite-preparation/stock-allocation.vue'
import EventSalesReturn from '@/views/pages/onsite-preparation/event-sales-return.vue'

export default [
    {
        path: '/onsite-preparation',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'onsite-event-preparation'
            },
            {
                path: 'onsite-event-preparation',
                name: 'onsite-event-preparation',
                component: OnsiteEventPreparation
            },
            {
                path: 'stock-allocation',
                name: 'stock-allocation',
                component: StockAllocation
            },
            {
                path: 'event-sales-return',
                name: 'event-sales-return',
                component: EventSalesReturn
            },
        ]
    }
]
