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
import {getPrestationsFromUser} from 'src/utils/requests/prestations'
import * as Dialog from '@radix-ui/react-dialog'
import {createFeedback} from 'src/utils/requests/feedbacks'


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
        const artistPrestations = await getPrestationsFromUser(token, channel.tattooArtist.id)
        
	    return json({
			channel,
            artistPrestations,
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

		const formData = await request.formData()
		const requestType = formData.get('request-type')

		if (!token) {
			return redirect(`/login?error=${'You need to login'}`)
		}

        switch(requestType) {
            case 'message':
                formData.set('channelId', params.id as string)

                await sendMessage(formData, token)
                break
            case 'leave-review':
                await createFeedback(
                    token,
                    {
                        rating: Number(formData.get("rating")),
                        comment: formData.get("comment")?.toString() as string
                    },
                    formData.get("prestation") as string
                )
            default:
                break
        }

		return redirect(`/messages/${params.id}`)
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/messages?error=${e.message}`)

		return redirect(`/messages?error=${'Unexpected Error'}`)
	}

}

export default function () {
	const { t } = useTranslation()
	const { channel, artistPrestations, errors } = useLoaderData<typeof loader>()
	const chatEndRef = useRef<HTMLDivElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const { id } = useParams()

	const [ isDialogOpen, setIsDialogOpen ] = useState(false)
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
                    <Dialog.Root open={isDialogOpen}>
                        <Dialog.Trigger asChild>
                            <button onClick={() => setIsDialogOpen(true)} className="bg-transparent hover:bg-white text-white hover:text-black text-sm border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                {t('leave-review')}
                            </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
                            <Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-6 z-20 bg-zinc-600 bg-opacity-30 w-2/6 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
                                <Form onSubmit={() => setIsDialogOpen(false)} encType='multipart/form-data' method='POST' className='flex flex-col gap-2'>
					                <input value="leave-review" name="request-type" readOnly hidden />
                                    <div className='flex flex-col gap-2'>
                                        <Title kind={'h2'}>
                                            {t('review')}
                                        </Title>
                                    </div>
                                    <hr className='pb-4' />
                                    <div className='flex flex-col pb-4 flex items-start gap-2'>
                                        <div className='flex flex-col gap-4 mb-10'>
                                            <label htmlFor="rating" className='text-white font-bold'>{t('rating')}</label>
                                            <input required type="number" max={5} min={1} name="rating" placeholder={t('rating')} className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
                                        </div>
                                        <div className='flex flex-col gap-4 mb-10'>
                                            <label htmlFor="prestation" className='text-white font-bold'>Prestation</label>
                                            <select required name="prestation" className="bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300">
                                                {artistPrestations.map((prestation) => {
                                                    return <option value={prestation.id}>{prestation.name}</option>
                                                })}
                                            </select>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label htmlFor="comment" className='text-white font-bold'>{t('comment')}</label>
                                            <textarea required cols={50} rows={8} placeholder={t('description')} className='resize-y my-4 bg-transparent border-1 border-white' name='comment' id='comment' />
                                        </div>
                                    </div>
                                    <div className='flex gap-2 items-center justify-end w-full'>
                                        <Dialog.Close asChild>
                                            <button onClick={() => {
                                                setIsDialogOpen(false)
                                            }} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('cancel')}</button>
                                        </Dialog.Close>
                                        <button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('send')}</button>
                                    </div>
                                </Form>
                            </Dialog.Content>
                        </Dialog.Portal>
                    </Dialog.Root>
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
				    <input value="message" name="request-type" readOnly hidden />
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



