
export interface Post {
    userId: number
    id: number
    title: string
    description: string
}

export const getPosts = async (options?: { title: string}): Promise<Post[]> => {
	const res = await fetch('https://jsonplaceholder.typicode.com/posts')

	const posts = await res.json() as Post[]

	if (options && options.title) {
		return posts.filter(({ title }) => {
			return title.includes(options.title)
		})
	}

	return posts
}
