/**
 * Stock Transfer Routes
 */
import { RouterView } from 'vue-router'
import NewTransfer from '@/views/pages/stock-transfer/new-transfer.vue'
import PendingTransfer from '@/views/pages/stock-transfer/pending-transfer.vue'
import CompletedTransfer from '@/views/pages/stock-transfer/completed-transfer.vue'

export default [
    {
        path: '/stock-transfer',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'new-transfer'
            },
            {
                path: 'new-transfer',
                name: 'new-transfer',
                component: NewTransfer
            },
            {
                path: 'pending-transfer',
                name: 'pending-transfer',
                component: PendingTransfer
            },
            {
                path: 'completed-transfer',
                name: 'completed-transfer',
                component: CompletedTransfer
            },
        ]
    }
]
