import * as Tabs from '@radix-ui/react-tabs'
import {Title} from '../components/Title.tsx'
import { useEffect, useState } from 'react'
import {AppointmentRow} from '../components/AppointmentRow.tsx'
import {useTranslation} from 'react-i18next'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { deleteBooking, getBookings } from 'src/utils/requests/booking.ts'
import { getSession } from 'src/session.server.ts'
import { useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'

export function meta() {
	return [
		{
			title: 'Appointments | INKIT',
		},
	]
}


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}
	
	const bookings = await getBookings({ token })

	return json({
		bookings,
		token
	})
}

export default function MainPage() {

	const [activeTab, setActiveTab ] = useState('tabBooking')
	const { t } = useTranslation()
	const { bookings: initialBookings, token } = useLoaderData<typeof loader>();
	const [bookings, setBookings] = useState(initialBookings);


	const [errors, setErrors] = useState<string | false>(false)
	const [success, setSuccess] = useState<string | false>(false)

	const cancelBooking = (bookingId: number) => {
		const confirm = window.confirm('Are you sure you want to cancel this appointment?');
	
		if (confirm) {
			deleteBooking({ token, bookingId })
			.then(() => {
				setSuccess('Appointment cancelled successfully');
				const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
				setBookings(updatedBookings);
				setErrors(false);
			})
			.catch(() => {
				setErrors('Failed to cancel the appointment');
				setSuccess(false);
			});			
		}
	};	

	useEffect(() => {
		if (location.hash === '#upcoming')
			setActiveTab('tabCurrentAppointments')
	}, [])

	const now = new Date();

	const upcomingBookings = bookings.filter(booking => {
		const bookingDate = booking.time ? new Date(booking.time) : null;
		return bookingDate && bookingDate > now && booking.studio;
	});

	const pastBookings = bookings.filter(booking => {
		const bookingDate = booking.time ? new Date(booking.time) : null;
		return bookingDate && bookingDate < now && booking.studio;
	});	

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
						<Tabs.Trigger
							className={`TabsTrigger py-2 px-8 ${activeTab === 'tabPastAppointments' ? 'bg-white text-black' : ''}`}
							value="tabPastAppointments"
							onClick={() => setActiveTab('tabPastAppointments')}>
							<Title kind={'h3'}>
								{t('past-appointments')}
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

						{errors && (
							<div className='font-bold text-red-600 border-b border-white self-start'>
								{errors}
							</div>
						)}
						{success && (
							<div className='font-bold text-green-600 border-b border-white self-start'>
								{success}
							</div>
						)}
						<div>
							{ bookings.length === 0 && <span>No Appointements for now</span>}
							{ bookings.map((book) => {
								return <AppointmentRow key={book.id} kind={'book'}
									chatId={book.channel?.id}
									isChatting={book.chat}
									artistUsername={book.tattooArtist.username}
									artistPicture={book.tattooArtist.picture}
									projectDescription={book.description}
									onCancel={() => cancelBooking(book.id)}
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

						{errors && (
							<div className='font-bold text-red-600 border-b border-white self-start'>
								{errors}
							</div>
						)}
						{success && (
							<div className='font-bold text-green-600 border-b border-white self-start'>
								{success}
							</div>
						)}
						<div>
						{upcomingBookings.length === 0 && <span>No Scheduled Appointments for now</span>}
							{upcomingBookings.map((book) => {
								const date = new Date(book.time!)
								{/* ========== Table rows ========== */}
								return <AppointmentRow kind={'current'} key={book.id}
									artistPicture={book.tattooArtist.picture}
									artistUsername={book.tattooArtist.username}
									appointmentDate={format(date, 'MMMM dd, yyyy')}
									appointmentTime={format(date, 'hh:mm a')}
									address={book.studio.location!}
									projectDescription={book.description}
									onCancel={() => cancelBooking(book.id)}
								/>
								{/* ========== /Table rows ========== */}
							
							})}
						</div>
						

					</Tabs.Content>
					{/* ========= /TAB CONTENT: Upcoming appointments ========== */}

					{/* ========= TAB CONTENT: Past appointments ========== */}
					<Tabs.Content className="TabsContent" value="tabPastAppointments">

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

						{errors && (
							<div className='font-bold text-red-600 border-b border-white self-start'>
								{errors}
							</div>
						)}
						{success && (
							<div className='font-bold text-green-600 border-b border-white self-start'>
								{success}
							</div>
						)}
						<div>
						{pastBookings.length === 0 && <span>No appointments have been scheduled yet</span>}
							{pastBookings.map((book) => {
								const date = new Date(book.time!)

								{/* ========== Table rows ========== */}
								return (
									<AppointmentRow kind={'past'} key={book.id}
										artistPicture={book.tattooArtist.picture}
										artistUsername={book.tattooArtist.username}
										appointmentDate={format(date, 'MMMM dd, yyyy')}
										appointmentTime={format(date, 'hh:mm a')}
										address={book.studio?.location}
										projectDescription={book.description}
									/>
								);
								{/* ========== /Table rows ========== */}
							})}
						</div>

					</Tabs.Content>
					{/* ========= /TAB CONTENT: Past appointments ========== */}
                    
				</Tabs.Root>

			</div>
		</main>
	)
}

