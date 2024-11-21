import { User } from '@/db/schema'

export type TokenResponseData = {
    user: User
    accessToken: string
    refreshToken: string
    accessTokenExpiresIn: string
    refreshTokenExpiresIn: string
}
