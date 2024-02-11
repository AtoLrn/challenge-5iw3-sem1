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
}

export interface PreBookUser {
    id: number
    username: string
    picture: string
}
