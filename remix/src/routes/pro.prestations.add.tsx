import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, MetaFunction, useActionData, useLoaderData } from '@remix-run/react'
import { Map, Marker } from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { withDebounce } from 'src/utils/debounce'
import { AddressSearchResult } from './api.address.$search'
import { z } from 'zod'
import { zx } from 'zodix'

const schema = z.object({
	name: z.string().min(1),
	kind: z.string().min(1),
	location: z.string().min(1),
	proposedBy: z.string().min(1),
	picture: z.string().min(1),
})

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Add Prestations | INKIT'
		}
	]
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const result = await zx.parseFormSafe(request, schema)
		if (!result.success) {
			return json({
				errors:  result.error.formErrors.fieldErrors
			})
		}

		const data = {
			...result.data,
			createdAt: new Date().toISOString()
		};

		const response = await fetch('https://localhost/prestations', {
			method: 'POST',
			headers: {
					'Content-Type': 'application/json',
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
				throw new Error('Network response was not ok');
		}

		return redirect(`/pro/prestations/${result.data.name}`)

	} catch (err) {
		console.log(err)
	} 
	return json({
		errors: {
			server: 'An unknown error occured'
		}
	})
}

export const loader = () => {
	return json({ accessToken: process.env.MAP_BOX_TOKEN })
}

export default function () {
	const mapRef = useRef<Map>()
	const markerRef = useRef<Marker>()

	const actionData = useActionData<typeof action>()
	const { accessToken } = useLoaderData<typeof loader>()

	const [ isLoading, setLoading ] = useState<boolean>(false)
	const [ searchResults, SetSearchResults ] = useState<Array<AddressSearchResult>>()
	const [ address, setAddress ] = useState<AddressSearchResult>()


	const onSeach = useCallback(withDebounce( async (e: React.ChangeEvent<HTMLInputElement>) => {
		const req = await fetch(`/api/address/${e.target.value}`)
		setLoading(false)
		const json = await req.json()
		SetSearchResults(json.locations)
	}, 300), [])

	useEffect(() => {
		SetSearchResults([])
	}, [address])

	useEffect(() => {
		if (accessToken) {
			const map = new Map({
				accessToken,
				container: 'map',
				center: [2.333333, 48.866667], // [lng, lat]
				zoom: 11, 
				style: 'mapbox://styles/atolrn/clopw3ubf00j401nzaayg87wt',		
			})

			mapRef.current = map
		}
	}, [])

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
				name: 'Prestations',
				url: '/pro/prestations'
			}
		]}/>
		<Title kind="h2">Prestations</Title>
		<Link to={'/pro/prestations'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Return</button>
		</Link>
		<div className='w-full flex flex-col gap-2'>
			{ actionData?.errors && Object.entries(actionData.errors).map(([key, value]) => {
				return <div className='w-full'><b>{key}</b>: {value}</div>
			})}
		</div>
		
		<Form method='POST' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>
				<input placeholder='Name' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<select name="kind" className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300'>
					<option value="TATTOO">Tattoo</option>
					<option value="BARBER">Barber</option>
					<option value="JEWELERY">Jewelery</option>
				</select>

				<div className='flex flex-col gap-4 items-stretch max-h-48 relative z-10'>
					<input value={address?.id} placeholder='Location' type="text" name='addressId' className='hidden' />
					<input
						autoComplete='off'
						onChange={(e) => {
							setLoading(true)
							onSeach(e)
						}} placeholder='Location' type="text" name='search'className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					<div className='flex flex-col gap-2 w-full relative top-0 left-0'>
						<div className='absolute flex flex-col gap-2 w-full'>
							{ isLoading ? <span>Loading...</span> : searchResults?.map((result) => {
								return <div className='w-full cursor-pointer flex py-1 px-2 items-center gap-4 bg-black bg-opacity-30 text-white rounded-md justify-center border-1 border-transparent hover:border-gray-700 duration-300' onClick={() => {setAddress(result)}} key={result.id}>{result.name}</div>
							}) }
						</div>
						
					</div>
					
				</div>
				<section id='map' className='h-48 w-full overflow-hidden'></section>
				<input placeholder='Proposed By' type="text" name='proposedBy' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<input placeholder='Picture' type="file" name='picture' accept=".png, .jpg, .jpeg" className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 hover:border-red-400 duration-300' />
				
			</div>
			
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Create</button>
		</Form>
	</div>
}

