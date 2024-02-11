export interface PreBook {
    id: number
    description: string
    chat: boolean
    book: boolean
    requestingUser: PreBookUser
}

export interface PreBookPatch {
    chat?: boolean
    book?: boolean
    duration?: string
}

export interface PreBookUser {
    id: number
    username: string
    picture: string
}
