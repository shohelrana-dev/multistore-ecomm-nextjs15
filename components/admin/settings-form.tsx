'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useConfirmAlert } from 'react-use-confirm-alert'

import { ApiAlert } from '@/components/ui/api-alert'
import { Form } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { InputGroup } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SubmitButton } from '@/components/ui/submit-button'
import { Store } from '@/db/schema'
import { useDeleteStore } from '@/hooks/stores/use-delete-store'
import { useUpdateStore } from '@/hooks/stores/use-update-store'
import { useOrigin } from '@/hooks/use-origin'
import { StoreFromValues, storeSchema } from '@/lib/zod'

type Props = { initialData: Store }

export function SettingsForm({ initialData }: Props) {
    const form = useForm({
        mode: 'all',
        resolver: zodResolver(storeSchema),
        defaultValues: initialData,
    })
    const { mutate: updateStore, isPending: isUpdating } = useUpdateStore()
    const { mutateAsync: deleteStore } = useDeleteStore()
    const confirmDelete = useConfirmAlert()
    const origin = useOrigin()

    function processForm(values: StoreFromValues) {
        updateStore({ json: values, param: { storeId: initialData.id.toString() } })
    }

    function handleDeleteStore() {
        confirmDelete({
            title: 'Delete store',
            message: 'Are you sure you want to delete this store? This action cannot be undone.',
            onConfirm: async () => {
                await deleteStore({ param: { storeId: initialData.id.toString() } })
            },
        })
    }

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title='Settings' description='Manage your store preferences' />
                <SubmitButton
                    type='button'
                    variant={'destructive'}
                    size={'icon'}
                    onClick={handleDeleteStore}
                >
                    <Trash className='h-4 w-4' />
                </SubmitButton>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup label='Name' placeholder='Store name' name='name' form={form} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup
                            label='Location'
                            placeholder='Location'
                            name='location'
                            form={form}
                        />
                    </div>
                    <SubmitButton isSubmitting={isUpdating}>Save changes</SubmitButton>
                </form>
            </Form>
            <Separator />
            <ApiAlert
                title='GET'
                description={`${origin}/api/v1/stores/${initialData.id}`}
                variant='public'
            />
        </>
    )
}
