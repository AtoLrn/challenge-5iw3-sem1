import { z } from 'zod'

const schema = z.object({
	detail: z.string().optional()
})


export const register = async (props: FormData): Promise<true> => {
    for (const value of props.values()) {
        console.log(value)
    }

	const res = await fetch(`${process.env.API_URL}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data',
            'accept': 'application/ld+json'
		},
		body: props
	})

	console.log('ANTOINE fd: ', res)

	if (res.status === 201) {
		return true
	}

	const body = await res.json()
	
	console.log('ANTOINE2: ', body)

	//const { detail } = schema.parse(body)

	throw new Error('Error in the request')
}

export interface Register {
    email: string,
    password: string,
	username: string
	isProfessional: boolean
}
