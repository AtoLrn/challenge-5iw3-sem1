import { z } from 'zod'
import { Studio } from '../types/studio'
import { Validation } from '../types/validation'

const schema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	status: z.string().min(1),
	maxCapacity: z.number(),
	openingTime: z.string().min(1),
	closingTime: z.string().min(1),
	monday: z.string().min(1),
	tuesday: z.string().min(1),
	wednesday: z.string().min(1),
	thursday: z.string().min(1),
	friday: z.string().min(1),
	saturday: z.string().min(1),
	sunday: z.string().min(1),
	picture: z.string().min(1)
})

export const createStudio = async (props: CreateStudio): Promise<Studio> => {
	const formData = new FormData()


	for ( const [key, name] of Object.entries(props)) {
		if (key === 'token') { continue }
		formData.set(key, name)
	}

	try {
		const res = await fetch(`${process.env.API_URL}/studios/add`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${props.token}`
			},
			body: formData
		})

		const body = await res.json()
		console.log('body', body)

		const studio = schema.parse(body)
		
		return {
			...studio,
			status: studio.status === 'PENDING' ? Validation.PENDING : studio.status === 'ACCEPTED' ? Validation.ACCEPTED : Validation.REFUSED
		}
	} catch (e) {
		console.log('ANTOINE: ', e)
	} 
}

export interface CreateStudio {
    name: string,
    description: string,
    location: string,
    maxCapacity: number,
    openingTime: string,
    closingTime: string
    monday?: string,
    tuesday?: string,
    wednesday?: string,
    thursday?: string,
    friday?: string,
    saturday?: string,
    sunday?: string,
    token: string,
	picture: File
}
