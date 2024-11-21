'use client'

import { ImagePlus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { Button } from './button'

interface Props {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

export function ImageUpload({ disabled, onChange, onRemove, value }: Props) {
    function handleOnChange(result: any) {
        onChange(result.info.secure_url)
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {value.map((url) => (
                    <div key={url} className='relative h-[200px] w-[200px] overflow-hidden rounded-md'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button onClick={() => onRemove(url)} variant='destructive' type='button'>
                                <Trash className='h-4 w-4' />
                            </Button>
                        </div>
                        <Image src={url} fill className='object-cover' alt='Image' />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={handleOnChange} uploadPreset='qrdwuwvy'>
                {({ open }) => {
                    return (
                        <Button
                            disabled={disabled}
                            variant='secondary'
                            onClick={() => open()}
                            type='button'
                        >
                            <ImagePlus className='mr-2 h-4 w-4' />
                            Upload an image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}
