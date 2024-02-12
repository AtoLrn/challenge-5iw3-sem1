import { Title } from 'src/components/Title'
import { SlStar } from 'react-icons/sl'
import { getArtist } from 'src/utils/requests/artists'
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import {ArtistPostPicture, ArtistPrestation} from 'src/utils/types/artist'
import {useTranslation} from 'react-i18next'
import * as Dialog from '@radix-ui/react-dialog'
import {useState} from 'react'
import {getSession} from 'src/session.server'
import {createPreBook} from 'src/utils/requests/pre-book'
import { z } from 'zod'
import { zx } from 'zodix'

const schema = z.object({
	description: z.string().min(1),
}) 

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Artist'
		}
	]
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const { name } = params

	if (!name) {
		throw new Response(null, {
			status: 404,
			statusText: 'Not Found',
		}) 
	}

	const artist = await getArtist({
		name
	})

	return json({
		artist,
		errors: [error],
		success: success
	})
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}
	if(!params.name) {
		return redirect('/')
	}

	try {
		const { description } = await zx.parseForm(request, schema)

		await createPreBook(token as string, description, params.name as string)

		return redirect(`/artist/${params.name}?success=true`)

	} catch (e) {
		if (e instanceof Error)
			return redirect(`/artist/${params.name}?error=${e.message}`)
		
		return redirect(`/artist/${params.name}?error=${'Unexpected Error'}`)
	}
}


export default function MainPage() {
	const { artist, errors, success } = useLoaderData<typeof loader>()
	const { t } = useTranslation()

	const [ isDialogOpen, setIsDialogOpen ] = useState(false)
	const [ description, setDescription ] = useState('')
	const [ openedPrestationId, setOpenedPrestationId ] = useState<number | null>(null)

	let totalRating = 0
	let reviewCount = 0

	artist.prestations?.forEach((prestation) => {
		if (prestation.feedback && prestation.feedback.length > 0) {
			prestation.feedback.forEach((feedback) => {
				totalRating += feedback.rating
				reviewCount += 1
			})
		}
	})

	const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 'N/A'

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col justify-center items-center gap-4 relative'>
			<div className="container mx-auto flex w-screen min-h-screen pt-20">
				<div className="w-1/3 px-4 pt-16 justify-center">
					<img className='w-full rounded-full aspect-square' src={artist.picture} alt="tattoo artist picture"/>
				</div>
				<div className="w-2/3 p-16">
					<div className="flex flex-col gap-4">
						{ errors.map((error) => {
							return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
								{error}
							</div>
						})}
						{success ?
							<div className='font-bold text-green-600 border-b border-white self-start'>
								{t('pre-book-send')}
							</div> : null
						}
						<div className="flex flex-row justify-between">
							<div>
								<Title kind="h1" className='z-20 pb-2'>{artist.username}</Title>
								{reviewCount !== 0 && (
									<div className="flex gap-2">
										<span className="font-bold">Rating :</span>
										<div className="flex">
											<span>{averageRating} &nbsp;</span>
											<SlStar size={20} />
										</div>
									</div>
								)}
								<div className="flex gap-2">
									<span className="font-bold">Reviews :</span>
									<span>{reviewCount}</span>
								</div>
							</div>
							<div>
								<Dialog.Root open={isDialogOpen}>
									<Dialog.Trigger asChild>
										<button onClick={() => setIsDialogOpen(true)} className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
											{t('make-request')}
										</button>
									</Dialog.Trigger>
									<Dialog.Portal>
										<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
										<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/2 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
											<Form onSubmit={() => setIsDialogOpen(false)} encType='multipart/form-data' method='POST' className='flex flex-col gap-2'>
												<div className='flex flex-col gap-2'>
													<Title kind={'h2'}>
                                                    Description
													</Title>
												</div>
												<hr className='pb-4' />
												<div className='pb-4 flex items-center gap-2'>
								                <textarea cols={70} rows={8} onChange={(e) => setDescription(e.currentTarget.value)} className='resize-y my-4 bg-transparent border-1 border-white' name='description' id='description' value={description} />
												</div>
												<div className='flex gap-2 items-center justify-end w-full'>
													<Dialog.Close asChild>
														<button onClick={() => {
															setIsDialogOpen(false)
															setDescription('')
														}} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('cancel')}</button>
													</Dialog.Close>
													<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('create')}</button>
												</div>
											</Form>
										</Dialog.Content>
									</Dialog.Portal>
								</Dialog.Root>
							</div>
						</div>
						<div>
							{artist.description}
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4 font-title'>Prestations</Title>
							{artist.prestations?.length > 0 ?
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
									{artist.prestations?.map((prestation: ArtistPrestation) => {
										return (
											<Dialog.Root open={openedPrestationId === prestation.id} key={prestation.id}>
												<Dialog.Trigger asChild>
													<button onClick={() => setOpenedPrestationId(prestation.id)} className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
														{prestation.name}
													</button>
												</Dialog.Trigger>
												<Dialog.Portal>
													<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
													<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/2 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white max-h-[75vh] overflow-scroll">
														<Title kind="h4" className='z-20'>{t('name')}</Title>
														<p className='mb-4'>{prestation.name}</p>
														<Title kind="h4" className='z-20'>{t('kind')}</Title>
														<p className='mb-4'>{prestation.kind}</p>
														{ prestation.picture && (
															<>
																<Title kind='h4' className='z-20 pb-1'>{t('picture')}</Title>
																<img src={prestation.picture} className='max-w-full' alt="Prestation Picture" />
															</>
														)}
														{prestation.feedback && prestation.feedback.length > 0 && (
															<Title kind="h4" className='z-20'>{t('rating')}</Title>
														)}
														{prestation.feedback?.map((feedback, index, feedbackArray) => {
															return (
																<div key={feedback.comment} className="flex flex-col gap-2">
																	<div className="flex justify-between gap-2">
																		<span className="font-bold">{feedback.submittedBy.username}</span>
																		<div className="flex">
																			<span>{feedback.rating} &nbsp;</span>
																			<SlStar size={20} />
																		</div>
																	</div>
																	<p>{feedback.comment}</p>
																	{index !== feedbackArray.length - 1 && <hr />}
																</div>
															)
														})}
														<Dialog.Close asChild>
															<button onClick={() => {
																setOpenedPrestationId(null)
																setDescription('')
															}} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('close')}</button>
														</Dialog.Close>
													</Dialog.Content>
												</Dialog.Portal>
											</Dialog.Root>
										)
									})}
								</div>
								:
								<p className='opacity-50'>{t('artist-no-prestation')}</p>
							}
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4'>Portfolio</Title>
							{artist.postPictures?.length > 0 ?
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
									{artist.postPictures?.map((postPicture: ArtistPostPicture) => {
										return <img key={postPicture.picture} src={postPicture.picture} alt={postPicture.picture} className="w-full h-48 object-cover"/>
									})}
								</div>
								:
								<p>{t('artist-no-post')}</p>
							}
						</div>

						{/*
						<form className="max-w-md mx-auto my-8">

							<div className="flex flex-col space-y-4">
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 1
								</label>
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 2
								</label>
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 3
								</label>
							</div>


							<div className="my-4 border-t"></div>


							<label className="block my-4">
								Commentaires :
								<textarea className="w-full h-24 p-2 border" placeholder="Saisissez vos commentaires ici"></textarea>
							</label>


							<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Envoyer</button>
						</form>

						

						<Title kind="h3" className='z-20 pb-4'>Reviews</Title>
							{artist.prestations?.map((prestation) => {
									return prestation.feedback?.map((feedback) => {
											return (
													<div key={feedback.comment} className="flex flex-col gap-2">
															<div className="flex gap-2">
																	<span className="font-bold">Rating :</span>
																	<div className="flex">
																			<span>{feedback.rating} &nbsp;</span>
																			<SlStar size={20} />
																	</div>
															</div>
															<p>
																By : {feedback.submittedBy.username}
															</p>
															<p>
																	{feedback.comment}
															</p>
													</div>
											);
									});
							})}
*/}
					</div>
				</div>
			</div>
		</main>
	)
}

