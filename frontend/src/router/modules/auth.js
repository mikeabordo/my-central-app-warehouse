/**
 * Authentication Routes
 * Login, register, forgot/reset password, verification, lock screen
 */
import SignIn from '@/views/pages/authentication/login/sign-in.vue'
import Email_Verification from '@/views/pages/authentication/email-verification/email-verification.vue'
import Two_Step_Verification from '@/views/pages/authentication/two-step-verification/two-step-verification.vue'
import Forgot_Password from '@/views/pages/authentication/forgot-password/forgot-password.vue'
import Reset_Password from '@/views/pages/authentication/reset-password/reset-password.vue'
import Lock_Screen from '@/views/pages/authentication/lock-screen.vue'
import Register from '@/views/pages/authentication/register/pos-register.vue'

export default [
    {
        path: '/',
        redirect: '/sign-in'
    },
    {
        path: '/sign-in',
        name: 'sign-in',
        component: SignIn
    },
    // {
    //     path: '/register',
    //     name: 'register',
    //     component: Register
    // },
    // {
    //     path: '/forgot-password',
    //     name: 'forgot-password',
    //     component: Forgot_Password
    // },
    {
        path: '/reset-password',
        name: 'reset-password',
        component: Reset_Password
    },
    {
        path: '/email-verification',
        name: 'email-verification',
        component: Email_Verification
    },
    {
        path: '/two-step-verification',
        name: 'two-step-verification',
        component: Two_Step_Verification
    },
    {
        path: '/lock-screen',
        name: 'lock-screen',
        component: Lock_Screen
    }
]
