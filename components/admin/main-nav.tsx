'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export function MainNav({ className }: { className?: string }) {
    const pathname = usePathname()
    const params = useParams()

    const routes = [
        {
            href: `/store-dashboard/${params.storeId}`,
            label: 'Overview',
            active: pathname === `/store-dashboard/${params.storeId}`,
        },
        {
            href: `/store-dashboard/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathname === `/store-dashboard/${params.storeId}/billboards`,
        },
        {
            href: `/store-dashboard/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname === `/store-dashboard/${params.storeId}/categories`,
        },
        {
            href: `/store-dashboard/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathname === `/store-dashboard/${params.storeId}/sizes`,
        },
        {
            href: `/store-dashboard/${params.storeId}/colors`,
            label: 'Colors',
            active: pathname === `/store-dashboard/${params.storeId}/colors`,
        },
        {
            href: `/store-dashboard/${params.storeId}/products`,
            label: 'Products',
            active: pathname === `/store-dashboard/${params.storeId}/products`,
        },
        {
            href: `/store-dashboard/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname === `/store-dashboard/${params.storeId}/settings`,
        },
    ]
    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}
