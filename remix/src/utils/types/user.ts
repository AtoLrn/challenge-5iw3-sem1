export interface User {
    id?: number
    email?: string
    name: string
    avatar: string
    description?: string
    isProfessional: boolean
    isAdmin: boolean
    isKbisVerified?: boolean
}
