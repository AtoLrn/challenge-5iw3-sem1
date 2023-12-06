import { ActionFunctionArgs, json } from '@remix-run/node'
import { Form, Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { Map, Marker } from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { withDebounce } from 'src/utils/debounce'
import { AddressSearchResult } from './api.address.$search'
import { z } from 'zod'
import { zx } from 'zodix'

const schema = z.object({
	name: z.string(),
	description: z.string(),
	addressId: z.string(),
	seats: z.coerce.number(),
})

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Invite guests | INKIT'
		}
	]
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const { name, description, addressId, seats } = await zx.parseForm(request, schema)
		console.log(name, description, addressId, seats)
	} catch (err) {
		console.log(err)
	} 
	return json({})
}


export default function () {
	const mapRef = useRef<Map>()
	const markerRef = useRef<Marker>()

	const [ isLoading, setLoading ] = useState<boolean>(false)
	const [ searchResults, SetSearchResults ] = useState<Array<AddressSearchResult>>()
	const [ address, setAddress ] = useState<AddressSearchResult>()


	useEffect(() => {
		if (!address) { return }

		const map = mapRef.current

		if (!map) { return }

		markerRef.current?.remove()
		
		const marker = new Marker()

		markerRef.current = marker

		marker.setLngLat([address.x, address.y]).addTo(map)
		map.setCenter([address.x, address.y])
	}, [address])

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Guests',
				url: '/pro/guests'
			}
		]}/>
		<Title kind="h2">Invite Guest</Title>
		<Link to={'/pro/guests'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Return</button>
		</Link>
		<Form method='POST' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>
				<input placeholder='Name' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<div className='relative'>
					<div className='flex flex-col gap-2 absolute w-full h-48'>

						<span className='text-base px-4 py-1 rounded-lg cursor-pointer w-full bg-black bg-opacity-30 text-white border-1 border-transparent hover:border-gray-700 duration-300'>Mathias Campistron</span>
					</div>
				</div>
				<div className='w-full flex flex-col gap-1'>
					<span className='text-sm'>Start date</span>
					<input placeholder='Starting Date' type="date" name='startDate' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				</div>
					
				<div className='w-full flex flex-col gap-1'>
					<span className='text-sm'>End date</span>
					<input placeholder='Starting Date' type="date" name='endDate' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				</div>			</div>
			
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Invite</button>
		</Form>
	</div>
}
