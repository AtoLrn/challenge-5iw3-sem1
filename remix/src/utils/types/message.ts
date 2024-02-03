export interface UserMessage {
    id: number
    username: string
    picture: string
}

export interface Message {
    id: number
	content: string
    picture: string | null
    createdAt: string
    sender: UserMessage
}
