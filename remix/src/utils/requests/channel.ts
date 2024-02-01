import { Channel, GetChannelAs } from '../types/channel'
import { Message } from '../types/message'
import { z } from 'zod'

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
    const body = bodyLd["hydra:member"]

    const formatBody = body.map((channel: Channel): Channel => {
        return {
            id: channel.id,
            requestingUser: {
                id: channel.requestingUser.id,
                username: channel.requestingUser.username,
                picture: channel.requestingUser.picture,
            },
            tattooArtist: {
                id: channel.tattooArtist.id,
                username: channel.tattooArtist.username,
                picture: channel.tattooArtist.picture,
            }
        }
    })

    return formatBody
}

export const getChannel = async (token: string, id: string): Promise<any> => {
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
        messages: body.messages.map((message: Message): Message => {
            return {
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
