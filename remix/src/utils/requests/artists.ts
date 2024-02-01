import { z } from 'zod'
import { Artist } from '../types/artist'

const schema = z.object({
	'hydra:member': z.array(z.object({
		id: z.number(),
		username: z.string().min(1),
		picture: z.string().min(1)
	}))
})

export const getArtists = async (options?: { name: string}): Promise<Artist[]> => {
	const res = await fetch(`${process.env.API_URL}/artists`)

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)

		if (options && options.name) {
			const x = parsedBody['hydra:member'].filter(({ username }) => {
				return username.includes(options.name)
			})

			return x
		}

		return parsedBody['hydra:member']
	} catch {
		return []
	}
}
