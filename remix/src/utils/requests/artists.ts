import { z } from 'zod'
import { Artist } from '../types/artist'

export const schemaArtist = z.object({
	id: z.number(),
	username: z.string().min(1),
	picture: z.string().min(1),
})

export const schemaArtistProfile = z.object({
	id: z.number(),
	username: z.string().min(1),
	picture: z.string().min(1),
	description: z.string().min(1),
	prestations: z.array(z.object({
		name: z.string().min(1),
		kind: z.string().min(1),
		picture: z.string().min(1),
		feedback: z.array(z.object({
			rating: z.number(),
			comment: z.string().min(1)
		})).optional()
	})),
	postPictures: z.array(z.object({
		picture: z.string().min(1)
	}))
})

const schema = z.object({
	'hydra:member': z.array(schemaArtist)
})

export const getArtists = async (options?: { name: string}): Promise<Artist[]> => {
	const res = await fetch(`${process.env.API_URL}/artists`)

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)

		if (options && options.name) {
			return parsedBody['hydra:member'].filter(({ username }) => {
				return username.includes(options.name)
			})

		}

		return parsedBody['hydra:member']
	} catch {
		return []
	}
}

export const getArtist = async ({ name }: { name: string }): Promise<Artist> => {
	const res = await fetch(`${process.env.API_URL}/artists/${name}`)
	
	const body = await res.json()

	const artist = schemaArtistProfile.parse(body)

	return artist
	
}
