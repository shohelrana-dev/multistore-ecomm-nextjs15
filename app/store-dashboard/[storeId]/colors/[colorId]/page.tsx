import { ColorForm } from '@/components/admin/color-form'
import { getColorById } from '@/services/colors.service'
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { colorId } = await params
    const color = await getColorById(parseInt(colorId) || 0)

    if (color) {
        return {
            title: 'Edit color: ' + color.name,
        }
    } else {
        return {
            title: 'Add new color',
        }
    }
}

interface Props {
    params: Promise<{
        colorId: string
    }>
}

export default async function SingleColorPage({ params }: Props) {
    const { colorId } = await params

    const color = await getColorById(parseInt(colorId) || 0)

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ColorForm initialData={color} />
            </div>
        </div>
    )
}
