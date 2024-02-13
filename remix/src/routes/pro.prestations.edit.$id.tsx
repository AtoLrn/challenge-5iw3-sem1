import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { getPrestation, updatePrestation, updatePrestationPicture } from 'src/utils/requests/prestations'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import {useTranslation} from 'react-i18next'
import { Kind } from 'src/utils/types/kind'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Add Prestations | INKIT'
		}
	]
}


export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const id = parseInt(params.id as string)
	if (!id) {
		throw new Response('Not Found', { status: 404 })
	}
	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token') as string
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	let prestationDetails
	if (id) {
		try {
			prestationDetails = await getPrestation(id, token)
		} catch (e) {
			prestationDetails = null
		}
	}

	return json({
		prestation: prestationDetails,
		errors: [error],
		success: success
	})
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const id = parseInt(params.id as string)

	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token') as string
	const prestationData: { name?: string; kind?: Kind } = {
		name: formData.get('name')?.toString() ?? '',
		kind: formData.get('kind')?.toString() as Kind,
	}

	const pictureFile = formData.get('picture')
	if (pictureFile instanceof File) {
		const pictureFormData = new FormData()
		pictureFormData.append('picture', pictureFile)

		try {
			await updatePrestationPicture(id, pictureFormData, token)
		} catch (error) {
			console.error('Failed to update prestation picture:', error)
			return redirect(`/pro/prestations/edit/${id}?error=Failed to update picture`)
		}
	}

	try {
		await updatePrestation(id, prestationData, token)
		return redirect(`/pro/prestations/${id}?success=update`)
	} catch (error) {
		console.error('Failed to update prestation:', error)
		return redirect(`/pro/prestations/edit/${id}?error=Failed to update`)
	}
}

export default function EditPrestationForm() {
	const { errors } = useLoaderData<typeof loader>()
	const { t } = useTranslation()
	const { prestation } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: t('home'),
				url: '/pro'
			},{
				name: 'Prestations',
				url: '/pro/prestations'
			},{
				name: prestation?.name ?? '',
				url: `/pro/prestations/${prestation?.id ?? ''}`
			}
		]}/>
		<Title kind="h2">Prestations</Title>
		<Link to={'/pro/prestations/' + prestation?.id}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Return</button>
		</Link>
		{ errors.map((error) => {
			return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		{prestation?.picture && (
			<div>
				<label>Image actuelle :</label>
				<a href={prestation.picture} target="_blank" rel="noopener noreferrer">
					Voir l'image
				</a>
			</div>
		)}
		<Form method='PATCH' encType='multipart/form-data' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>
				<input placeholder='Name (flash, ...)' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' defaultValue={prestation?.name} />
				<select
					name="kind"
					defaultValue={prestation?.kind}
					className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300'
				>
					<option value="Tattoo">Tattoo</option>
					<option value="Jewelery">Jewelery</option>
					<option value="Barber">Barber</option>
				</select>
				<input type="file" name="picture" className="outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300" />

			</div>

			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Update</button>
		</Form>

	</div>
}

