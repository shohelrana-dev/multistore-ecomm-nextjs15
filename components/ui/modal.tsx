import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'

interface Props {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({ title, description, isOpen, onClose, children }: Props) {
    function onOpenChange(open: boolean) {
        if (!open) onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} modal>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div>{children}</div>
            </DialogContent>
        </Dialog>
    )
}
