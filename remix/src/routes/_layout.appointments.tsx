import * as Tabs from '@radix-ui/react-tabs'
import {Title} from '../components/Title.tsx'
import { useEffect, useState } from 'react'
import {AppointmentRow} from '../components/AppointmentRow.tsx'
import {useTranslation} from 'react-i18next'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { getBookings } from 'src/utils/requests/booking.ts'
import { getSession } from 'src/session.server.ts'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { format, isBefore, subHours } from 'date-fns'
import { deletePreBook } from 'src/utils/requests/pre-book.ts'
import { z } from 'zod'
import { zx } from 'zodix'

export function meta() {
	return [
		{
			title: 'Appointments | INKIT',
		},
	]
}

const actionSchema = z.object({
	id: z.string()
}) 

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}
	try {
		const { id } = await zx.parseForm(request, actionSchema)
	
		await deletePreBook(token, id)
	
		return json({
			status: 200
		})
	} catch {
		return json({
			status: 400
		})
	}
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}
	
	const bookings = await getBookings({ token })

	return json({
		bookings
	})
}

export default function MainPage() {
	const { bookings } = useLoaderData<typeof loader>()
	const [activeTab, setActiveTab ] = useState('tabBooking')
	const { t } = useTranslation()

	const fetcher = useFetcher()

	const onCancel = (id: string | number) => {
		const isConfirmed = confirm(t('are-you-sure-delete'))

		if (isConfirmed)
			fetcher.submit({
				id
			}, {
				method: 'POST'
			})
	}

	useEffect(() => {
		if (location.hash === '#upcoming')
			setActiveTab('tabCurrentAppointments')
	}, [])

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<div className="container w-10/12 mx-auto">

				<Tabs.Root className="TabsRoot mt-32" value={activeTab}>

					{/* ========= TABS ========== */}
					<Tabs.List className="TabsList flex mb-12 border-b-1 border-white" aria-label="Manage your appointments">
						<Tabs.Trigger
							className={`TabsTrigger py-2 px-8 ${activeTab === 'tabBooking' ? 'bg-white text-black' : ''}`}
							value="tabBooking"
							onClick={() => setActiveTab('tabBooking')}>
							<Title kind={'h3'}>
								{t('bookings')}
							</Title>
						</Tabs.Trigger>
						<Tabs.Trigger
							className={`TabsTrigger py-2 px-8 ${activeTab === 'tabCurrentAppointments' ? 'bg-white text-black' : ''}`}
							value="tabCurrentAppointments"
							onClick={() => setActiveTab('tabCurrentAppointments')}>
							<Title kind={'h3'}>
								{t('upcoming-appointments')}
							</Title>
						</Tabs.Trigger>
					</Tabs.List>
					{/* ========= /TABS ========== */}
                    

					<Tabs.Content className="TabsContent" value="tabBooking">

						{/* ========== Table header ========== */}
						<div className="flex flex-row gap-8 mb-8">
							<div className="w-4/12">
								<Title kind={'h4'}>
									{t('artist')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('status')}
								</Title>
							</div>
							<div className="w-3/12">
								
							</div>
							<div className="w-2/12">
								&nbsp;
							</div>
						</div>
						{/* ========== /Table header ========== */}

						{/* ========== Table rows ========== */}
		
						<div>
							{ bookings.length === 0 && <span>No Appointements for now</span>}
							{ bookings.map((book) => {
								return <AppointmentRow 
									id={book.id}
									key={book.id} kind={'book'}
									chatId={book.channel?.id}
									isChatting={book.chat}
									artistUsername={book.tattooArtist.username}
									artistPicture={book.tattooArtist.picture}
									projectDescription={book.description}
									onCancel={() => onCancel(book.id)}
								/>
							})}
						</div>

						{/* ========== /Table rows ========== */}

					</Tabs.Content>

					{/* ========= TAB CONTENT: Upcoming appointments ========== */}
					<Tabs.Content className="TabsContent" value="tabCurrentAppointments">

						{/* ========== Table header ========== */}
						<div className="flex flex-row gap-8 mb-8">
							<div className="w-4/12">
								<Title kind={'h4'}>
									{t('artist')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('date')} & {t('time')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('location')}
								</Title>
							</div>
							<div className="w-2/12">
                                &nbsp;
							</div>
						</div>
						{/* ========== /Table header ========== */}

						<div>
							{ bookings.filter((booking) => booking.time && booking.studio).length === 0 && <span>No Scheduled Appointements for now</span>}
							{ bookings.filter((booking) => booking.time && booking.studio).map((book) => {								
								const date = subHours(new Date(book.time!), 1)

								const now = new Date()
								{/* ========== Table rows ========== */}
								return <AppointmentRow kind={isBefore(date, now) ? 'past' : 'current'} key={book.id}
									id={book.id}
									artistPicture={book.tattooArtist.picture}
									artistUsername={book.tattooArtist.username}
									appointmentDate={format(date, 'MMMM dd, yyyy')}
									appointmentTime={format(date, 'hh:mm a')}
									address={book.studio.location!}
									projectDescription={book.description}
								/>
								{/* ========== /Table rows ========== */}
							
							})}
						</div>
						

					</Tabs.Content>
					{/* ========= /TAB CONTENT: Upcoming appointments ========== */}
                    
				</Tabs.Root>

			</div>
		</main>
	)
}

