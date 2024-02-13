import { Message } from './message'
import { Studio } from './studio'

export interface UserChannel {
    id: number
    username: string
    picture: string
}

export interface BookRequestChannel {
    id: number
    description: string
    book: boolean
    time?: string
    studio?: Studio
}

export interface Channel {
	id: number
    tattooArtist: UserChannel
    requestingUser: UserChannel
    bookRequest: BookRequestChannel
    description: string
    messages: Message[]
}

export enum GetChannelAs {
    tattooArtist = 'tattooArtist',
    requestingUser = 'requestingUser'
}
