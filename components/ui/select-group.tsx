import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface SelectGroupProps {
    name: string
    label: string
    placeholder: string
    form: UseFormReturn<any>
    items: { name: string; value: string }[]
}

export function SelectGroup({ name, form, label, placeholder, items }: SelectGroupProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className='py-1'>
                    <FormLabel>{label}</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                    >
                        <FormControl className='!mt-1'>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} defaultValue={field.value} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage className='!mt-1 text-[12px]' />
                </FormItem>
            )}
        />
    )
}
