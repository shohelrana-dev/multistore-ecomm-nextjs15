import { useEffect, useState } from 'react'
import { CreateStoreModal } from './create-store-modal'

export default function ModalsContainer() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <>
            <CreateStoreModal />
        </>
    )
}
