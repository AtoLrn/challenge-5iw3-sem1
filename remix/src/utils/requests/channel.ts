import { Channel, GetChannelAs } from '../types/channel'
import { Message } from '../types/message'

export const getChannels = async (token: string, as: GetChannelAs ): Promise<Channel[]> => {
	const res = await fetch(`${process.env.API_URL}/me/channels?as=${as}`, {
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

	// Sorry for this ugly formatting, I wish I had other way and more time
	const formatBody = body.map((channel: Channel): Channel => {
		// sorting the messages to retreive easily the latest message because API Platform somehow don't do it itself...
		channel.messages.sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())

		return {
			id: channel.id,
			description: channel.description,
			requestingUser: {
				id: channel.requestingUser.id,
				username: channel.requestingUser.username,
				picture: channel.requestingUser.picture,
			},
			tattooArtist: {
				id: channel.tattooArtist.id,
				username: channel.tattooArtist.username,
				picture: channel.tattooArtist.picture,
			},
			bookRequest: channel.bookRequest,
			messages: channel.messages
		}
	})

	return formatBody
}

export const getChannel = async (token: string, id: string): Promise<Channel> => {
	const res = await fetch(`${process.env.API_URL}/channels/${id}`, {
		headers: {
			'Accept': 'application/ld+json',
			'Authorization': `Bearer ${token}`
		},
	})

	const body = await res.json()

	if (res.status !== 200) {
	    throw new Error(body['hydra:description'] ?? 'Error in the request')
	}

	const formatBody = {
		id: body.id,
		description: body.description,
		tattooArtist: {
			id: body.tattooArtist.id,
			username: body.tattooArtist.username,
			picture: body.tattooArtist.picture,
		},
		requestingUser: {
			id: body.requestingUser.id,
			username: body.requestingUser.username,
			picture: body.requestingUser.picture,
		},
		bookRequest: body.bookRequest,
		messages: body.messages.map((message: Message): Message => {
			return {
				id: message.id,
				content: message.content,
				createdAt: message.createdAt,
				picture: message.picture,
				sender: {
					id: message.sender.id,
					username: message.sender.username,
					picture: message.sender.picture,
				}
			}
		})
	}

	return formatBody
}

export const sendMessage = async (formData: FormData, token: string): Promise<true> => {
	const res = await fetch(`${process.env.API_URL}/messages/send`, {
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
