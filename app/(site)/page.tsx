'use client'
import useAuth from '@/hooks/use-auth'
import Link from 'next/link'

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div>
            <h3 className='text-center'>Home page</h3>
            <p className='text-center'>{user ? user.name : <Link href='/login'>Login</Link>}</p>
        </div>
    )
}
