/**
 * Special Stock Issuance Routes
 */
import { RouterView } from 'vue-router'
import NewRequestIssuance from '@/views/pages/special-stock-issuance/new-request-issuance.vue'
import ConsignmentIssuance from '@/views/pages/special-stock-issuance/consignment-issuance.vue'
import ComplimentaryRequest from '@/views/pages/special-stock-issuance/complimentary-request.vue'
import ExaminationIssuance from '@/views/pages/special-stock-issuance/examination-issuance.vue'
import IssuanceHistory from '@/views/pages/special-stock-issuance/issuance-history.vue'

export default [
    {
        path: '/special-stock-issuance',
        component: RouterView,
        children: [
            {
                path: '',
                redirect: 'new-request-issuance'
            },
            {
                path: 'new-request-issuance',
                name: 'new-request-issuance',
                component: NewRequestIssuance
            },
            {
                path: 'consignment-issuance',
                name: 'consignment-issuance',
                component: ConsignmentIssuance
            },
            {
                path: 'complimentary-request',
                name: 'complimentary-request',
                component: ComplimentaryRequest
            },
            {
                path: 'examination-issuance',
                name: 'examination-issuance',
                component: ExaminationIssuance
            },
            {
                path: 'issuance-history',
                name: 'issuance-history',
                component: IssuanceHistory
            },
        ]
    }
]
