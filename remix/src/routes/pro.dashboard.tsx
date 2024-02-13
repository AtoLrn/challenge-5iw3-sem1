import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { useEffect } from 'react'
import { Title } from 'src/components/Title'
import { Map, Marker } from 'mapbox-gl'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import {useTranslation} from 'react-i18next'
import { getSession } from 'src/session.server'
import { getArtistBookings } from 'src/utils/requests/booking'
import { format, parseISO } from 'date-fns'
import BookingCountdown from 'src/components/Pro/BookingCountdown'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Dashboard'
		}
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
		accessToken: process.env.MAP_BOX_TOKEN,
		appointements,
		token
	})
}

export default function () {
	const { accessToken } = useLoaderData<typeof loader>()
	const { t } = useTranslation()

	const { appointements: clients } = useLoaderData<typeof loader>()

	useEffect(() => {
		if (accessToken) {
			const map = new Map({
				accessToken,
				container: 'map',
				center: [2.333333, 48.866667], // [lng, lat]
				zoom: 11, 
				style: 'mapbox://styles/atolrn/clopw3ubf00j401nzaayg87wt',		
			})
	
			const marker = new Marker()
	
			marker.setLngLat([2.333333, 48.866667]).addTo(map)
		}
	}, [])

	return <div className="flex-1 p-8 flex flex-col gap-8 text-white">
		<Title kind="h2">{t('dashboard')}</Title>
		<div className='flex w-full space-between gap-4'>
			<section id='map' className='w-4/5 h-96 rounded-md overflow-hidden'></section>
			<section className='flex flex-col gap-4 items-center w-1/5 bg-zinc-950 p-4 rounded-md'>
				<span className='font-bold'>{t('your-nexts-appointements')}</span>
				{ clients.filter(client => client.time && new Date(client.time) > new Date()).slice(0, 4).map((client, index) => {
					let date
					if (client.time) {
						date = format(parseISO(client.time), 'dd/MM/yyyy HH:mm')
					}
					return (
						<div key={client.id} className='flex w-full p-2 cursor-pointer border-b-1 border-gray-200 border-opacity-30 gap-2'>
							<img key={index} className={ 'rounded-full relative border-2 border-gray-900 object-cover w-8 h-8' } src={client.requestingUser.picture}/>
							<div className='flex flex-col'>
								<span>
									{client.requestingUser.username}
								</span>
								<time dateTime={client.time}>{date}</time>
								{client.time && <BookingCountdown time={client.time} />}
							</div>
						</div>
					)
				}) }
				<Link to={'/pro/booking'} className='px-4 py-2 bg-gray-700 rounded-lg text-white w-full'>{t('go-to-list')}</Link>

			</section>

		</div>
		<section className='flex gap-8'>
			<div className='w-72  bg-zinc-950 rounded-xl shadow-2xl flex flex-col justify-center items-center gap-2 text-white p-4 border-1 border-red-900'>
				<div className='relative flex border-1 border-gray-200 border-opacity-30 rounded-3xl w-full p-1 justify-between items-center'>
					<div className='relative flex'>
						{ clients.filter(client => client.time && new Date(client.time) > new Date()).slice(0, 4).map((client, index) => {
							return  <img key={index}  style={{zIndex: 50 - index}} className={ `rounded-full relative border-2 border-gray-900 -left-${index * 4} object-cover w-8 h-8` } src={client.requestingUser.picture}/>
						}) }
					</div>
					{ clients.filter(client => client.time).length > 4 ? <span className='mr-2 font-bold'>+{clients.filter(client => client.time).length - 4}</span> : <span className='mr-2 font-bold'>+0</span> }
				</div>
			</div>
		</section>
	</div>
}

