/**
 * Stock Transfer Routes
 */
import { RouterView } from 'vue-router'
import PendingTransfer from '@/views/pages/stock-transfer/pending-transfer.vue'
import CompletedTransfer from '@/views/pages/stock-transfer/completed-transfer.vue'
import CancelledTransfer from '@/views/pages/stock-transfer/cancelled-transfer.vue'
import AddNewTransfer from '@/components/form-path/add-new-transfer.vue'

import ViewPendingTransfer from '@/components/form-path/view-pending-transfer.vue'
import EditPendingTransfer from '@/components/form-path/edit-pending-transfer.vue'

export default [
    {
        path: '/stock-transfer',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'pending-transfer'
            },
            {
                path: 'add-new-transfer',
                name: 'add-new-transfer',
                component: AddNewTransfer
            },
            {
                path: 'pending-transfer',
                name: 'pending-transfer',
                component: PendingTransfer
            },
            {
                path: 'view/:id',
                name: 'view-pending-transfer',
                component: ViewPendingTransfer
            },
            {
                path: 'edit/:id',
                name: 'edit-pending-transfer',
                component: EditPendingTransfer
            },
            {
                path: 'completed-transfer',
                name: 'completed-transfer',
                component: CompletedTransfer
            },
            {
                path: 'cancelled-transfer',
                name: 'cancelled-transfer',
                component: CancelledTransfer
            },
        ]
    }
]
