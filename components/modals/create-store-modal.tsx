import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { InputGroup } from '@/components/ui/input-group'
import { Modal } from '@/components/ui/modal'
import { SubmitButton } from '@/components/ui/submit-button'
import { useCreateStore } from '@/hooks/stores/use-create-store'
import { useStoreModal } from '@/hooks/use-store-modal'
import { StoreFromValues, storeSchema } from '@/lib/zod'

export function CreateStoreModal() {
    const isOpen = useStoreModal((state) => state.isOpen)
    const onClose = useStoreModal((state) => state.onClose)
    const form = useForm<StoreFromValues>({
        mode: 'all',
        resolver: zodResolver(storeSchema),
        defaultValues: { name: '', location: '' },
    })
    const { mutateAsync, isPending } = useCreateStore()

    async function processForm(values: StoreFromValues) {
        try {
            await mutateAsync({ json: values })
            form.reset()
            onClose()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            title='Create store'
            description='Add a new store to manage your products and categories'
            isOpen={isOpen}
            onClose={onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(processForm)}>
                            <InputGroup label='Name' placeholder='E-Commerce' name='name' form={form} />
                            <InputGroup
                                label='Location'
                                placeholder='Location'
                                name='location'
                                form={form}
                            />
                            <div className='pt-2 space-x-2 flex items-center justify-end w-full'>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={onClose}
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                                <SubmitButton isSubmitting={isPending}>Continue</SubmitButton>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}
