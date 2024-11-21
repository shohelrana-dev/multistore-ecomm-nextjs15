import { SizeForm } from '@/components/admin/size-form'
import { getSizeById } from '@/services/sizes.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sizeId } = await params
    const size = await getSizeById(parseInt(sizeId) || 0)

    if (size) {
        return {
            title: 'Edit size: ' + size.name,
        }
    } else {
        return {
            title: 'Add new size',
        }
    }
}

interface Props {
    params: Promise<{
        sizeId: string
    }>
}

export default async function SingleSizePage({ params }: Props) {
    const { sizeId } = await params

    const size = await getSizeById(parseInt(sizeId) || 0)

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}
