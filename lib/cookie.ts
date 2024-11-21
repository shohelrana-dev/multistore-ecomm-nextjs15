import cookie from 'cookiejs'

export function setAuthTokensOnCookie(tokens: { accessToken: string; refreshToken: string }) {
    cookie.set('__access_token', tokens.accessToken)
    cookie.set('__refresh_token', tokens.refreshToken)
}

export function clearAuthTokensFromCookie() {
    cookie.remove('__access_token')
    cookie.remove('__refresh_token')
}

export function getAuthTokensFromCookie() {
    return {
        accessToken: cookie.get('__access_token') || '',
        refreshToken: cookie.get('__refresh_token') || '',
    }
}
