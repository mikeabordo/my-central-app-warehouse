/**
 * Stock Monitoring Routes
 */
import { RouterView } from 'vue-router'
import ItemList from '@/views/pages/stock-monitoring/item-list.vue'
import ViewItemList from '@/components/form-path/view-item-list.vue'
import ViewItemPricing from '@/components/form-path/view-item-pricing.vue'
import ItemPricing from '@/views/pages/stock-monitoring/item-pricing.vue'
import ItemLocationMapping from '@/views/pages/stock-monitoring/item-location-mapping.vue'
import StockByLocation from '@/views/pages/stock-monitoring/stock-by-location.vue'
import StockLedger from '@/views/pages/stock-monitoring/stock-ledger.vue'
import StockReservation from '@/views/pages/stock-monitoring/stock-reservation.vue'

export default [
    {
        path: '/stock-monitoring',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'item-list'
            },
            {
                path: 'item-list',
                name: 'item-list',
                component: ItemList
            },
            {
                path: 'item-list/view/:id',
                name: 'view-item-list',
                component: ViewItemList
            },
            {
                path: 'item-pricing',
                name: 'item-pricing',
                component: ItemPricing
            },
            {
                path: 'item-pricing/view/:id',
                name: 'view-item-pricing',
                component: ViewItemPricing
            },
            {
                path: 'item-location-mapping',
                name: 'item-location-mapping',
                component: ItemLocationMapping
            },
            {
                path: 'stock-by-location',
                name: 'stock-by-location',
                component: StockByLocation
            },
            {
                path: 'stock-ledger',
                name: 'stock-ledger',
                component: StockLedger
            },
            {
                path: 'stock-reservation',
                name: 'stock-reservation',
                component: StockReservation
            },
        ]
    }
]
