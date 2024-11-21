import { BillboardForm } from '@/components/admin/billboard-form'
import { getBillboardById } from '@/services/billboards.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { billboardId } = await params
    const billboard = await getBillboardById(parseInt(billboardId) || 0)

    if (billboard) {
        return {
            title: 'Edit billboard: ' + billboard.title,
        }
    } else {
        return {
            title: 'Add new billboard',
        }
    }
}

interface Props {
    params: Promise<{
        billboardId: string
    }>
}

export default async function SingleBillboardPage({ params }: Props) {
    const { billboardId } = await params

    const billboard = await getBillboardById(parseInt(billboardId) || 0)

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    )
}
