'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { SizeCellAction } from '@/components/admin/size-cell-action'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export type SizeColumn = { id: number; name: string; value: string; createdAt: string }

export const columns: ColumnDef<SizeColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'value', header: 'Value' },
    { accessorKey: 'createdAt', header: 'Date' },
    { header: 'Action', id: 'actions', cell: ({ row }) => <SizeCellAction data={row.original} /> },
]

interface Props {
    data: SizeColumn[]
}

export function SizeClient({ data }: Props) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Sizes (${data.length})`} description='Manage your store sizes' />
                <Button onClick={() => router.push(`/store-dashboard/${params.storeId}/sizes/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Separator />
            <Heading title='API' description='API calls for Sizes' />
            <Separator />
            <ApiList entityName='sizes' entityIdName='sizeId' />
        </>
    )
}
