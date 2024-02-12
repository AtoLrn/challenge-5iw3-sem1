import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, MetaFunction, NavLink, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import {getSession} from 'src/session.server'
import {createPost, getPosts} from 'src/utils/requests/post'
import {Post} from 'src/utils/types/post'
import * as Dialog from '@radix-ui/react-dialog'
import {useState} from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import {BreadCrumb} from "../components/Breadcrumb.tsx";

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Posts | INKIT'
		}
	]
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const session = await getSession(request.headers.get('Cookie'))
		const token = session.get('token')

		const formData = await request.formData()

		if (!token) {
			return redirect('/login')
		}

		await createPost(token as string, formData)

		return redirect('/pro/posts?success=true')

	} catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/posts?error=${e.message}`)
		
		return redirect(`/pro/posts?error=${'Unexpected Error'}`)
	}
}


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	const posts = await getPosts(token as string)

	return json({
		posts: posts.reverse(),
		errors: [error],
		success: success
	})
}

export default function () {
	const { t } = useTranslation()
	const { posts, errors, success } = useLoaderData<typeof loader>()

	const [ isDialogOpen, setIsDialogOpen ] = useState(false)

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">

		<BreadCrumb routes={[
			{
				name: t('home'),
				url: '/pro'
			},
			{
				name: t('posts'),
				url: '/pro/posts'
			}
		]} />

		<Title kind="h2">{t('posts')}</Title>

		<Dialog.Root open={isDialogOpen}>
			<Dialog.Trigger asChild>
		        <button onClick={() => setIsDialogOpen(true)} className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('create')}</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-90 z-10 backdrop-blur-sm" />
				<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-50 w-1/4 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
					<Form onSubmit={() => setIsDialogOpen(false)} encType='multipart/form-data' method='POST' className='flex flex-col gap-2'>
						<div className='flex flex-col gap-2'>
							<Title kind={'h2'}>
								{t('add-post')}
							</Title>
						</div>
						<hr className='pb-8' />
						<div className='pb-4 flex items-center gap-2'>
							<input
								type="file"
								name="picture"
								id="picture"
								className="bg-transparent border-b border-white text-white"
								accept="image/png, image/jpeg"
								required
							/>
						</div>
						<div className='flex gap-2 items-center justify-end w-full'>
							<Dialog.Close asChild>
								<button onClick={() => setIsDialogOpen(false)} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('cancel')}</button>
							</Dialog.Close>
							<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('create')}</button>
						</div>
					</Form>
				</Dialog.Content>

			</Dialog.Portal>
		</Dialog.Root>

		{ errors.map((error) => {
			return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		{success ?
			<div className='font-bold text-green-600 border-b border-white self-start'>
				{t('post-created')}
			</div> : null
		}

		<div className='flex flex-row flex-wrap gap-8 overflow-scroll'>

			{posts.length > 0 ?
				posts.map((post: Post) => {
					return (
						<div key={post.id} className='relative h-[200px]'>
							<div className='relative group h-full'>
								<div className='flex flex-col items-center justify-between bg-slate-700 bg-opacity-30 rounded h-full'>
									<img className='p-4 w-full h-full object-cover' src={post.picture} alt={post.picture} />
									{/* Overlay with 50% opacity on hover */}
									<div className='absolute top-0 left-0 w-full h-full rounded bg-black opacity-0 transition-opacity group-hover:opacity-30'></div>
									{/* Hidden delete button initially */}
									<NavLink className="hidden absolute top-2 right-2 px-3 py-3 bg-red-900 rounded-lg text-white group-hover:block" to={`/pro/posts/delete/${post.id}`}>
										<FaTrashAlt />
									</NavLink>
								</div>
							</div>
						</div>
					);
				})
				:
				<p className='opacity-50'>{t('no-post')}</p>
			}


		</div>
	</div>
}

