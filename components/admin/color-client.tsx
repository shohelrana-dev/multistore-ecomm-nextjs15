'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { ColorCellAction } from '@/components/admin/color-cell-action'
import ApiList from '@/components/ui/api-list'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export type ColorColumn = { id: number; name: string; value: string; createdAt: string }

export const columns: ColumnDef<ColorColumn>[] = [
    { accessorKey: 'name', header: 'Name' },
    {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) => (
            <div className='flex items-center gap-x-2'>
                {row.original.value}{' '}
                <div
                    className='h-5 w-5 rounded-full'
                    style={{ backgroundColor: row.original.value }}
                ></div>
            </div>
        ),
    },
    { accessorKey: 'createdAt', header: 'Date' },
    { header: 'Action', id: 'actions', cell: ({ row }) => <ColorCellAction data={row.original} /> },
]

interface Props {
    data: ColorColumn[]
}

export function ColorClient({ data }: Props) {
    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading title={`Colors (${data.length})`} description='Manage your store colors' />
                <Button onClick={() => router.push(`/store-dashboard/${params.storeId}/colors/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey='name' />
            <Separator />
            <Heading title='API' description='API calls for Colors' />
            <Separator />
            <ApiList entityName='colors' entityIdName='colorId' />
        </>
    )
}
