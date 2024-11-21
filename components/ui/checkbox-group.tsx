import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Checkbox } from './checkbox'

interface CheckboxGroupProps {
    name: string
    label: string
    description: string
    form: UseFormReturn<any>
}

export function CheckboxGroup({ name, form, label, description }: CheckboxGroupProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='py-1 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                    <FormControl className='!mt-1'>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{description}</FormDescription>
                    </div>
                </FormItem>
            )}
        />
    )
}
