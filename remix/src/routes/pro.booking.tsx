import { Link, MetaFunction } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { t } from 'i18next'
import { FaCalendarDay, FaDownload, FaGoogle, FaMicrosoft } from 'react-icons/fa6'
import { Booking } from 'src/utils/types/booking'
import { Validation } from 'src/utils/types/validation'
import { parseISO, format, isPast } from 'date-fns'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Badge } from 'src/components/Pro/Badge'
import { BreadCrumb } from 'src/components/Breadcrumb'
import * as Dialog from '@radix-ui/react-dialog'
import { createGoogleCalendarLink, createOutlookCalendarLink, exportToICS } from 'src/utils/calendar'
import { useEffect, useState } from 'react'

export const meta: MetaFunction = () => {
	return [
		{
			title: t('booking-title'),
			description: t('booking-page'),
		},
	]
}

export const AppointementsItem: React.FC<ListItemProps<Booking>> = ({ item }) => {
	const [isClientSide, setIsClientSide] = useState(false)

	/**
   * Calculates the appointment time based on the client's booking information.
   * 
   * @param client - The booking information of the client.
   * @returns The formatted appointment time.
   */
	const getAppointmentTime = (client: Booking) => {
		const now = new Date()
		const appointmentDate = parseISO(client.date)

		if (appointmentDate.getTime() - now.getTime() < 3600000) {
			return t('inXMinutes', {
				count: Math.round((appointmentDate.getTime() - now.getTime()) / 60000),
			})
		} else if (appointmentDate.getTime() - now.getTime() < 86400000) {
			return t('inXHours', {
				count: Math.round(
					(appointmentDate.getTime() - now.getTime()) / 3600000
				),
			})
		} else if (appointmentDate.getTime() - now.getTime() < 604800000) {
			return t('inXDays', {
				count: Math.round(
					(appointmentDate.getTime() - now.getTime()) / 86400000
				),
			})
		} else {
			return format(appointmentDate, t('date-hours-format'))
		}
	}

	useEffect(() => {
		setIsClientSide(true)
	}, [])

	/**
   * Formats the duration in minutes into a human-readable format.
   *  If the duration is less than 60 minutes, it will be displayed as minutes.
   *  If the duration is exactly 60 minutes, it will be displayed as 1 hour.
   *  If the duration is greater than 60 minutes, it will be displayed as hours and minutes.
   * 
   * @param duration The duration in minutes.
   * @returns The formatted duration string.
   */
	const formatDuration = (duration: number) => {
		if (duration < 60) {
			return `${duration} minutes`
		} else if (duration === 60) {
			return '1 hour'
		} else {
			const hours = Math.floor(duration / 60)
			const minutes = duration % 60
			return `${hours} hour${hours > 1 ? 's' : ''} ${
				minutes > 0 ? `${minutes} minutes` : ''
			}`
		}
	}

	return (
		<div className="grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center">
			<span>
				<Badge state={item.status} />
			</span>
			<span className="flex items-center">
				<img
					src={item.profile.avatar}
					alt={item.profile.username}
					className="w-8 h-8 rounded-full mr-2"
				/>
				{item.profile.username}
			</span>
			<span>{item.prestation.name}</span>
			<span>{isClientSide ? getAppointmentTime(item) : t('loading')}</span>
			<span>{formatDuration(item.duration)}</span>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<button className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>
						{t('view')}
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
					<Dialog.Content className="flex flex-col items-stretch justify-start gap-8 p-4 z-20 bg-zinc-600 bg-opacity-30 w-96 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
						<h1 className='font-title text-xl font-bold'>{item.prestation.name} {t('with')} {item.profile.username}</h1>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('client')}</span>
								<span>{item.profile.username}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('date')}</span>
								<span>{format(parseISO(item.date), t('date-hours-format'))}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('duration')}</span>
								<span>{formatDuration(item.duration)}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('location')}</span>
								<Link to={`https://www.google.com/maps/search/?api=1&query=${item.prestation.location}`} target='_blank' rel='noopener noreferrer' className="underline">{item.prestation.location}</Link>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('status')}</span>
								<span>{t(item.status)}</span>
							</div>
						</div>
						<div className={`w-full flex items-center gap-4 ${item.status === Validation.ACCEPTED ? 'justify-between' : 'justify-end'}`}>
							{item.status === Validation.ACCEPTED && (
								<div className='flex gap-2 justify-center md:justify-start'>
									<Link className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' to={createGoogleCalendarLink(item)} target="_blank" rel="noopener noreferrer" title={t('add-google-calendar')}>
										<FaGoogle />
									</Link>
									<Link className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' to={createOutlookCalendarLink(item)} target="_blank" rel="noopener noreferrer" title={t('add-outlook-calendar')}>
										<FaMicrosoft />
									</Link>
									<button className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' onClick={() => exportToICS(item)} title={t('download-as-ics')}>
										<FaCalendarDay />
									</button>
								</div>
							)}
							<Dialog.Close asChild>
								<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('ok')}</button>
							</Dialog.Close>
						</div>
          
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
}

export default function () {
	const clients: Booking[] = [
		{
			profile: {
				username: 'Laink et Terracid',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
			},
			date: '2023-12-12 14:30',
			duration: 30,
			status: Validation.ACCEPTED,
		},
		{
			profile: {
				username: 'Adrien Morin',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
			},
			date: '2025-12-08 11:00',
			duration: 30,
			status: Validation.PENDING,
		},
		{
			profile: {
				username: 'Sam',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
			},
			date: '2023-06-06 14:30',
			duration: 30,
			status: Validation.ACCEPTED,
		},
		{
			profile: {
				username: 'Lucas',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Piercing',
				kind: 'jewelry',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
			},
			date: '2023-12-06 17:30',
			duration: 60,
			status: Validation.PENDING,
		},
		{
			profile: {
				username: 'Antoine',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
			},
			date: '2024-12-06 17:30',
			duration: 90,
			status: Validation.REFUSED,
		},
	]

	const exportToCSV = () => {
		let csvContent = 'data:text/csv;charset=utf-8,'

		const headers =
      'Username, Email, Is Professional, Prestation Name, Prestation Kind, Prestation Location, Date, Duration, Status\n'
		csvContent += headers

		clients.forEach((client) => {
			const location = client.prestation.location.replace(/,/g, '')
			const row = [
				client.profile.username,
				client.profile.email,
				client.profile.isProfessional,
				client.prestation.name,
				client.prestation.kind,
				location,
				client.date,
				client.duration,
				client.status,
			].join(',')
			csvContent += row + '\n'
		})

		const encodedUri = encodeURI(csvContent)
		const link = document.createElement('a')
		link.setAttribute('href', encodedUri)
		const today = new Date()
		link.setAttribute(
			'download',
			today.toLocaleDateString() + '_appointements.csv'
		)
		document.body.appendChild(link) // Required for FF

		link.click()
		document.body.removeChild(link)
	}

	// Remove past appointements
	for (let i = 0; i < clients.length; i++) {
		const clientDate = clients[i]?.date ?? ''
		if (clientDate && isPast(parseISO(clientDate))) {
			clients.splice(i, 1)
			i--
		}
	}

	return (
		<div className="flex-1 p-8 flex flex-col gap-8 text-white">
			<BreadCrumb
				routes={[
					{
						name: 'Home',
						url: '/pro',
					},
					{
						name: 'Booking',
						url: '/pro/booking',
					},
				]}
			/>
			<Title kind="h2">{t('your-nexts-appointements')} ({clients.length})</Title>
			<div>
				<button
					className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg text-white"
					onClick={() => exportToCSV()}
				>
					{t('export-appointements-csv')} <FaDownload className="ml-2" />
				</button>
			</div>
			<List items={clients} ListItem={AppointementsItem} sort={(a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()}/>
		</div>
	)
}
