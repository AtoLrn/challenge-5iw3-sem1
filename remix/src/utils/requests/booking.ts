import { z } from 'zod'

export const userSchema = z.object({
	id: z.number(),
	username: z.string(),
	picture: z.string()
})

export const channelSchema = z.object({
	id: z.number(),
	description: z.string().min(1),
	requestingUser: userSchema,
	tattooArtist: userSchema
}).optional()

export const bookingSchema = z.object({
	id: z.number(),
	description: z.string().min(1),
	chat: z.boolean(),
	book: z.boolean(),
	duration: z.string().optional(),
	requestingUser: userSchema,
	tattooArtist: userSchema,
	channel: channelSchema
})

export const bookingCollection = z.object({
	'hydra:member': z.array(bookingSchema)
})

export const getBookings = async ({ token }: BaseBookingRequest): Promise<Array<Booking>> => {
	const res = await fetch(`${process.env.API_URL}/me/book-request`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const body = await res.json()

	try {
		const parsed = bookingCollection.parse(body)

		return parsed['hydra:member']
	} catch (e) {
		console.log(e)
		return []
	}
}

export const getBookingById = async ({ token, bookingId }: GetBookingRequest): Promise<Booking> => {
	const res = await fetch(`${process.env.API_URL}/book-request/${bookingId}`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const body = await res.json()

	const parsed = bookingSchema.parse(body)

	return parsed
}


export interface GetBookingRequest extends BaseBookingRequest {
	bookingId: number | string
}

export interface BookingChannel {
    id: number,
    description: string
    requestingUser: BookingUser
    tattooArtist: BookingUser
}

export interface BookingUser {
    id: number,
    username: string
    picture: string
}

export interface Booking {
    id: number,
    description: string
    chat: boolean
    book: boolean
    requestingUser: BookingUser
    tattooArtist: BookingUser
	duration?: string
	channel?: BookingChannel
}


export interface BaseBookingRequest {
    token: string
}

export interface SetTimeBookingRequest extends  BaseBookingRequest {
	id: string
    time: string
}