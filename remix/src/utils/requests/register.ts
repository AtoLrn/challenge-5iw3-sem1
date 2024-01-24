export const register = async (props: FormData): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/register`, {
		method: 'POST',
		body: props
	})

	console.log('ANTOINE fd: ', res)

	if (res.status === 201) {
		return true
	}

	const body = await res.json()
	
	console.log('ANTOINE2: ', body)

	throw new Error(body["hydra:description"] ?? 'Error in the request')
}

export interface Register {
    email: string,
    password: string,
	username: string
	isProfessional: boolean
}
