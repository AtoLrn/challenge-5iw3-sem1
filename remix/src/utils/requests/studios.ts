import { z } from 'zod'
import { Studio } from './../types/studio'
import { Validation } from '../types/validation'
import { partnerShipSchema } from './partnership'
import { bookingSchema } from './booking'

const studioSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	maxCapacity: z.number(),
	status: z.string().min(1),
	openingTime: z.string().nullable(),
	closingTime: z.string().nullable(),
	monday: z.string().nullable(),
	tuesday: z.string().nullable(),
	wednesday: z.string().nullable(),
	thursday: z.string().nullable(),
	friday: z.string().nullable(),
	saturday: z.string().nullable(),
	sunday: z.string().nullable(),
	picture: z.string().min(1),

	partnerShips: z.array(partnerShipSchema),
	bookRequests: z.array(bookingSchema)
})

const schema = z.object({
	'hydra:member': z.array(studioSchema)
})


export const getStudios = async (options?: { name: string}): Promise<Studio[]> => {
	const res = await fetch(`${process.env.API_URL}/studios`)

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)

		if (options && options.name) {
			const x = parsedBody['hydra:member'].filter(({ name  }) => {
				return name.includes(options.name)
			})

			return x.map((studio) => {
				return {
					...studio,
					status: studio.status === 'PENDING' ? Validation.PENDING : studio.status === 'ACCEPTED' ? Validation.ACCEPTED : Validation.REFUSED
				}
			})
		}

		return parsedBody['hydra:member'].map((studio) => {
			return {
				...studio,
				status: studio.status === 'PENDING' ? Validation.PENDING : studio.status === 'ACCEPTED' ? Validation.ACCEPTED : Validation.REFUSED
			}
		})
	} catch {
		return []
	}
}

export const getMyStudios = async ({token}: { token: string}): Promise<Studio[]> => {
	const res = await fetch(`${process.env.API_URL}/studio/mine`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)



		return parsedBody['hydra:member'].map((studio) => {
			return {
				...studio,
				status: studio.status === 'PENDING' ? Validation.PENDING : studio.status === 'ACCEPTED' ? Validation.ACCEPTED : Validation.REFUSED
			}
		})
	} catch (e) {
		console.log(e)
		return []
	}
}

export const getStudio = async ({ id }: { id: string}): Promise<Studio> => {
	const res = await fetch(`${process.env.API_URL}/studio/search/${id}`)

	
	const body = await res.json()

	console.log(body)

	const studio = studioSchema.parse(body)

	return {
		...studio,
		status: studio.status === 'PENDING' ? Validation.PENDING : studio.status === 'ACCEPTED' ? Validation.ACCEPTED : Validation.REFUSED
	}
	
}
