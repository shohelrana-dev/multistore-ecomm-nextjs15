import { SITE_URL } from '@/app-config'
import { googleAuth } from '@hono/oauth-providers/google'
import { Hono } from 'hono'
import * as authController from './auth.controller'

const authRoute = new Hono()
    .use('/google', (c, next) => {
        return googleAuth({
            scope: ['openid', 'profile', 'email'],
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: SITE_URL + '/api/auth/google',
            state: encodeURIComponent(c.req.query('callback_url') || ''),
        })(c, next)
    })
    .post('/signup', ...authController.signup)
    .post('/login', ...authController.login)
    .get('/logout', ...authController.logout)
    .get('/google', ...authController.loginWithGoogle)
    .post('/tokens', ...authController.exchangeCode)
    .get('/user', ...authController.getAuthUser)
    .get('/refresh-token', ...authController.refreshAccessToken)
    .post('/verify-email', ...authController.verifyEmail)
    .post('/resend-verification-email', ...authController.resendVerificationEmail)

export default authRoute
