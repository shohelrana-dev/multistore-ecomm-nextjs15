'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useConfirmAlert } from 'react-use-confirm-alert'

import { Form } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { InputGroup } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SubmitButton } from '@/components/ui/submit-button'
import { Size } from '@/db/schema'
import { useCreateSize } from '@/hooks/sizes/use-create-size'
import { useDeleteSize } from '@/hooks/sizes/use-delete-size'
import { useUpdateSize } from '@/hooks/sizes/use-update-size'
import { SizeFromValues, sizeSchema } from '@/lib/zod'

interface Props {
    initialData: Size | null
}

export function SizeForm({ initialData }: Props) {
    const params = useParams<{ storeId: string; sizeId: string }>()
    const form = useForm<SizeFromValues>({
        resolver: zodResolver(sizeSchema),
        defaultValues: initialData ?? { name: '', value: '' },
    })
    const { mutate: createSize, isPending: isCreating } = useCreateSize()
    const { mutate: updateSize, isPending: isUpdating } = useUpdateSize()
    const { mutateAsync: deleteSize } = useDeleteSize()
    const confirmDelete = useConfirmAlert()

    function processForm(values: SizeFromValues) {
        if (initialData) {
            updateSize({
                json: values,
                param: { sizeId: initialData.id.toString(), storeId: params.storeId },
            })
        } else {
            createSize({ json: values, param: { storeId: params.storeId } })
        }
    }

    function handleDeleteSize() {
        if (!initialData) return

        confirmDelete({
            title: 'Delete size',
            message: 'Are you sure you want to delete this size? This action cannot be undone.',
            onConfirm: async () => {
                await deleteSize({ param: { sizeId: initialData.id.toString() } })
            },
        })
    }

    const title = initialData ? 'Edit size' : 'Create size'
    const description = initialData ? 'Edit size: ' + initialData.name : 'Add a new size'
    const action = initialData ? 'Save changes' : 'Create'

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData && (
                    <SubmitButton
                        type='button'
                        variant={'destructive'}
                        size={'icon'}
                        onClick={handleDeleteSize}
                    >
                        <Trash className='h-4 w-4' />
                    </SubmitButton>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup label='Name' placeholder='Size name' name='name' form={form} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup label='Value' placeholder='Size value' name='value' form={form} />
                    </div>
                    <SubmitButton isSubmitting={isUpdating || isCreating}>{action}</SubmitButton>
                </form>
            </Form>
        </>
    )
}
