/**
 * SKU Request Routes
 */
import { RouterView } from 'vue-router'
import NewSkuRequest from '@/views/pages/sku-request/new-sku-request.vue'
import FulfilledSkuRequest from '@/views/pages/sku-request/fulfilled-sku-request.vue'

export default [
    {
        path: '/sku-request',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'new-sku-request'
            },
            {
                path: 'new-sku-request',
                name: 'new-sku-request',
                component: NewSkuRequest
            },
            {
                path: 'fulfilled-sku-request',
                name: 'fulfilled-sku-request',
                component: FulfilledSkuRequest
            },
        ]
    }
]
