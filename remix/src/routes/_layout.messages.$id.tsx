import { Title } from 'src/components/Title'
import {Form, Link, useLoaderData} from '@remix-run/react'
import { IoSend } from 'react-icons/io5'
import { MessageSide } from 'src/components/Messages/MessageSide'
import { Message } from 'src/components/Messages/Message'
import {getSession} from 'src/session.server'
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { getChannels, sendMessage } from 'src/utils/requests/channel'
import {GetChannelAs} from 'src/utils/types/channel'
import { Message as MessageI } from '../utils/types/message'
import {useEffect, useRef} from 'react'
import { formatDate } from '../utils/date'
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

	useEffect(() => {
		chatEndRef.current?.scrollIntoView()
		formRef.current?.reset()
	})

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

					<div className="flex flex-col h-full">
						<div className="sticky top-0 px-4 py-6 border-b">
							<Title kind={'h3'}>
								{currentChannel?.tattooArtist.username}
							</Title>
						</div>
						<div className="flex flex-col gap-2 sticky top-0 px-4 py-6 border-b">
							<Title kind={'h4'} >
								{t('project-description')}
							</Title>
							<span className='opacity-70'>
								{ currentChannel?.description }
							</span>
						</div>
						{ currentChannel?.bookRequest.book && <div className="flex gap-2 sticky top-0 px-4 py-6 border-b justify-between items-center">
							<span>{t('artist-book-ready')}</span>
							<Link to={`/book/${currentChannel.bookRequest.id}`} className="bg-transparent hover:bg-white text-sm text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
								{t('book')}
							</Link>
						</div>}

						{/* ========== Messages ========== */}
						<div className="h-full overflow-y-scroll p-4 flex flex-col space-y-2">

							{currentChannel?.messages.map((message: MessageI) => {
								let kind: 'received' | 'sent'
								if (message.sender.id === currentChannel.tattooArtist.id) {
									kind = 'received'
								} else {
									kind = 'sent'
								}
								return <Message key={message.id} kind={kind}
									picture={message.picture}
									message={message.content}
									date={formatDate(message.createdAt)}
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
						{/* ========== /Input ========== */}

					</div>

				</div>
				{/* ========== /RIGHT SIDE ========== */}

			</div>

		</main>
	)
}



