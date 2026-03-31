/**
 * Warehouse Setup Routes
 */
import { RouterView } from 'vue-router'
import WarehouseList from '@/views/pages/warehouse-setup/warehouse-list.vue'
import WarehouseMapping from '@/views/pages/warehouse-setup/warehouse-mapping.vue'
import AddNewWarehouse from '@/components/form-path/add-new-warehouse.vue'

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
                path: 'add-new-warehouse',
                name: 'add-new-warehouse',
                component: AddNewWarehouse
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
