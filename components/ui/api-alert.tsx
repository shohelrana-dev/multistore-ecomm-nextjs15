'use client'

import { Copy, Server } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
    title: string
    description: string
    variant: 'public' | 'admin'
}

const textMap: Record<Props['variant'], string> = {
    public: 'Public',
    admin: 'Admin',
}

const variantMap: Record<Props['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive',
}

export function ApiAlert({ title, description, variant = 'public' }: Props) {
    function handleCopy() {
        navigator.clipboard.writeText(description)
        toast.success('API route copied to clipboard.')
    }

    return (
        <Alert>
            <Server className='h-4 w-4' />
            <AlertTitle className='flex items-center gap-x-2'>
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
            <AlertDescription className='mt-4 flex items-center justify-between'>
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm'>
                    {description}
                </code>
                <Button variant='outline' size='icon' onClick={handleCopy}>
                    <Copy className='h-4 w-4' />
                </Button>
            </AlertDescription>
        </Alert>
    )
}
