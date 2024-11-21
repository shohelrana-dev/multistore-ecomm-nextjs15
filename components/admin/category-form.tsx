'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useConfirmAlert } from 'react-use-confirm-alert'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { InputGroup } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SubmitButton } from '@/components/ui/submit-button'
import { Billboard, Category } from '@/db/schema'
import { useCreateCategory } from '@/hooks/categories/use-create-category'
import { useDeleteCategory } from '@/hooks/categories/use-delete-category'
import { useUpdateCategory } from '@/hooks/categories/use-update-category'
import { CategoryFromValues, categorySchema } from '@/lib/zod'

interface Props {
    initialData: Category | null
    billboards: Billboard[]
}

export function CategoryForm({ initialData, billboards }: Props) {
    const params = useParams<{ storeId: string; categoryId: string }>()
    const form = useForm<CategoryFromValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: initialData?.name ?? '',
            billboardId: initialData?.billboardId.toString() ?? '',
        },
        mode: 'all',
    })
    const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()
    const { mutateAsync: deleteCategory } = useDeleteCategory()
    const confirmDelete = useConfirmAlert()

    function processForm(values: CategoryFromValues) {
        if (initialData) {
            updateCategory({
                json: values,
                param: { categoryId: initialData.id.toString(), storeId: params.storeId },
            })
        } else {
            createCategory({ json: values, param: { storeId: params.storeId } })
        }
    }

    function handleDeleteCategory() {
        if (!initialData) return

        confirmDelete({
            title: 'Delete category',
            message: 'Are you sure you want to delete this category? This action cannot be undone.',
            onConfirm: async () => {
                await deleteCategory({ param: { categoryId: initialData.id.toString() } })
            },
        })
    }

    const title = initialData ? 'Edit category' : 'Create category'
    const description = initialData ? 'Edit category: ' + initialData.name : 'Add a new category'
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
                        onClick={handleDeleteCategory}
                    >
                        <Trash className='h-4 w-4' />
                    </SubmitButton>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <InputGroup label='Name' placeholder='Category name' name='name' form={form} />
                    </div>
                    <div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
                        <FormField
                            control={form.control}
                            name='billboardId'
                            render={({ field }) => (
                                <FormItem className='py-1'>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl className='!mt-1'>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder='Select a billboard'
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id.toString()}
                                                >
                                                    {billboard.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className='!mt-1 text-[12px]' />
                                </FormItem>
                            )}
                        />
                    </div>
                    <SubmitButton isSubmitting={isUpdating || isCreating}>{action}</SubmitButton>
                </form>
            </Form>
        </>
    )
}
