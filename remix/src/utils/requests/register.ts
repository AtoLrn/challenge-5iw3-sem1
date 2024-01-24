export const register = async (props: FormData): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/register`, {
		method: 'POST',
		body: props
	})

	if (res.status === 201) {
		return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

export interface Register {
    email: string,
    password: string,
	username: string
	isProfessional: boolean
}
