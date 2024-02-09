import { z } from 'zod'
import { Prestation } from '../types/prestation'
import { Kind } from '../types/kind'

const prestationsSchema = z.array(z.object({
	id: z.number(),
	name: z.string(),
	kind: z.nativeEnum(Kind),
	proposedBy: z.string(),
	picture: z.string().nullable(),
	created_at: z.string(),
}))

const prestationSchema = z.object({
	id: z.number(),
	name: z.string(),
	kind: z.nativeEnum(Kind),
	proposedBy: z.string(),
	picture: z.string().nullable().optional(),
	created_at: z.string(),
})

export const getPrestations = async (token: string): Promise<Prestation[]> => {
	const response = await fetch(`${process.env.API_URL}/prestations`, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/ld+json',
		},
	})

	if (!response.ok) {
		throw new Error('Not authenticated')
	}

	const result = await response.json()
  

	const data = prestationsSchema.parse(result['hydra:member'])
	return data
}

export const getPrestation = async (id: number, token: string): Promise<Prestation> => {
	const response = await fetch(`${process.env.API_URL}/prestations/${id}`, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Accept': 'application/ld+json',
		},
	})

	if (!response.ok) {
		throw new Error('Not authenticated')
	}

	const result = await response.json()
	const data = prestationSchema.parse(result) as Prestation
	return data
}

export const createPrestation = async (formData: FormData, token: string): Promise<Response> => {
	const response = await fetch(`${process.env.API_URL}/prestations`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: formData,
	})

	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.statusText}`)
	}


	return response
}

export const updatePrestation = async (id: string | number, prestationData: { name?: string; kind?: Kind; }, token: string): Promise<Response> => {
  const jsonData = {
    name: prestationData.name,
    kind: prestationData.kind,
  };

  const response = await fetch(`${process.env.API_URL}/prestations/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/merge-patch+json',
    },
    body: JSON.stringify(jsonData),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response;
};

export const deletePrestation = async (id: string | number, token: string): Promise<Response> => {
	const response = await fetch(`${process.env.API_URL}/prestations/${id}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`
		},
	})

	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.statusText}`)
	}

	return response
}
