import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { FaDownload } from 'react-icons/fa6'
import { format, isBefore } from 'date-fns'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { BreadCrumb } from 'src/components/Breadcrumb'
import * as Dialog from '@radix-ui/react-dialog'
import {useTranslation} from 'react-i18next'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { getSession } from 'src/session.server'
import { getProBookings } from 'src/utils/requests/booking'

export const meta: MetaFunction = () => {
	const { t } = useTranslation()
	
	return [
		{
			title: t('booking-title'),
			description: t('booking-page'),
		},
	]
}

interface AppointementsItemProps {
	username: string,
	picture: string,
	date: Date
	duration: string,
	studioName: string
	studioCoordinate: string 
}

export const AppointementsItem: React.FC<ListItemProps<AppointementsItemProps>> = ({ item }) => {
	const { t } = useTranslation()

	return (
		<div className="grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center">
			<span className="flex items-center">
				<img
					src={item.picture}
					alt={item.username}
					className="w-8 h-8 rounded-full mr-2"
				/>
				{item.username}
			</span>
			<span>{format(item.date, 'yyyy-MM-dd  hh:mm aa')}</span>
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
						<h1 className='font-title text-xl font-bold'>{item.username}</h1>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('client')}</span>
								<span>{item.username}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('date')}</span>
								<span>{format(item.date, 'yyyy-MM-dd  hh:mm aa')}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('duration')}</span>
								<span>{item.duration}</span>
							</div>
							<div className='flex flex-col gap-2'>
								<span className='font-bold'>{t('location')}</span>
								<Link to={`https://www.google.com/maps/search/?api=1&query=${item.studioCoordinate}`} target='_blank' rel='noopener noreferrer' className="underline">{item.studioName}</Link>
							</div>
						</div>
						<div className={'w-full flex items-center gap-4 justify-between'}>			
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

	const appointements = await getProBookings({ token })

	return json({
		appointements: appointements.filter((appointement) => {
			if (!appointement.time) { return false }
	
			const date = new Date(appointement.time)
	
			const now = new Date()
	
			return isBefore(now, date)
		})
	
	})
}

export default function () {
	const { t } = useTranslation()
	const { appointements } = useLoaderData<typeof loader>()

	return (
		<div className="flex-1 p-8 flex flex-col gap-8 text-white">
			<BreadCrumb
				routes={[
					{
						name: t('home'),
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
				<Link target='_blank' download={true} to={'/pro/booking/download'} className="flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg text-white">
					{t('export-appointements-csv')} <FaDownload className="ml-2" />
				</Link>
			</div>
			<List items={appointements.map<AppointementsItemProps>((appointement) => {
				return {
					username: appointement.requestingUser.username,
					picture: appointement.requestingUser.picture,
					date: new Date(appointement.time ?? ''),
					duration: appointement.duration ?? '1h',
					studioName: appointement.studio?.name ?? '',
					studioCoordinate: appointement.studio?.location ?? ''
				}
			})} ListItem={AppointementsItem} sort={(a, b) => a.date.getTime() - b.date.getTime()}/>
		</div>
	)
}
