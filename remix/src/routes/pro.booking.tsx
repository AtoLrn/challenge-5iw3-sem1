import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { t } from 'i18next'
import { FaCalendarDay, FaDownload, FaGoogle, FaMicrosoft } from 'react-icons/fa6'
import { GetBooking } from 'src/utils/types/booking'
import { Validation } from 'src/utils/types/validation'
import { parseISO, format, isPast } from 'date-fns'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Badge } from 'src/components/Pro/Badge'
import { BreadCrumb } from 'src/components/Breadcrumb'
import * as Dialog from '@radix-ui/react-dialog'
import { createGoogleCalendarLink, createOutlookCalendarLink, exportToICS } from 'src/utils/calendar'
import { useEffect, useState } from 'react'
import {useTranslation} from 'react-i18next'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { getSession } from 'src/session.server'
import { getArtistBookings } from 'src/utils/requests/booking'

export const meta: MetaFunction = () => {
	return [
		{
			title: t('booking-title'),
			description: t('booking-page'),
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}
	
	const appointements = await getArtistBookings({ token })

	return json({
		appointements,
		token
	})
}

export const AppointementsItem: React.FC<ListItemProps<GetBooking>> = ({ item }) => {
	const { t } = useTranslation()
	const [isClientSide, setIsClientSide] = useState(false)

	useEffect(() => {
		setIsClientSide(true)
	}, [])

	return (
		<div className="grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center">
			<span>
				<Badge state={Validation.ACCEPTED} />
			</span>
			<span className="flex items-center">
				<img
					src={item.requestingUser.picture}
					alt={item.requestingUser.username}
					className="w-8 h-8 rounded-full mr-2"
				/>
				{item.requestingUser.username}
			</span>
			<span>{item.description}</span>
			<span>{/*isClientSide ? getAppointmentTime(item) : t('loading')*/}</span>
			<span>{item.duration}</span>
			<Dialog.Root>
				<Dialog.Trigger asChild>
					<button className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>
						{t('view')}
					</button>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
					<Dialog.Content className="flex flex-col items-stretch justify-start gap-8 p-4 z-20 bg-zinc-600 bg-opacity-30 w-96 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
						<h1 className='font-title text-xl font-bold'>{item.description} {t('with')} {item.requestingUser.username}</h1>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('client')}</span>
								<span>{item.requestingUser.username}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('date')}</span>
								<span>{item.time}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('duration')}</span>
								<span>{item.duration}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('location')}</span>
								<Link to={`https://www.google.com/maps/search/?api=1&query=${item.studio?.location}`} target='_blank' rel='noopener noreferrer' className="underline">{item.studio?.name}</Link>
							</div>
						</div>
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
						<Dialog.Close asChild>
							<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('ok')}</button>
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	)
}

export default function () {
	const { appointements } = useLoaderData<typeof loader>();

	console.log(appointements)

	const exportToCSV = () => {
		let csvContent = 'data:text/csv;charset=utf-8,'

		const headers =
      'Username, Description, Prestation Location, Date, Duration, Status\n'
		csvContent += headers

		appointements.forEach((appointement) => {
			const location = appointement.studio?.name?.replace(/,/g, '')
			const row = [
				appointement.requestingUser.username,
				appointement.description,
				location,
				appointement.time,
				appointement.duration,
				appointement.book,
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
	for (let i = 0; i < appointements.length; i++) {
		const clientDate = appointements[i]?.time ?? ''
		if (clientDate && isPast(parseISO(clientDate))) {
			appointements.splice(i, 1)
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
			<Title kind="h2">{t('your-nexts-appointements')} ({appointements.length})</Title>
			<div>
				<button
					className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg text-white"
					onClick={() => exportToCSV()}
				>
					{t('export-appointements-csv')} <FaDownload className="ml-2" />
				</button>
			</div>
			<List items={appointements} ListItem={AppointementsItem} sort={(a, b) => {
				const dateA = a.time ? new Date(a.time) : new Date()
				const dateB = b.time ? new Date(b.time) : new Date()
				return dateA.getTime() - dateB.getTime()
			}} />
		</div>
	)
}
