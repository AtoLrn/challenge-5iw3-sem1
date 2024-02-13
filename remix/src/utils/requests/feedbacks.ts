import {FeedBackCreate} from "../types/feedback"

export const createFeedback = async (token: string, data: FeedBackCreate, id: string): Promise<true> => {
	const response = await fetch(`${process.env.API_URL}/prestation/${id}/feedbacks`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/ld+json',
			'Accept': 'application/ld+json'
		},
		body: JSON.stringify(data),
	})
    console.log(response)

	if(response.status === 201) {
		return true
	}

	const body = await response.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}
