/**
 * Warehouse Setup Routes
 */
import { RouterView } from 'vue-router'
import WarehouseList from '@/views/pages/warehouse-setup/warehouse-list.vue'
import WarehouseMapping from '@/views/pages/warehouse-setup/warehouse-mapping.vue'

export default [
    {
        path: '/warehouse-setup',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'warehouse-list'
            },
            {
                path: 'warehouse-list',
                name: 'warehouse-list',
                component: WarehouseList
            },
            {
                path: 'warehouse-mapping',
                name: 'warehouse-mapping',
                component: WarehouseMapping
            },
        ]
    }
]
