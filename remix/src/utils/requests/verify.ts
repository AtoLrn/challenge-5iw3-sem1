export const verify = async (token: string): Promise<true> => {
    const res = await fetch(`${process.env.API_URL}/verify?token=${token}`, {
        method: 'POST',
    })

    if (res.status === 201) {
        return true
    }

    const body = await res.json()

    throw new Error(body["hydra:description"] ?? 'Error in the request')
}
