import { z } from 'zod'
import { User } from '../types/user'

const schema = z.object({
	id: z.number(),
	email: z.string().min(1),
	username: z.string().min(1),
	description: z.string().optional(),
	picture: z.string().min(1),
	roles: z.string().array(),
	kbisVerified: z.boolean(),
	phoneNumber: z.string().optional()
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

	const { id, email, username, description, picture, roles, kbisVerified, phoneNumber } = schema.parse(body)
	    
	return {
		id,
		email: email,
		name: username,
		avatar: picture,
		description: description,
		isProfessional: roles.includes('ROLE_PRO'),
		isAdmin: roles.includes('ROLE_ADMIN'),
		isKbisVerified: kbisVerified,
		phoneNumber: phoneNumber
	}
}

export const patchMe = async (token: string, data: PatchMe): Promise<true> => {
	console.log(data)
	const res = await fetch(`${process.env.API_URL}/users/me`, {
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

export const patchMePassword = async (token: string, data: PatchMePassword): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/users/me/update-password`, {
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

export const updateMePicture = async (token: string, formData: FormData): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/users/me/update-profil-picture`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: formData
	})

	if(res.status === 201) {
		return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

export interface PatchMePassword {
    currentPassword?: string,
    newPassword?: string,
}

export interface PatchMe {
    email?: string,
    username?: string,
    description?: string
		phoneNumber?: string
}

export interface Me {
    token: string,
}
