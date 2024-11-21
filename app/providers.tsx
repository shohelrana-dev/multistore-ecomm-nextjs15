'use client'
import ModalsContainer from '@/components/modals/modals-container'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfirmAlertProvider } from 'react-use-confirm-alert'
import { Toaster } from 'sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } })

    return (
        <QueryClientProvider client={queryClient}>
            <ConfirmAlertProvider>
                {children}
                <ModalsContainer />
                <Toaster position='top-right' richColors />
            </ConfirmAlertProvider>
        </QueryClientProvider>
    )
}
