import { useOrigin } from '@/hooks/use-origin'
import { useParams } from 'next/navigation'
import { ApiAlert } from './api-alert'

interface Props {
    entityName: string
    entityIdName: string
}

export default function ApiList({ entityName, entityIdName }: Props) {
    const params = useParams()
    const origin = useOrigin()

    const baseUrl = `${origin}/api/v1/stores/${params.storeId}`

    return (
        <>
            <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}`} />
            <ApiAlert
                title='GET'
                variant='public'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
            <ApiAlert
                title='PATCH'
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert
                title='DELETE'
                variant='admin'
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
        </>
    )
}
