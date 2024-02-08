import { z } from 'zod'
import { zx } from 'zodix'

import { Form, Link, useFetcher } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { AnimatePresence, motion as m } from 'framer-motion'
import { getArtists } from '../utils/requests/artists'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { withDebounce } from 'src/utils/debounce'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { t } from 'i18next'
import { Studio, getStudios } from 'src/utils/requests/studios'
import { Artist } from 'src/utils/types/artist'

const formSchema = z.object({
	title: z.string()
})

export async function loader({ request } : LoaderFunctionArgs) {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)
	const title = search.get('title')

	if (!title || typeof title !== 'string') {
		return json({ artists: [], studios: [] }) 
	}

	return json({ artists: await getArtists({ name: title }), studios: await getStudios({ name: title }) })
} 


export async function action ({ request }: ActionFunctionArgs) {
	try {
		const { title } = await zx.parseForm(request, formSchema)
	
		return redirect(`/search/${encodeURIComponent(title.replaceAll(' ', '-'))}`)
	} catch {
		return json({
			error: 'Something wrong happened in form validation'
		})
	}
}

export function meta() {
	return [
		{
			title: 'INKIT',
			description: t('find-your-tattoo-artist'),
		},
	]
}


const isStudio = (tbd: any): tbd is Studio => {
	return tbd?.id !== undefined
}

const isArtist = (tbd: any): tbd is Artist => {
	return tbd?.username !== undefined
} 

export default function MainPage() { 
	const { t } = useTranslation()
	const [ isLoading, setLoading ] = useState<boolean>()

	const posts  = useFetcher<typeof loader>()
	
	const debounce = useCallback(withDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
		const url = new URLSearchParams()
		url.append('title', event.target.value)
		posts.submit(url)
		setLoading(false)
	}, 300), [])

	const isSearchLoading =  isLoading || posts.state === 'loading'

	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>
			<Title kind="h1" className='z-20 pb-20'>{t('find-your-tattoo-artist')}</Title>
			
			<m.div 
				initial={{ opacity: 0, transform: 'translateY(100%)' }}
				animate={{ opacity: 1, transform: 'translateY(0%)' }}
				className='flex items-center flex-col z-20 relative w-1/2'>
				<Form className='flex w-full h-20 items-center gap-8 z-20' method='POST'>
					<input id='search-bar'  onChange={(event) => {
						setLoading(true)
						debounce(event)
					}} autoComplete='off' name="title" type="text" className='bg bg-transparent h-16 w-4/5 border-b-2 border-white text-2xl outline-none' placeholder={t('search-input-placeholder')}/>
					<button className='border-b-2 h-16 border-white w-1/5 cursor-pointer text-2xl flex  justify-center items-center gap-2' ><span>{t('search')}</span> <AiOutlineArrowRight /></button>
				</Form>

				<section className='z-20 w-full flex flex-col items-stretch justify-center absolute left-0 top-full  backdrop-blur gap-1'> 
					<AnimatePresence mode='popLayout'>
						{ posts.data &&  [...posts.data.artists, ...posts.data.studios].slice(0, 5).map((artist, index, arr) => {
							const interval = 0.05
							const baseIndex = 50

							if (isArtist(artist)) {
								return <m.div 

									style={{ zIndex: baseIndex + index }}
									initial={{ opacity: 0 }}
									animate= {{ opacity: 1, transition: {
										delay: index * interval
									} }}
									exit={{ opacity: 0, translateY: index !== 0 ? '-100%' : '', transition: {
										delay: interval * (arr.length - index) 
									} }}
							
									className='w-full cursor-pointer ' key={artist.id}>
									<Link to={`/artist/${encodeURIComponent(artist.id)}`} className='w-full h-full flex p-2 px-4 items-center gap-4 bg-slate-700 bg-opacity-30 rounded-xl'>
										<img src={artist.picture} alt="" className='rounded-full w-10 h-10' />
										{artist.username}
									</Link>
								</m.div>
							} else {
								return <m.div 

									style={{ zIndex: baseIndex + index }}
									initial={{ opacity: 0 }}
									animate= {{ opacity: 1, transition: {
										delay: index * interval
									} }}
									exit={{ opacity: 0, translateY: index !== 0 ? '-100%' : '', transition: {
										delay: interval * (arr.length - index) 
									} }}
							
									className='w-full cursor-pointer ' key={artist.id}>
									<Link to={`/studio/${encodeURIComponent(artist.name.replaceAll(' ', '-'))}`} className='w-full h-full flex p-2 px-4 items-center gap-4 bg-slate-700 bg-opacity-30 rounded-xl'>
										<img src={artist.name} alt="" className='rounded-full w-10 h-10' />
										{artist.name}
									</Link>
								</m.div>
							}

							
						}) }
						
						{
							(posts.data?.artists.length === 0 && posts.data?.studios.length === 0) && !isSearchLoading ? 
								<m.div
									initial={{ opacity: 0 }}
									animate= {{ opacity: 1 }}
									exit={{ opacity: 0 }}
									key='loader' className='w-full h-full flex p-2 px-4 items-center gap-4 bg-slate-700 bg-opacity-30 rounded-xlflex justify-center'>{t('no-results')}</m.div>
								: <></>
						}
						{
							isSearchLoading ? <m.div
								initial={{ opacity: 0 }}
								animate= {{ opacity: 1 }}
								exit={{ opacity: 0 }}
								key='loader' className='w-full h-full flex p-2 px-4 items-center gap-4 bg-slate-700 bg-opacity-30 rounded-xlflex justify-center'>{t('loading')}</m.div> : <></>
						}
					</AnimatePresence>

				</section>
			</m.div>			

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="" />
			</div>
		</main>
	)
}

