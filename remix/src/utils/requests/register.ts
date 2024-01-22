import { z } from 'zod'

const schema = z.object({
	detail: z.string().optional()
})


export const register = async (props: Register): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify(props)
	})

	console.log('ANTOINE: ', res.status)

	if (res.status === 201) {
		return true
	}

	const body = await res.json()
	
	console.log('ANTOINE2: ', body)

	const { detail } = schema.parse(body)

	throw new Error(detail ?? 'Error in the request')
}

export interface Register {
    email: string,
    password: string,
	username: string
	isProfessional: boolean
}
