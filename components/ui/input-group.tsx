import { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input, InputProps } from '@/components/ui/input'

interface InputGroupProps extends Omit<InputProps, 'form'> {
    name: string
    label: string
    form: UseFormReturn<any>
}

export function InputGroup({ name, form, label, ...rest }: InputGroupProps) {
    return (
        <FormField
            control={form.control}
            name={name!}
            render={({ field }) => (
                <FormItem className='py-1'>
                    <FormLabel>{label}</FormLabel>
                    <FormControl className='!mt-1'>
                        <Input
                            {...field}
                            onChange={
                                rest.type === 'number'
                                    ? (e) => field.onChange(Number(e.target.value))
                                    : field.onChange
                            }
                            {...rest}
                        />
                    </FormControl>
                    <FormMessage className='!mt-1 text-[12px]' />
                </FormItem>
            )}
        />
    )
}
