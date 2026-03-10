/**
 * Dashboard Routes
 */
import { RouterView } from 'vue-router'
import AdminDashboard from '@/views/pages/dashboard/admin-dashboard.vue'

export default [
    {
        path: '/dashboard',
        component: RouterView,
        children: [
            { path: '', redirect: '/dashboard/admin-dashboard' },
            { path: "admin-dashboard", component: AdminDashboard },
        ]
    },
]
