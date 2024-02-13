import { z } from 'zod'
import { Studio } from '../types/studio'

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
	time: z.string().optional(),
	studio: z.object({
		id: z.number(),
		name: z.string(),
		location: z.string()
	}).optional(),
	requestingUser: userSchema,
	tattooArtist: userSchema,
	channel: channelSchema.optional()
})


const getUnallowerDaysSchema = z.object({
	'hydra:member': z.array(z.object({
		duration: z.string(),
		time: z.string()
	}))
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

export const getArtistBookings = async ({ token }: BaseBookingRequest): Promise<Array<Booking>> => {
	const res = await fetch(`${process.env.API_URL}/pro/me/book-request/`, {
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

export const addLocationToBooking = async ({ token, bookingId, studioId, date }: PatchBookingRequest): Promise<void> => {
	await fetch(`${process.env.API_URL}/book-request/${bookingId}`, {
		method: 'PATCH',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/merge-patch+json'
		},
		body: JSON.stringify({
			studioId,
			date
		})
	})
}

export const getUnallowerSlots = async ({ token, artistId }: UnallowedSlotsRequest) => {
	const res = await fetch(`${process.env.API_URL}/book-request/${artistId}/unavailable`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const body = await res.json()

	const parsed = getUnallowerDaysSchema.parse(body)


	return parsed['hydra:member']
}

export interface UnallowedSlotsRequest extends BaseBookingRequest {
	artistId: number | string
}

export const deleteBooking = async ({ token, bookingId }: any): Promise<boolean> => {
	const res = await fetch(`https://localhost/book-request/${bookingId}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/ld+json'
		},
	})

	if (res.status === 204) {
		return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

export interface PatchBookingRequest extends BaseBookingRequest {
	bookingId: number | string
	studioId: number | string
	date: string
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
	time?: string
	studio?: Partial<Studio>
}


export interface BaseBookingRequest {
    token: string
}

export interface SetTimeBookingRequest extends  BaseBookingRequest {
	id: string
    time: string
}