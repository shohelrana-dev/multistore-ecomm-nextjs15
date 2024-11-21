import { SITE_NAME } from '@/app-config'
import Providers from '@/app/providers'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['300', '400', '600', '700'],
})

export const metadata: Metadata = {
    title: {
        template: '%s | ' + SITE_NAME,
        absolute: SITE_NAME,
    },
    description: 'A fullstack ecommerce application built with Next.js 15 and TypeScript',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`${poppins.variable} antialiased`} suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
