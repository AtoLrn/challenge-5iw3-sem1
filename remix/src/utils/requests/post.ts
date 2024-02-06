import { Post } from '../types/post'

export const getPosts = async (token: string ): Promise<Post[]> => {
	const res = await fetch(`${process.env.API_URL}/me/posts`, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': `Bearer ${token}`
		},
	})

	if (res.status !== 200) {
		throw new Error('Error while retrieving data')
	}

	const bodyLd = await res.json()
	const body = bodyLd['hydra:member']

	const formatBody = body.map((post: Post): Post => {
		return {
			id: post.id,
            picture: post.picture
		}
	})

	return formatBody
}

export const createPost = async (token: string, formData: FormData): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/posts`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: formData
	})

	if(res.status === 201) {
		return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}

export const deletePost = async (token: string, id: string): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/posts/${id}`, {
        method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${token}`
		},
	})

	if (res.status === 204) {
        return true
	}

	const body = await res.json()

	throw new Error(body['hydra:description'] ?? 'Error in the request')
}
