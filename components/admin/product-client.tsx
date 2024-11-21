'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { ProductCellAction } from '@/components/admin/product-cell-action'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export type ProductColumn = {
    id: number
    name: string
    price: string
    thumbnail: string
    stock: number
    slug: string
    featured: boolean
    archived: boolean
    status: 'in_stock' | 'out_of_stock' | 'preorder'
    createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'price', header: 'Price' },
    {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: ({ row }) => (
            <Image
                src={row.original.thumbnail}
                width={120}
                height={120}
                alt={row.original.name}
                className='rounded-md w-[120px]'
            />
        ),
    },
    { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'featured', header: 'Featured' },
    { accessorKey: 'archived', header: 'Archived' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'createdAt', header: 'Date' },
    { header: 'Action', id: 'actions', cell: ({ row }) => <ProductCellAction data={row.original} /> },
]

interface Props {
    data: ProductColumn[]
}

export function ProductClient({ data }: Props) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Products (${data.length})`} description='Manage your store products' />
                <Button onClick={() => router.push(`/store-dashboard/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Separator />
            <Heading title='API' description='API calls for Products' />
            <Separator />
            <ApiList entityName='products' entityIdName='productId' />
        </>
    )
}
