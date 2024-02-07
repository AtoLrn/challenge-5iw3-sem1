export interface User {
    id: number
    email: string
    username: string
    picture: string
    isBanned: boolean
    verified: boolean
    description: string
    kbisFileUrl?: string
    kbisVerified?: boolean
    roles: string[]
    createdAt: string
    updatedAt: string
}
