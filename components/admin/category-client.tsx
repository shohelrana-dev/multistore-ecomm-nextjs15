'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { CategoryCellAction } from '@/components/admin/category-cell-action'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export type CategoryColumn = { id: number; name: string; billboardTitle: string; createdAt: string }

export const columns: ColumnDef<CategoryColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'billboard', header: 'Billboard', cell: ({ row }) => row.original.billboardTitle },
    { accessorKey: 'createdAt', header: 'Date' },
    { header: 'Action', id: 'actions', cell: ({ row }) => <CategoryCellAction data={row.original} /> },
]

interface Props {
    data: CategoryColumn[]
}

export function CategoryClient({ data }: Props) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Categories (${data.length})`}
                    description='Manage your store categories'
                />
                <Button onClick={() => router.push(`/store-dashboard/${params.storeId}/categories/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Separator />
            <Heading title='API' description='API calls for Categories' />
            <Separator />
            <ApiList entityName='categories' entityIdName='categoryId' />
        </>
    )
}
