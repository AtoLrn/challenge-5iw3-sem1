import { z } from 'zod'
import { User } from '../types/user'

const schema = z.object({
	id: z.number(),
	email: z.string().min(1),
	username: z.string().min(1),
	picture: z.string().min(1),
	isProfessional: z.boolean(),
	isBanned: z.boolean(),
})


export const me = async ({ token }: Me): Promise<User> => {
	const res = await fetch(`${process.env.API_URL}/users/me`, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': `Bearer ${token}`
		},
	})

	if (res.status === 401) {
		throw new Error('Not Authenticated')
	}

	const body = await res.json()

	const { id, username, picture } = schema.parse(body)

    
	return {
		id,
		name: username,
		avatar: picture
	}
}

export interface Me {
    token: string,
}
