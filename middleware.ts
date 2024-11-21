import { NextRequest, NextResponse } from 'next/server'
import { AFTER_LOGIN_REDIRECT_URL, LOGIN_URL } from './app-config'
import { auth } from './lib/auth'
import { guestPathnames, publicPathnames } from './lib/pathnames'

export async function middleware(req: NextRequest) {
    const currentPath = req.nextUrl.pathname
    const { user } = await auth()

    // If the user is not authenticated and the path is not public, redirect to the login page
    if (!user && !guestPathnames.includes(currentPath) && !publicPathnames.includes(currentPath)) {
        return NextResponse.redirect(LOGIN_URL)
    }

    // If the user is authenticated and the path is guest only, redirect to the after login redirect URL
    if (user && guestPathnames.includes(currentPath)) {
        return NextResponse.redirect(AFTER_LOGIN_REDIRECT_URL)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
