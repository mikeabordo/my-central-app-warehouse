/**
 * Pull-Out Inventory Routes
 */
import { RouterView } from 'vue-router'
import PullOutRequest from '@/views/pages/pull-out/pull-out-request.vue'
import InboundPullOut from '@/views/pages/pull-out/inbound-pull-out.vue'
import CompletedPullOut from '@/views/pages/pull-out/completed-pull-out.vue'

export default [
    {
        path: '/pull-out',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'pull-out-request'
            },
            {
                path: 'pull-out-request',
                name: 'pull-out-request',
                component: PullOutRequest
            },
            {
                path: 'inbound-pull-out',
                name: 'inbound-pull-out',
                component: InboundPullOut
            },
            {
                path: 'completed-pull-out',
                name: 'completed-pull-out',
                component: CompletedPullOut
            },
        ]
    }
]
