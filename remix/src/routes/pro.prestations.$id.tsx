import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { t } from 'i18next'
import { useEffect } from 'react'
import { json } from '@remix-run/node'
import { Map, Marker } from 'mapbox-gl'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestations | INKIT'
		}
	]
}

export const loader = () => {
	return json({ accessToken: process.env.MAP_BOX_TOKEN })
}

export default function () {
	const { accessToken } = useLoaderData<typeof loader>()

	const guests = [
		'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
	]

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

	return <div className="flex-1 p-8 flex flex-col items-start gap-4">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Prestations',
				url: '/pro/prestations'
			},{
				name: 'Super tattoo',
				url: '/pro/prestations/super-tattoo'
			}
		]}/>
		<section className='flex items-center justify-between w-full'>
			<Title kind='h1'>Super tattoo</Title>

			<div className='flex items-center gap-2'>
				<Link to={'/pro/prestations/super-tattoo/edit'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Edit</button>
				</Link>
			</div>
			
		</section>
		<hr className='w-full opacity-30'/>
		<Title kind='h3' className='mt-4'>
			{ t('proposed-by') }
		</Title>
		<section className='flex items-center justify-start gap-6'>
			{ guests.map((guest, index) => {
				return  <img key={index} className={ 'rounded-full relative object-cover w-28 h-28 cursor-pointer' } src={guest}/>
			}) }

id: string,
	name: string,
	kind: Kind,
	location: string,
	proposedBy: string,
	picture: string,
	createdAt: string
		</section>
	</div>
}

