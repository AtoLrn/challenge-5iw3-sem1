import { z } from 'zod'
import { Artist } from '../types/artist'

export const schemaArtist = z.object({
	id: z.number(),
	username: z.string().min(1),
	picture: z.string().min(1)
})

const schema = z.object({
	'hydra:member': z.array(schemaArtist)
})

export const getArtists = async (options?: { name: string}): Promise<Artist[]> => {
	const res = await fetch(`${process.env.API_URL}/artists`)

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)
        console.log(parsedBody)

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

	const artist = schemaArtist.parse(body)

	return artist
	
}
