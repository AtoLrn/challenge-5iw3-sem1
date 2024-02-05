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
import * as Switch from '@radix-ui/react-switch'
import {getSession} from "../session.server.ts";
import {createStudio} from "../utils/requests/studio.ts";

const schema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	maxCapacity: z.coerce.number(),
	openingTime: z.string().min(1),
	closingTime: z.string().min(1),
	monday: z.string().min(1),
	tuesday: z.string().min(1),
	wednesday: z.string().min(1),
	thursday: z.string().min(1),
	friday: z.string().min(1),
	saturday: z.string().min(1),
	sunday: z.string().min(1),
})

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Add Studio | INKIT'
		}
	]
}

export const action = async ({ request }: ActionFunctionArgs) => {

	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	try {
		const result = await zx.parseFormSafe(request, schema)
		if (!result.success) {
			return json({
				errors:  result.error.formErrors.fieldErrors
			})
		}

		const req = await zx.parseForm(request, schema)
		const studio = await createStudio({...req, token })

		return json({
			studio
		})

		/*return redirect(`/pro/studios/${studio.name}`)*/

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
				name: 'Studios',
				url: '/pro/studios'
			}
		]}/>
		<Title kind="h2">Studios</Title>
		<Link to={'/pro/studios'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Return</button>
		</Link>
		<div className='w-full flex flex-col gap-2'>
			{ actionData?.errors && Object.entries(actionData.errors).map(([key, value]) => {
				return <div className='w-full'><b>{key}</b>: {value}</div>
			})}
		</div>
		
		<Form method='POST' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>

				{/* NAME */}
				<input placeholder='Name' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				{/* /NAME */}

				{/* DESCRIPTION */}
				<input placeholder='Description' type="textarea" name='description' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				{/* /DESCRIPTION */}

				{/* LOCATION */}
				<div className='flex flex-col gap-4 items-stretch max-h-48 relative z-10'>
					<input value={address?.id} placeholder='Address' type="text" name='location' className='hidden' />
					<input
						autoComplete='off'
						onChange={(e) => {
							setLoading(true)
							onSeach(e)
						}} placeholder='Address' type="text" name='search'className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					<div className='flex flex-col gap-2 w-full relative top-0 left-0'>
						<div className='absolute flex flex-col gap-2 w-full'>
							{ isLoading ? <span>Loading...</span> : searchResults?.map((result) => {
								return <div className='w-full cursor-pointer flex py-1 px-2 items-center gap-4 bg-black bg-opacity-30 text-white rounded-md justify-center border-1 border-transparent hover:border-gray-700 duration-300' onClick={() => {setAddress(result)}} key={result.id}>{result.name}</div>
							}) }
						</div>
						
					</div>
					
				</div>
				{/* /LOCATION */}

				{/* MAP */}
				<section id='map' className='h-48 w-full overflow-hidden'></section>
				{/* /MAP */}

				{/* MAX CAPACITY */}
				<input placeholder='Number of employees' type="number" name='maxCapacity' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				{/* /MAX CAPACITY */}

				{/* DOCUMENT */}
				<input placeholder='Document' type="file" name='document' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 hover:border-red-400 duration-300' />
				{/* /DOCUMENT */}

				{/* OPENING TIMES */}
				<div className='grid grid-cols-2 gap-2'>
					<div className='w-full flex flex-col gap-1'>
						<span className='text-sm'>Opening Time</span>
						<input placeholder='Starting Date' type="time" name='openingTime' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					</div>
					<div className='w-full flex flex-col gap-1'>
						<span className='text-sm'>Closing Time</span>
						<input placeholder='Starting Date' type="time" name='closingTime' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					</div>
				</div>
				{/* /OPENING TIMES */}

				{/* OPENING DAYS */}
				<div className='flex items-center gap-2 flex-wrap'>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='monday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Monday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='tuesday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Tuesday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='wednesday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Wednesday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='thursday'  asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Thursday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='friday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Friday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='saturday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Saturday</span>
					</Switch.Root>
					<Switch.Root className="Toggle" aria-label="Toggle italic" name='sunday' asChild>
						<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>Sunday</span>
					</Switch.Root>
				</div>
				{/* /OPENING DAYS */}

			</div>
			
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Create</button>
		</Form>
	</div>
}

