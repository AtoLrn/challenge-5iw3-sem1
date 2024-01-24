export const sendLink = async (props: ForgetPassword): Promise<true> => {
    const res = await fetch(`${process.env.API_URL}/forget-password`, {
        method: 'POST',
		headers: {
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify(props)
    })

    if (res.status === 201) {
        return true
    }

    const body = await res.json()

    throw new Error(body["hydra:description"] ?? 'Error in the request')
}

export const resetPassword = async (props: ResetPassword, token: string): Promise<true> => {
    const res = await fetch(`${process.env.API_URL}/reset-password?token=${token}`, {
        method: 'PATCH',
		headers: {
			'Content-Type': 'application/merge-patch+json'
		},
		body: JSON.stringify(props)
    })

    if (res.status === 200) {
        return true
    }

    const body = await res.json()

    throw new Error(body["hydra:description"] ?? 'Error in the request')
}

export interface ForgetPassword {
    email: string,
}

export interface ResetPassword {
    password: string,
}
