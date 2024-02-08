import { User, UserPatch } from '../../types/admin/user'
import { z } from 'zod'

const schemaCollection = z.object({
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

const schema = z.object({
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
        const parsedBody = schemaCollection.parse(body)

        return parsedBody['hydra:member']
    } catch {
        return []
    }
}

export const getUser = async (token: string, id: string): Promise<User> => {
    const res = await fetch(`${process.env.API_URL}/admin/users/${id}`, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': `Bearer ${token}`
		},
    })

	const body = await res.json()

    try {
        const parsedBody = schema.parse(body)

        return parsedBody
    } catch {
        throw new Error('Error while retrieving this user')
    }
}

export const patchUser = async (token: string, id: string, data: UserPatch): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/admin/users/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/merge-patch+json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(data)
	})

	if (res.status === 200) {
		return true
	}

	const body = await res.json()
    
	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

export const deleteUser = async (token: string, id: string): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/admin/users/${id}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`
		},
	})

	if (res.status === 204) {
		return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}
