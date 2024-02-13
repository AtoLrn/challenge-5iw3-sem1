import { Outlet, useLoaderData, useParams} from '@remix-run/react'
import { MessageSide } from 'src/components/Messages/MessageSide'
import {getSession} from 'src/session.server'
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { getChannels, sendMessage } from 'src/utils/requests/channel'
import {GetChannelAs} from 'src/utils/types/channel'
import { Message as MessageI } from '../utils/types/message'
import {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'react-i18next'


export function meta() {
	return [
		{
			title: 'Messages | INKIT',
		},
	]
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	try {
		const channels = await getChannels(token, GetChannelAs.requestingUser)
		const currentChannel = channels.find((channel) => channel.id === parseInt(params.id as string))
        
	    return json({
			channels,
			currentChannel,
			errors: [error]
		})
	} catch (e) {
		return redirect('/')
	}
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
	try {
		const session = await getSession(request.headers.get('Cookie'))

		const token = session.get('token')

		if (!token) {
			return redirect(`/login?error=${'You need to login'}`)
		}

		const formData = await request.formData()
		formData.set('channelId', params.id as string)

		await sendMessage(formData, token)

		return redirect(`/messages/${params.id}`)
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/messages?error=${e.message}`)

		return redirect(`/messages?error=${'Unexpected Error'}`)
	}

}

export default function () {
	const { t } = useTranslation()
	const { channels, currentChannel, errors } = useLoaderData<typeof loader>()
	const chatEndRef = useRef<HTMLDivElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const { id } = useParams()

	const [ messages, setMessages ] = useState<MessageI[]>(currentChannel?.messages as MessageI[])


	useEffect(() => {
		formRef.current?.reset()
	})

	useEffect(() => {
		setMessages(currentChannel?.messages as MessageI[])
	}, [])

	useEffect(() => {
		const eventSource = new EventSource(`/api/messages/${id}`)

		eventSource.onmessage = (e) => {
			const { message } = JSON.parse(e.data)

			const receivedMessage: MessageI = {
				id: message.id,
				content: message.content,
				picture: message.file,
				createdAt: message.createdAt.date,
				sender: {
					id: message.sender.id,
					username: message.sender.username,
					picture: message.sender.picture
				}
			}

			setMessages(msg => [...msg, receivedMessage])
		}
	}, [])

	useEffect(() => {
		chatEndRef.current?.scrollIntoView()
	}, [messages])

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			{ errors.map((error) => {
				return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
					{error}
				</div>
			})}
			<div className="flex divide-x divide-white h-[88vh] mt-auto">

				<MessageSide channels={channels} />
				{/* ========== RIGHT SIDE ========== */}
				<div className="w-2/3 h-full">
		            <Outlet />
				</div>
				{/* ========== /RIGHT SIDE ========== */}

			</div>

		</main>
	)
}



