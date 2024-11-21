import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useConfirmAlert } from 'react-use-confirm-alert'
import { toast } from 'sonner'

import { ColorColumn } from '@/components/admin/color-client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteColor } from '@/hooks/colors/use-delete-color'

export function ColorCellAction({ data }: { data: ColorColumn }) {
    const router = useRouter()
    const params = useParams()
    const { mutateAsync } = useDeleteColor()
    const confirmAlert = useConfirmAlert()

    function handleCopy() {
        navigator.clipboard.writeText(data.id.toString())
        toast.success('Color ID copied to clipboard')
    }

    function handleDelete() {
        confirmAlert({
            title: 'Delete color',
            message: 'Are you sure you want to delete this color? This action cannot be undone.',
            onConfirm: () =>
                mutateAsync({
                    param: { storeId: String(params.storeId), colorId: data.id.toString() },
                }),
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={handleCopy}>
                    <Copy className='mr-2 h-4 w-4' />
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push(`/store-dashboard/${params.storeId}/colors/${data.id}`)}
                >
                    <Edit className='mr-2 h-4 w-4' />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                    <Trash className='mr-2 h-4 w-4' />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
