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
import { Color } from '@/db/schema'
import { useCreateColor } from '@/hooks/colors/use-create-color'
import { useDeleteColor } from '@/hooks/colors/use-delete-color'
import { useUpdateColor } from '@/hooks/colors/use-update-color'
import { ColorFromValues, colorSchema } from '@/lib/zod'

interface Props {
    initialData: Color | null
}

export function ColorForm({ initialData }: Props) {
    const params = useParams<{ storeId: string; colorId: string }>()
    const form = useForm<ColorFromValues>({
        resolver: zodResolver(colorSchema),
        defaultValues: initialData ?? { name: '', value: '' },
        mode: 'all',
    })
    const { mutate: createColor, isPending: isCreating } = useCreateColor()
    const { mutate: updateColor, isPending: isUpdating } = useUpdateColor()
    const { mutateAsync: deleteColor } = useDeleteColor()
    const confirmDelete = useConfirmAlert()

    function processForm(values: ColorFromValues) {
        if (initialData) {
            updateColor({
                json: values,
                param: { colorId: initialData.id.toString(), storeId: params.storeId },
            })
        } else {
            createColor({ json: values, param: { storeId: params.storeId } })
        }
    }

    function handleDeleteColor() {
        if (!initialData) return

        confirmDelete({
            title: 'Delete color',
            message: 'Are you sure you want to delete this color? This action cannot be undone.',
            onConfirm: async () => {
                await deleteColor({ param: { colorId: initialData.id.toString() } })
            },
        })
    }

    const title = initialData ? 'Edit color' : 'Create color'
    const description = initialData ? 'Edit color: ' + initialData.name : 'Add a new color'
    const action = initialData ? 'Save changes' : 'Create'

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={title} description={description} />
                {initialData && (
                    <SubmitButton
                        type='button'
                        variant={'destructive'}
                        color={'icon'}
                        onClick={handleDeleteColor}
                    >
                        <Trash className='h-4 w-4' />
                    </SubmitButton>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup label='Name' placeholder='Color name' name='name' form={form} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <div className='flex items-center gap-3'>
                            <InputGroup
                                label='Value'
                                placeholder='Color value'
                                name='value'
                                form={form}
                                className='basis-3/4'
                            />
                            <div
                                className='h-8 w-8 rounded-full border'
                                style={{ backgroundColor: form.getValues('value') }}
                            />
                        </div>
                    </div>
                    <SubmitButton isSubmitting={isUpdating || isCreating}>{action}</SubmitButton>
                </form>
            </Form>
        </>
    )
}
