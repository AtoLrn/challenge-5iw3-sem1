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
import {getSession} from '../session.server.ts'
import {createStudio} from '../utils/requests/studio.ts'
import {useTranslation} from 'react-i18next'

const schema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	maxCapacity: z.coerce.number(),
	openingTime: z.string().min(1),
	closingTime: z.string().min(1),
	monday: z.string().min(1).optional(),
	tuesday: z.string().min(1).optional(),
	wednesday: z.string().min(1).optional(),
	thursday: z.string().min(1).optional(),
	friday: z.string().min(1).optional(),
	saturday: z.string().min(1).optional(),
	sunday: z.string().min(1).optional()
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
		const fd = await request.formData()

		const picture = fd.get('picture')

		if (!(picture instanceof File) || !picture) {
			json({
				errors: {
					server: 'File isnt the right type'
				}
			})
		}

		const result = await zx.parseFormSafe(fd, schema)
		if (!result.success) {
			return json({
				errors:  result.error.formErrors.fieldErrors
			})
		}


	
		const body = {
			...result.data,
			picture
		}



		// req.picture = fd.get('picture')

		const studio = await createStudio({...body, token })

		return redirect(`/pro/studio/${studio.id}`)

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
	const { t } = useTranslation()

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
		<Title kind="h2">{t('studios')}</Title>
		<Link to={'/pro/studios'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('return')}</button>
		</Link>
		<div className='w-full flex flex-col gap-2'>
			{ actionData?.errors && Object.entries(actionData.errors).map(([key, value]) => {
				return <div className='w-full'><b>{key}</b>: {value}</div>
			})}
		</div>
		
		<Form method='POST' className='w-full gap-4' encType='multipart/form-data'>

			<p className="font-title text-xl mb-4">{t('new-studio-details')}</p>
			<div className='flex w-full gap-8'>

				<div className='flex flex-col w-1/2 gap-4'>
					{/* NAME */}
					<input placeholder={t('studio-name')} type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					{/* /NAME */}

					{/* DESCRIPTION */}
					<input placeholder={t('studio-description')} type="textarea" name='description' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					{/* /DESCRIPTION */}

					{/* MAX CAPACITY */}
					<input placeholder={t('max-nb-employees')} type="number" name='maxCapacity' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
					{/* /MAX CAPACITY */}

					{/* DOCUMENT */}
					<div className="flex flex-col gap-1">
						<label htmlFor='picture' className='text-sm'>{t('picture')}</label>
						<input placeholder='Document' type="file" name='picture' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 hover:border-red-400 duration-300' />
					</div>
					{/* /DOCUMENT */}

					{/* OPENING TIMES */}
					<div className='grid grid-cols-2 gap-2'>
						<div className='w-full flex flex-col gap-1'>
							<span className='text-sm'>{t('opening-time')}</span>
							<input placeholder='Starting Date' type="time" name='openingTime' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
						</div>
						<div className='w-full flex flex-col gap-1'>
							<span className='text-sm'>{t('closing-time')}</span>
							<input placeholder='Starting Date' type="time" name='closingTime' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
						</div>
					</div>
					{/* /OPENING TIMES */}
				</div>

				<div className="flex flex-col w-1/2">
					{/* LOCATION */}
					<div className='flex flex-col gap-4 items-stretch max-h-48 relative z-10'>
						<input value={address?.id} placeholder={t('address')} type="text" name='location' className='hidden' />
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
				</div>


			</div>


			{/* OPENING DAYS */}
			<p className="font-title text-xl mt-8 mb-4">{t('opening-days')}</p>
			<div className='flex items-center gap-2 flex-wrap'>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='monday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('monday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='tuesday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('tuesday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='wednesday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('wednesday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='thursday'  asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('thursday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='friday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('friday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='saturday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('saturday')}</span>
				</Switch.Root>
				<Switch.Root className="Toggle" aria-label="Toggle italic" name='sunday' asChild>
					<span className='duration-300 aria-checked:bg-white aria-checked:text-black aria-checked:border-black border-white cursor-pointer px-4 py-2 bg-black border-1 text-white'>{t('sunday')}</span>
				</Switch.Root>
			</div>
			{/* /OPENING DAYS */}

			<div className="flex mt-4">
				<button className='px-4 py-2 bg-gray-700 rounded-lg text-white ml-auto'>{t('create')}</button>
			</div>
		</Form>
	</div>
}

