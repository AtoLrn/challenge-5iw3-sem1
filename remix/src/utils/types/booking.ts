export interface GetBooking {
	id: number,
	description: string,
	chat: boolean,
	book: boolean,
	requestingUser: BookingRequestingUser,
	tattooArtist: BookingRequestingUser,
	duration?: string,
	time?: string,
	studio?: {
		id?: number,
		name?: string,
		location?: string
	}
}

interface BookingRequestingUser {
	id: number,
	username: string,
	picture: string,
}
