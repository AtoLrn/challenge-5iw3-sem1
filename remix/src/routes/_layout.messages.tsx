import { Title } from 'src/components/Title'
import {Form} from '@remix-run/react'
import { t } from 'i18next'
import { IoSend } from 'react-icons/io5'
import { RiAttachment2 } from 'react-icons/ri'
import { MessagePreview } from 'src/components/Messages/MessagePreview'
import { Message } from 'src/components/Messages/Message'


export function meta() {
	return [
		{
			title: 'Messages | INKIT',
		},
	]
}

export default function MainPage() {


	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<div className="flex divide-x divide-white h-[88vh] mt-auto">

				{/* ========== LEFT SIDE ========== */}
				<div className="w-1/3 flex flex-col h-full">
					<div className="sticky top-0 px-4 py-6 border-b">
						<Title kind={'h3'}>
							{t('conversations')}
						</Title>
					</div>

					{/* ========== Open conversations list ========== */}
					<div className="h-full overflow-y-scroll">

						{/* Example: convo with unread messages */}
						<MessagePreview picture={'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'}
							name={'Jane DOE'}
							message={'Lorem ipsum dolor sit ametamet feizuhiu aof ai'}
							time={'13:00'}
							unreadMessages={2}
						/>

						{/* Example: convo already read */}
						<MessagePreview picture={'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80'}
							name={'Jane DOE'}
							message={'Lorem ipsum dolor sit ametamet feizuhiu aof ai'}
							time={'13:00'}
						/>
					</div>
					{/* ========== /Open conversations list ========== */}

				</div>
				{/* ========== /LEFT SIDE ========== */}

				{/* ========== RIGHT SIDE ========== */}
				<div className="w-2/3 h-full">

					<div className="flex flex-col h-full">
						<div className="sticky top-0 px-4 py-6 border-b">
							<Title kind={'h3'}>
                                John DOE
							</Title>
						</div>

						{/* ========== Messages ========== */}
						<div className="h-full overflow-y-scroll p-4 flex flex-col space-y-2">

							{/* ========== Message (sent) ========== */}
							<Message kind={'sent'}
								message={'This is a sent message'}
								date={'January 20th 2024'}
								time={'4:20 PM'}
							/>
							{/* ========== /Message (sent) ========== */}

							{/* ========== Message (received) ========== */}
							<Message kind={'received'}
								message={'This is a received message'}
								date={'January 20th 2024'}
								time={'4:20 PM'}
							/>
							{/* ========== /Message (received) ========== */}
                            
						</div>
						{/* ========== /Messages ========== */}

						{/* ========== Input ========== */}
						<Form className="flex flex-row p-4">
							<div className="w-10/12">
								<input name="message" type="text" className="rounded-lg p-3 bg-black text-white border border-white w-full" placeholder="Message..."/>
							</div>
							<div className="w-1/12 flex flex-col items-center">
								<div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
									<RiAttachment2 size={24}/>
								</div>
							</div>
							<div className="w-1/12 flex flex-col items-center">
								<div className="p-3 ml-auto hover:cursor-pointer bg-black text-white border border-white rounded-lg">
									<IoSend size={24}/>
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



