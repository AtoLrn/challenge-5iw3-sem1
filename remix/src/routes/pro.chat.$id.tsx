import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, MetaFunction, useFetcher, useLoaderData, useParams } from '@remix-run/react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import { getChannel, sendMessage } from 'src/utils/requests/channel'
import { IoSend } from 'react-icons/io5'
import { Message } from 'src/components/Messages/Message'
import { formatDate } from '../utils/date'
import { Message as MessageI } from '../utils/types/message'
import {useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {useTranslation} from 'react-i18next'
import { patchPreBook } from 'src/utils/requests/pre-book'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Chatting | INKIT'
		}
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
		const channel = await getChannel(token, params.id as string)
        
	    return json({
			channel,
			errors: [error],
		})
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/chat?error=${e.message}`)

		return redirect(`/pro/chat?error=${'Unexpected Error'}`)
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

		const kind = formData.get('kind')

		if (kind === 'message') {
			formData.set('channelId', params.id as string)

			await sendMessage(formData, token)
		} else {
			const id = formData.get('bookId')?.toString()
			const time = formData.get('duration')?.toString()

			if (!id || !time) {
				return redirect(`/pro/chat/${params.id}`)
			}

			await patchPreBook(token as string, id , {
				duration: time
			})
		}

		return redirect(`/pro/chat/${params.id}`)
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/chat/${params.id}?error=${e.message}`)

		return redirect(`/pro/chat/${params.id}?error=${'Unexpected Error'}`)
	}

}

export default function () {
	const { channel, errors } = useLoaderData<typeof loader>()
	const formRef = useRef<HTMLFormElement>(null)
	const formDuration = useRef<HTMLFormElement>(null)
	const chatEndRef = useRef<HTMLDivElement>(null)    
	const { id } = useParams()

	const [ isOpen, setIsOpen ] = useState<boolean>()
	const [ messages, setMessages ] = useState<MessageI[]>(channel.messages)

	const fetcherDuration = useFetcher()

	const { t } = useTranslation()

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
	}, [])

	useEffect(() => {
		chatEndRef.current?.scrollIntoView()
	}, [messages])

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">

		<div className="w-full h-full">

			<div className="flex flex-col h-full">
				<div className="flex justify-between sticky top-0 px-4 py-6 border-b">
					<Title kind={'h3'}>
						{channel.requestingUser.username}
					</Title>
					<div className='flex items-center gap-4'>

						<Dialog.Root>
						
							<Dialog.Trigger asChild>
								<button className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('see-description')}</button>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
								<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/2 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
									<div className='flex flex-col gap-2'>
										<Title kind={'h2'}>
                                        Description
										</Title>
									</div>
									<hr className='pb-4' />
									<div className='pb-4 flex items-center gap-2'>
										<textarea cols={70} rows={8} className='w-full resize-none outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' name='description' id='description' value={channel.description} />
									</div>
									<div className='flex gap-2 items-center justify-end w-full'>
										<Dialog.Close asChild>
											<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('return')}</button>
										</Dialog.Close>
									</div>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>

						{ !channel.bookRequest.book && <Dialog.Root open={isOpen}>
						
							<Dialog.Trigger asChild>
								<button className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border border-green-500 text-green-500'>{t('validate-demand')}</button>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
								<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
									<div className='flex flex-col gap-2'>
										<Title kind={'h2'}>
											{t('validate-demand')}
										</Title>
									</div>
									<hr className='pb-4' />
									<fetcherDuration.Form ref={formDuration} className='flex flex-col w-full' method='POST'>
										<input type="hidden" name='bookId' value={channel.bookRequest.id} />
										<select className='w-full outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' name="duration" defaultValue='30min'>
											<option value="30min">30 {t('minutes')}</option>
											<option value="1h">1 {t('hour')}</option>
											<option value="2h">2 {t('hour')}s</option>
											<option value="3h">3 {t('hour')}s</option>
											<option value="4h">4 {t('hour')}s</option>
										</select>
									</fetcherDuration.Form>
									<div className='flex gap-2 items-center justify-end w-full'>
										<button onClick={() => {
											if (formDuration.current) {
												fetcherDuration.submit(formDuration.current)
											}

											setIsOpen(false)
										}} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('submit')}</button>
										<Dialog.Close asChild>
											<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('return')}</button>
										</Dialog.Close>
									</div>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root> }
						


					</div>
					
				</div>

				<div className='flex flex-col overflow-scroll grow'>
					{/* ========== Messages ========== */}
					{messages.map((message: MessageI) => {
						let kind: 'received' | 'sent'
						if (message.sender.id === channel.requestingUser.id) {
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


				{ errors.map((error) => {
					return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
						{error}
					</div>
				})}
				{/* ========== Input ========== */}
				<Form ref={formRef} encType='multipart/form-data' method='POST' className="flex flex-row justify-between">
					<input type="hidden" name='kind' value='message' />
					<div className="w-2/3">
						<input name="content" required type="text" className="rounded-lg p-3 bg-black text-white border border-white w-full" placeholder="Message..."/>
					</div>
					<div className="flex flex-col items-center">
						<div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
							    <input id="file" type="file" name="file" className="cursor-pointer" accept="image/png, image/jpeg"/>
						</div>
					</div>
					<div className="flex flex-col items-center">
						<div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
							    <button type="submit">
								<IoSend size={24}/>
							</button>
						</div>
					</div>
				</Form>
				{/* ========== /Input ========== */}

			</div>

		</div>
	</div>
}

