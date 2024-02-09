import { z } from 'zod'
import {PreBook, PreBookPatch} from '../types/prebook'

export const createPreBook = async (token: string, description: string, userId: string): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/book-request/${userId}`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/ld+json',
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify({description})
	})

	if(res.status === 201) {
		return true
	}

	const body = await res.json()
	console.log(body)

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

const schemaCollection = z.object({
	'hydra:member': z.array(z.object({
		id: z.number(),
		description: z.string().min(1),
		chat: z.boolean(),
		book: z.boolean(),
		requestingUser: z.object({
			id: z.number(),
			username: z.string().min(1),
			picture: z.string().min(1)
		})
	}))
})

export const getPreBook = async (token: string): Promise<PreBook[]> => {
	const res = await fetch(`${process.env.API_URL}/me/book-request`, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/ld+json',
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

export const patchPreBook = async (token: string, id: string, data: PreBookPatch): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/book-request/${id}`, {
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

export const deletePreBook = async (token: string, id: string): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/book-request/${id}`, {
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
