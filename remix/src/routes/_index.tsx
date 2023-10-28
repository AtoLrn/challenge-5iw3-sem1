import { Form, Link, useFetcher } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { AnimatePresence, motion as m } from 'framer-motion'
import { getPosts } from '../utils/requests/posts'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { withDebounce } from 'src/utils/debounce'
import { useState } from 'react'

export async function loader({ request } : LoaderFunctionArgs) {
	const url = new URL(request.url)
	const search = new URLSearchParams(url.search)
	const title = search.get('title')

	if (!title || typeof title !== 'string') {
		return json({ posts: [] }) 
	}

	return json({ posts: await getPosts({ title }) })
} 

export async function action ({ request }: ActionFunctionArgs) {
	const body = await request.formData()
	const title = body.get('title')

	if (!title || typeof title !== 'string') {
		return redirect('/')
	}

	return redirect(`/search/${encodeURIComponent(title.replaceAll(' ', '-'))}`)
}

export default function MainPage() { 
	const [ isLoading, setLoading ] = useState<boolean>()

	const posts  = useFetcher<typeof loader>()
	
	const debounce = withDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
		const url = new URLSearchParams()
		url.append('title', event.target.value)
		posts.submit(url)
		setLoading(false)
	}, 300)

	const isSearchLoading =  isLoading || posts.state === 'loading'

	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>
			<Title kind="h1" className='z-20 pb-20'>Find Your Tattoo Artist</Title>
			
			<m.div 
				initial={{ opacity: 0, transform: 'translateY(100%)' }}
				animate={{ opacity: 1, transform: 'translateY(0%)' }}
				className='flex items-center flex-col z-20 relative w-1/2'>
				<Form className='flex w-full h-20 items-center gap-8 z-20' method='POST'>
					<input  onChange={(event) => {
						setLoading(true)
						debounce(event)
					}} autoComplete='off' name="title" type="text" className='bg bg-transparent h-16 w-4/5 border-b-2 border-white text-2xl outline-none' placeholder='Search for tattoos, cities, studios & artists'/>
					<button className='border-b-2 h-16 border-white w-1/5 cursor-pointer text-2xl flex  justify-center items-center gap-2' ><span>Search</span> <AiOutlineArrowRight /></button>
				</Form>

				<section className='z-20 w-full flex flex-col items-stretch justify-center gap-1 absolute left-0 top-full'> 
					<AnimatePresence>

						{ posts.data?.posts.slice(1, 5).map((post) => {
							return <m.div 
								initial={{ opacity: 0 }}
								animate= {{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='bg-black bg-opacity-20 backdrop-blur border-2 border-slate-900 rounded-xl w-full  cursor-pointer' key={post.id}>
								<Link to={`/search/${encodeURIComponent(post.title.replaceAll(' ', '-'))}`} className='w-full h-full flex p-2 px-4'>
									{post.title}
								</Link>
							</m.div>
						})}
						{
							isSearchLoading ? <m.div
								initial={{ opacity: 0 }}
								animate= {{ opacity: 1 }}
								exit={{ opacity: 0 }}
								key='loader' className='bg-black bg-opacity-20 backdrop-blur border-2 border-slate-900 rounded-xl w-full p-2 px-4 cursor-pointer flex justify-center'>Loading...</m.div> : <></>
						}
					</AnimatePresence>

				</section>
			</m.div>			

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="" />
			</div>
		</main>
	)
}

