'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useConfirmAlert } from 'react-use-confirm-alert'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { ImageUpload } from '@/components/ui/image-upload'
import { InputGroup } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SubmitButton } from '@/components/ui/submit-button'
import { Billboard } from '@/db/schema'
import { useCreateBillboard } from '@/hooks/billboards/use-create-billboard'
import { useDeleteBillboard } from '@/hooks/billboards/use-delete-billboard'
import { useUpdateBillboard } from '@/hooks/billboards/use-update-billboard'
import { BillboardFromValues, billboardSchema } from '@/lib/zod'

interface Props {
    initialData: Billboard | null
}

export function BillboardForm({ initialData }: Props) {
    const params = useParams<{ storeId: string; billboardId: string }>()
    const form = useForm<BillboardFromValues>({
        resolver: zodResolver(billboardSchema),
        defaultValues: initialData ?? { title: '', image: '' },
    })
    const { mutate: createBillboard, isPending: isCreating } = useCreateBillboard()
    const { mutate: updateBillboard, isPending: isUpdating } = useUpdateBillboard()
    const { mutateAsync: deleteBillboard } = useDeleteBillboard()
    const confirmDelete = useConfirmAlert()

    function processForm(values: BillboardFromValues) {
        if (initialData) {
            updateBillboard({
                json: values,
                param: { billboardId: initialData.id.toString(), storeId: params.storeId },
            })
        } else {
            createBillboard({ json: values, param: { storeId: params.storeId } })
        }
    }

    function handleDeleteBillboard() {
        if (!initialData) return

        confirmDelete({
            title: 'Delete billboard',
            message: 'Are you sure you want to delete this billboard? This action cannot be undone.',
            onConfirm: async () => {
                await deleteBillboard({ param: { billboardId: initialData.id.toString() } })
            },
        })
    }

    const title = initialData ? 'Edit billboard' : 'Create billboard'
    const description = initialData ? 'Edit billboard: ' + initialData.title : 'Add a new billboard'
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
                        onClick={handleDeleteBillboard}
                    >
                        <Trash className='h-4 w-4' />
                    </SubmitButton>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <FormField
                        control={form.control}
                        name={'image'}
                        render={({ field }) => (
                            <FormItem className='py-1'>
                                <FormLabel>Image</FormLabel>
                                <FormControl className='!mt-1'>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={isUpdating}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage className='!mt-1 text-[12px]' />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup
                            label='Title'
                            placeholder='Billboard title'
                            name='title'
                            form={form}
                        />
                    </div>
                    <SubmitButton isSubmitting={isUpdating || isCreating}>{action}</SubmitButton>
                </form>
            </Form>
        </>
    )
}
