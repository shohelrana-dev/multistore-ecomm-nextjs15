'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useConfirmAlert } from 'react-use-confirm-alert'
import slugify from 'slugify'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Heading } from '@/components/ui/heading'
import { ImageUpload } from '@/components/ui/image-upload'
import { InputGroup } from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { SubmitButton } from '@/components/ui/submit-button'
import { Category, Color, Product, Size } from '@/db/schema'
import { useCreateProduct } from '@/hooks/products/use-create-product'
import { useDeleteProduct } from '@/hooks/products/use-delete-product'
import { useUpdateProduct } from '@/hooks/products/use-update-product'
import { ProductFromValues, productSchema } from '@/lib/zod'
import { CheckboxGroup } from '../ui/checkbox-group'
import { SelectGroup } from '../ui/select-group'
import { TextareaGroup } from '../ui/textarea-group'

interface Props {
    initialData: Product
    categories: Category[]
    sizes: Size[]
    colors: Color[]
}

export function ProductForm(props: Props) {
    const { initialData, categories, sizes, colors } = props
    const params = useParams<{ storeId: string; productId: string }>()
    const form = useForm<ProductFromValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ?? {
            storeId: params.storeId,
            name: '',
            description: '',
            shortDescription: '',
            price: 0,
            discountPrice: 0,
            thumbnail: '',
            images: [],
            stock: 0,
            slug: '',
            status: 'out_of_stock',
            featured: false,
            archived: false,
        },
    })
    const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
    const { mutateAsync: deleteProduct } = useDeleteProduct()
    const confirmDelete = useConfirmAlert()

    function processForm(values: ProductFromValues) {
        if (initialData) {
            updateProduct({
                json: values,
                param: { productId: initialData.id.toString() },
            })
        } else {
            createProduct({ json: values })
        }
    }

    function handleDeleteProduct() {
        if (!initialData) return

        confirmDelete({
            title: 'Delete product',
            message: 'Are you sure you want to delete this product? This action cannot be undone.',
            onConfirm: async () => {
                await deleteProduct({ param: { productId: initialData.id.toString() } })
            },
        })
    }

    const title = initialData ? 'Edit product' : 'Create product'
    const description = initialData ? 'Edit product: ' + initialData.name : 'Add a new product'
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
                        onClick={handleDeleteProduct}
                    >
                        <Trash className='h-4 w-4' />
                    </SubmitButton>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processForm)} className='space-y-8 w-full'>
                    <div className='grid grid-cols-1 lg:grid-cols-4 lg:gap-8'>
                        <div className='col-span-1 lg:col-span-2'>
                            <FormField
                                control={form.control}
                                name='thumbnail'
                                render={({ field }) => (
                                    <FormItem className='py-1'>
                                        <FormLabel>Thumbnail</FormLabel>
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
                        </div>
                        <div className='col-span-1 lg:col-span-2'>
                            <FormField
                                control={form.control}
                                name='images'
                                render={({ field }) => (
                                    <FormItem className='py-1'>
                                        <FormLabel>Images</FormLabel>
                                        <FormControl className='!mt-1'>
                                            <ImageUpload
                                                value={field.value?.map((image) => image.url) ?? []}
                                                disabled={isUpdating}
                                                onChange={(url) => {
                                                    form.setValue('images', [
                                                        ...form.getValues('images')!,
                                                        { url },
                                                    ])
                                                }}
                                                onRemove={(url) => {
                                                    form.setValue('images', [
                                                        ...form
                                                            .getValues('images')!
                                                            .filter((current) => current.url !== url),
                                                    ])
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className='!mt-1 text-[12px]' />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <InputGroup
                            label='Name'
                            placeholder='Enter product name'
                            name='name'
                            form={form}
                            onChange={(e) => {
                                form.setValue('name', e.target.value)
                                form.setValue('slug', slugify(e.target.value, { lower: true }))
                            }}
                        />
                        <InputGroup
                            label='Slug'
                            placeholder='Enter product slug'
                            name='slug'
                            form={form}
                        />
                        <InputGroup
                            label='Price'
                            placeholder='Enter price'
                            name='price'
                            type='number'
                            form={form}
                        />
                        <InputGroup
                            label='Discount Price'
                            placeholder='Enter discount price'
                            name='discountPrice'
                            type='number'
                            form={form}
                        />
                        <InputGroup
                            label='Stock'
                            placeholder='Enter product stock'
                            name='stock'
                            type='number'
                            form={form}
                        />
                        <SelectGroup
                            name='categoryId'
                            form={form}
                            label='Category'
                            placeholder='Select category'
                            items={categories.map((category) => ({
                                name: category.name,
                                value: category.id.toString(),
                            }))}
                        />
                        <SelectGroup
                            name='sizeId'
                            form={form}
                            label='Size'
                            placeholder='Select size'
                            items={sizes.map((item) => ({
                                name: item.name,
                                value: item.id.toString(),
                            }))}
                        />
                        <SelectGroup
                            name='colorId'
                            form={form}
                            label='Color'
                            placeholder='Select color'
                            items={colors.map((item) => ({
                                name: item.name,
                                value: item.id.toString(),
                            }))}
                        />
                        <SelectGroup
                            name='status'
                            form={form}
                            label='Status'
                            placeholder='Select status'
                            items={[
                                { name: 'In stock', value: 'in_stock' },
                                { name: 'Out of stock', value: 'out_of_stock' },
                                { name: 'Preorder', value: 'preorder' },
                            ]}
                        />
                        <CheckboxGroup
                            name='featured'
                            form={form}
                            label='Featured'
                            description='This product will appear on the home page.'
                        />
                        <CheckboxGroup
                            name='archived'
                            form={form}
                            label='Archived'
                            description='This product will not appear anywhere in the store.'
                        />
                        <div className='col-span-1 lg:col-span-2'>
                            <TextareaGroup
                                label='Short Description'
                                placeholder='Enter product short description'
                                name='shortDescription'
                                form={form}
                                rows={5}
                            />
                        </div>
                        <div className='col-span-1 lg:col-span-4'>
                            <TextareaGroup
                                label='Description'
                                placeholder='Enter product description'
                                name='description'
                                form={form}
                                rows={6}
                            />
                        </div>
                    </div>
                    <SubmitButton isSubmitting={isUpdating || isCreating}>{action}</SubmitButton>
                </form>
            </Form>
        </>
    )
}
