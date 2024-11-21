import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ComponentProps } from 'react'

interface TextareaGroupProps extends Omit<ComponentProps<'textarea'>, 'form'> {
    name: string
    label: string
    form: UseFormReturn<any>
}

export function TextareaGroup({ name, form, label, ...rest }: TextareaGroupProps) {
    return (
        <FormField
            control={form.control}
            name={name!}
            render={({ field }) => (
                <FormItem className='py-1'>
                    <FormLabel>{label}</FormLabel>
                    <FormControl className='!mt-1'>
                        <Textarea {...field} {...rest} />
                    </FormControl>
                    <FormMessage className='!mt-1 text-[12px]' />
                </FormItem>
            )}
        />
    )
}
