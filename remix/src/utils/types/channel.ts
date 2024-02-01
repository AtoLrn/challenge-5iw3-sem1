export interface UserChannel {
    id: number,
    username: string,
    picture: string
}

export interface Channel {
	id: number,
    tattooArtist: UserChannel,
    requestingUser: UserChannel
}

export enum GetChannelAs {
    tattooArtist = "tattooArtist",
    requestingUser = "requestingUser"
}
