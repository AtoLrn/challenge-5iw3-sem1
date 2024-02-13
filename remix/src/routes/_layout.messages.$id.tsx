import { Title } from 'src/components/Title'
import {Form, Link, useLoaderData, useParams} from '@remix-run/react'
import { IoSend } from 'react-icons/io5'
import { Message } from 'src/components/Messages/Message'
import {getSession} from 'src/session.server'
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { getChannel, sendMessage } from 'src/utils/requests/channel'
import { Message as MessageI } from '../utils/types/message'
import {useEffect, useRef, useState} from 'react'
import { formatDate } from '../utils/date'
import {useTranslation} from 'react-i18next'
import { format } from 'date-fns'


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

	if(!params.id) {
		return redirect('/messages')
	}

	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	try {
		const channel = await getChannel(token, params.id as string)
        
	    return json({
			channel,
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
	const { channel, errors } = useLoaderData<typeof loader>()
	const chatEndRef = useRef<HTMLDivElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const { id } = useParams()

	const [ messages, setMessages ] = useState<MessageI[]>(channel.messages as MessageI[])

	useEffect(() => {
		setMessages(channel.messages)
	}, [id])

	useEffect(() => {
		formRef.current?.reset()
	})

	useEffect(() => {
		const eventSource = new EventSource(`/api/messages/${id}`)

		eventSource.onmessage = (e) => {
			const { message } = JSON.parse(e.data)

			const receivedMessage: MessageI = {
				id: message.id,
				content: message.content,
				picture: message.file,
				createdAt: formatDate(message.createdAt.date, false),
				sender: {
					id: message.sender.id,
					username: message.sender.username,
					picture: message.sender.picture
				}
			}

			setMessages(msg => [...msg, receivedMessage])
		}
	}, [id])

	useEffect(() => {
		chatEndRef.current?.scrollIntoView()
	}, [messages])

	return (
		<>
			{ errors.map((error) => {
				return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
					{error}
				</div>
			})}
			<div className="flex flex-col h-full">
				<div className="sticky top-0 px-4 py-6 border-b">
					<Title kind={'h3'}>
						{channel?.tattooArtist.username}
					</Title>
				</div>
				<div className="flex flex-col gap-2 sticky top-0 px-4 py-6 border-b">
					<Title kind={'h4'} >
						{t('project-description')}
					</Title>
					<span className='opacity-70'>
						{ channel?.description }
					</span>
				</div>
				{ channel?.bookRequest.book && <div className="flex gap-2 sticky top-0 px-4 py-6 border-b justify-between items-center">
					<span>{t('artist-book-ready')}</span>
					<Link to={`/book/${channel.bookRequest.id}`} className="bg-transparent hover:bg-white text-sm text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
						{t('book')}
					</Link>
				</div>}

				{/* ========== Messages ========== */}
				<div className="h-full overflow-y-scroll p-4 flex flex-col space-y-2">

					{messages.map((message: MessageI) => {
						let kind: 'received' | 'sent'
						if (message.sender.id === channel?.tattooArtist.id) {
							kind = 'received'
						} else {
							kind = 'sent'
						}
						return <Message key={message.id} kind={kind}
							picture={message.picture}
							message={message.content}
							date={message.createdAt}
						/>
					})}
					<div ref={chatEndRef} />
				</div>
				{/* ========== /Messages ========== */}

				{/* ========== Input ========== */}
				<Form ref={formRef} encType='multipart/form-data' method='POST' className="flex flex-row p-4">
					<div className="w-2/3">
						<input name="content" required type="text" className="rounded-lg p-3 bg-black text-white border border-white w-full" placeholder="Message..."/>
					</div>
					<div className="flex flex-col items-center">
						<div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
							<input id="file" type="file" name="file" className="cursor-pointer" accept="image/png, image/jpeg"/>
						</div>
					</div>
					<div className="w-1/12 flex flex-col items-center">
						<div className="p-2 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
							<button type="submit">
								<IoSend size={24}/>
							</button>
						</div>
					</div>
				</Form>
			</div>
		</>
	)
}



