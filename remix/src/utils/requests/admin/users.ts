import { User } from '../../types/admin/user'
import { z } from 'zod'

const schema = z.object({
	'hydra:member': z.array(z.object({
		id: z.number(),
        email: z.string().min(1),
        username: z.string().min(1),
        picture: z.string().min(1),
        isBanned: z.boolean(),
        verified: z.boolean(),
        description: z.string().min(1),
        roles: z.string().array(),
        createdAt: z.string().min(1),
        updatedAt: z.string().min(1),
	}))
})

export const getUsers = async (token: string): Promise<User[]> => {
    const res = await fetch(`${process.env.API_URL}/admin/users`, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': `Bearer ${token}`
		},
    })

	const body = await res.json()

    try {
        const parsedBody = schema.parse(body)

        return parsedBody['hydra:member']
    } catch {
        return []
    }
}
