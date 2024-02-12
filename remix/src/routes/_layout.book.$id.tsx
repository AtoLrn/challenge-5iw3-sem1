import * as ToggleGroup from '@radix-ui/react-toggle-group'
import * as Accordion from '@radix-ui/react-accordion'

import {useLoaderData} from '@remix-run/react'
import {getSession} from 'src/session.server'
import {LoaderFunctionArgs, json, redirect} from '@remix-run/node'

import {useTranslation} from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { Marker, Map } from 'mapbox-gl'
import { Title } from 'src/components/Title'
import { FaArrowDown } from 'react-icons/fa6'

import { motion as m } from 'framer-motion'
import { TimePicker, TimePickerKind } from 'src/components/Calendar'

export function meta() {
	return [
		{
			title: 'Messages | INKIT',
		},
	]
}

const TMP = [
	'2.153661,48.996369',
	'2.382394,48.845925',
	'2.389355,48.848898'
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

	const studios = await Promise.all(TMP.map(async (place) => {
		const req = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?proximity=ip&access_token=${process.env.MAP_BOX_TOKEN}`)

		const results = await req.json()

		const [ location ] = results.features

		return {
			address: location.place_name as string,
			id: location.id as string,
			x: location.center[0] as string,
			y: location.center[1] as string
		}
	}))


	return json({ accessToken: process.env.MAP_BOX_TOKEN, studios })
}

export default function () {
	const { accessToken, studios } = useLoaderData<typeof loader>()
	const [ openedModal, setOpenedModal ] = useState('studioSelection')
	
	const [ selectedStudio, setSelectedStudio ] = useState<string>()
	const map = useRef<Map>()
	const { t } = useTranslation()

	useEffect(() => {
		if (accessToken && openedModal === 'studioSelection') {

			map.current = new Map({
				accessToken,
				container: 'map',
				center: [2.333333, 48.866667], // [lng, lat]
				zoom: 8,
				style: 'mapbox://styles/atolrn/clopw3ubf00j401nzaayg87wt',		
			})
				

			for (const coordinate of studios) {
				const marker = new Marker()
				marker.getElement().addEventListener('click', (x) => {
					setSelectedStudio(coordinate.id)
				})
				
				marker.setLngLat([+coordinate.x, +coordinate.y]).addTo(map.current)
			}
		}
	}, [ openedModal ])

	useEffect(() => {
		const studio = studios.find(({ id }) => id === selectedStudio)

		if (!studio) {
			return 
		}

		map.current?.setCenter([+studio.x, +studio.y]).setZoom(13)

	}, [ selectedStudio ])

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4 pt-32'>
			<div className='flex flex-col gap-4 container mx-auto'>
				<Title kind='h1'>You are about to book your project !</Title>
				<hr className='w-full' />

				<Accordion.Root className="w-full flex flex-col gap-2" type="single" value={openedModal} onValueChange={(modal) => setOpenedModal(modal)} collapsible>
					<Accordion.Item value="studioSelection">
						<Accordion.Trigger className='w-full rounded-md border-2 flex px-4 py-2 justify-between items-center'>
							<Title kind='h3'>Please choose the place you want to be tattooed</Title>
							<FaArrowDown size={32} />
						</Accordion.Trigger>
						<Accordion.Content >
							<m.div 
								initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '500px'}} exit={{ opacity: 0, height: 0 }} 
								className='flex w-full gap-4 mt-2 p-8 bg-black bg-opacity-20 backdrop-blur-xl rounded-md'>
								<div  className='flex-1'>
									<ToggleGroup.Root
										className="flex flex-col gap-4 w-full overflow-scroll"
										type="single"
										defaultValue="center"
										aria-label="Studio"
										value={selectedStudio}
										onValueChange={(value) => {
											setSelectedStudio(value)
										}}
									>
										{ studios.map((studio) => {
											return <ToggleGroup.Item key={studio.id} className="w-full border rounded-md px-4 py-2 flex flex-col gap-2 justify-start items-start data-[state=on]:border-red-700" value={studio.id} aria-label="Left aligned">
												<h1 className='font-bold uppercase'>
													{ studio.id }
												</h1>
												<span>
													{ studio.address }
												</span>
											</ToggleGroup.Item>
										}) }
							
							
							
									</ToggleGroup.Root>

								</div>
								<section id='map' className='flex-1 h-96 rounded-md overflow-hidden'></section>
							</m.div>
						</Accordion.Content>

					</Accordion.Item>

					<Accordion.Item value="timeSelection">
						<Accordion.Trigger className='w-full rounded-md border-2 flex px-4 py-2 justify-between items-center'>
							<Title kind='h3'>Please choose the schedule</Title>
							<FaArrowDown size={32} />
						</Accordion.Trigger>
						<Accordion.Content >
							<m.div 
								initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '500px'}} exit={{ opacity: 0, height: 0 }} 
								className='flex w-full gap-4 mt-2 p-8 bg-black bg-opacity-20 backdrop-blur-xl rounded-md'>
								<div  className='flex-1'>
									<TimePicker kind={TimePickerKind.SLOT} slots={[ new Date()]} />

								</div>
							</m.div>
						</Accordion.Content>
					</Accordion.Item>

					<Accordion.Item value="description">
						<Accordion.Trigger className='w-full rounded-md border-2 flex px-4 py-2 justify-between items-center'>Can it be animated?</Accordion.Trigger>
						<Accordion.Content className="Accordion.Content">
							<div className="Accordion.ContentText">
          Yes! You can animate the Accordion with CSS or JavaScript.
							</div>
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>

				
				

			</div>
		</main>
	)
}



