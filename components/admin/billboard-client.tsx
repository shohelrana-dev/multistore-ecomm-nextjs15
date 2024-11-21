'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { BillbaordCellAction } from '@/components/admin/billboard-cell-action'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export type BillboardColumn = { id: number; title: string; createdAt: string }

export const columns: ColumnDef<BillboardColumn>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'createdAt', header: 'Date' },
    { header: 'Action', id: 'actions', cell: ({ row }) => <BillbaordCellAction data={row.original} /> },
]

interface Props {
    data: BillboardColumn[]
}

export function BillboardClient({ data }: Props) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading
                    title={`Billboards (${data.length})`}
                    description='Manage your store billboards'
                />
                <Button onClick={() => router.push(`/store-dashboard/${params.storeId}/billboards/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='title' />
            <Separator />
            <Heading title='API' description='API calls for Billboards' />
            <Separator />
            <ApiList entityName='billboards' entityIdName='billboardId' />
        </>
    )
}
