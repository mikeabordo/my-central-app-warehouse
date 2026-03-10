/**
 * Authentication Routes
 * Login, register, forgot/reset password, verification, lock screen
 */
import SignIn from '@/views/pages/pages/authentication/login/sign-in.vue'
import SignIn_2 from '@/views/pages/pages/authentication/login/signin-2.vue'
import SignIn_3 from '@/views/pages/pages/authentication/login/signin-3.vue'
import Email_Verification from '@/views/pages/pages/authentication/email-verification/email-verification.vue'
import Email_Verification_2 from '@/views/pages/pages/authentication/email-verification/email-verification-2.vue'
import Email_Verification_3 from '@/views/pages/pages/authentication/email-verification/email-verification-3.vue'
import Two_Step_Verification from '@/views/pages/pages/authentication/two-step-verification/two-step-verification.vue'
import Two_Step_Verification_2 from '@/views/pages/pages/authentication/two-step-verification/two-step-verification-2.vue'
import Two_Step_Verification_3 from '@/views/pages/pages/authentication/two-step-verification/two-step-verification-3.vue'
import Forgot_Password from '@/views/pages/pages/authentication/forgot-password/forgot-password.vue'
import Forgot_Password_2 from '@/views/pages/pages/authentication/forgot-password/forgot-password-2.vue'
import Forgot_Password_3 from '@/views/pages/pages/authentication/forgot-password/forgot-password-3.vue'
import Reset_Password from '@/views/pages/pages/authentication/reset-password/reset-password.vue'
import Reset_Password_2 from '@/views/pages/pages/authentication/reset-password/reset-password-2.vue'
import Reset_Password_3 from '@/views/pages/pages/authentication/reset-password/reset-password-3.vue'
import Lock_Screen from '@/views/pages/pages/authentication/lock-screen.vue'
import Register from '@/views/pages/pages/authentication/register/pos-register.vue'
import Register_2 from '@/views/pages/pages/authentication/register/register-2.vue'
import Register_3 from '@/views/pages/pages/authentication/register/register-3.vue'
import Pages from '@/views/pages/pages/pos-pages.vue'

export default [
    {
        path: '/',
        name: 'sign-in',
        component: SignIn
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: Forgot_Password
    },
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
        path: '/authentication',
        component: Pages,
        children: [
            { path: '', redirect: '/authentication/signin-2' },
            { path: "signin-2", component: SignIn_2 },
            { path: "signin-3", component: SignIn_3 },
            { path: "register-2", component: Register_2 },
            { path: "register-3", component: Register_3 },
            { path: "forgot-password-2", component: Forgot_Password_2 },
            { path: "forgot-password-3", component: Forgot_Password_3 },
            { path: "reset-password-2", component: Reset_Password_2 },
            { path: "reset-password-3", component: Reset_Password_3 },
            { path: "email-verification-2", component: Email_Verification_2 },
            { path: "email-verification-3", component: Email_Verification_3 },
            { path: "two-step-verification-2", component: Two_Step_Verification_2 },
            { path: "two-step-verification-3", component: Two_Step_Verification_3 },
            { path: "lock-screen", component: Lock_Screen },
        ]
    },
]
