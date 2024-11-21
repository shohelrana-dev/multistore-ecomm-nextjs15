'use client'

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import { Store } from '@/db/schema'
import { useStoreModal } from '@/hooks/use-store-modal'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type Props = {
    items: Store[]
    className?: string
}

export function StoreSwitcher({ items, className }: Props) {
    const storeModal = useStoreModal()
    const { storeId } = useParams()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id.toString(),
    }))

    const currentStore = formattedItems.find((item) => item.value === storeId)

    function handleStoreSelect(store: { value: string; label: string }) {
        setOpen(false)
        if (storeId !== store.value) {
            router.push(`/store-dashboard/${store.value}`)
        }
    }

    if (items.length === 0) {
        return null
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    size={'sm'}
                    area-expanded={open.toString()}
                    role='combobox'
                    area-label='Select a store'
                    className={cn('w-[200px] justify-between', className)}
                >
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {currentStore?.label}
                    <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandList>
                        <CommandInput placeholder='Search store...' />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading='Stores'>
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => handleStoreSelect(store)}
                                    className='cursor-pointer text-sm'
                                >
                                    <StoreIcon className='mr-2 h-4 w-4' />
                                    {store.label}
                                    <Check
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            currentStore?.value === store.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandGroup>
                        <CommandItem
                            onSelect={() => {
                                setOpen(false)
                                storeModal.onOpen()
                            }}
                        >
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Store
                        </CommandItem>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
