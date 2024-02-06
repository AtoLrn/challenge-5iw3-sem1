import { z } from 'zod'

const schema = z.object({
	'hydra:member': z.array(z.object({
		id: z.number(),
		name: z.string().min(1)
	}))
})


export interface Studio {
	id: number,
	name: string
}

export const getStudios = async (options?: { name: string}): Promise<Studio[]> => {
	const res = await fetch(`${process.env.API_URL}/studios`)

	const body = await res.json()

	try {
		const parsedBody = schema.parse(body)

		if (options && options.name) {
			const x = parsedBody['hydra:member'].filter(({ name  }) => {
				return name.includes(options.name)
			})

			return x
		}

		return parsedBody['hydra:member']
	} catch {
		return []
	}
}
