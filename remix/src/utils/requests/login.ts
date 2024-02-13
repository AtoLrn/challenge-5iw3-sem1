import { z } from 'zod'

const schema = z.object({
	token: z.string().optional(),
	message: z.string().optional()
})


export const login = async (props: Login): Promise<string> => {
	try {
		const res = await fetch(`${process.env.API_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(props)
		})
	
		const body = await res.json()
	
		console.log('ANTOINE: ', body)
	
		const { token, message } = schema.parse(body)
	
		if (message || !token) {
			throw new Error(message ?? 'Error in the request')
		}
		
		return token
	} catch (e) {
		console.log('ANTOINE2: ', e)
		throw new Error('Error in the request')
	}
	
}

export interface Login {
    email: string,
    password: string
}
