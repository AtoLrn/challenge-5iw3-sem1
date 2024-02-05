import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { LoaderFunction, json } from '@remix-run/node'
import { getPrestation } from 'src/utils/requests/prestations'
import { getSession } from 'src/session.server'
import {useTranslation} from 'react-i18next'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestations | INKIT'
		}
	]
}

export const loader: LoaderFunction = async ({ params, request }) => {
	const id = parseInt(params.id as string)
	if (!id) {
		throw new Response('Not Found', { status: 404 })
	}

	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token') as string

	const prestation = await getPrestation(id, token)

	return json(prestation)
}

export default function Prestation() {
	const { t } = useTranslation()

	const data = useLoaderData()

	return <div className="flex-1 p-8 flex flex-col items-start gap-4">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Prestations',
				url: '/pro/prestations'
			},{
				name: (data as { name: string }).name,
				url: `/pro/prestations/${(data as { id: number }).id}`
			}
		]}/>
		<section className='flex items-center justify-between w-full'>
			<Title kind='h1'>{ (data as { name: string }).name }</Title>

			<div className='flex items-center gap-2'>
				<Link to={'/pro/prestations/super-tattoo/edit'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Edit</button>
				</Link>
			</div>
			
		</section>
		<hr className='w-full opacity-30'/>
		<Title kind='h3' className='mt-4'>
			{ t('kind') }
		</Title>
		<section className='flex items-center justify-start gap-6'>
			<p className='text-2xl'>{ (data as { kind: string }).kind }</p>
		</section>
		{ (data as { picture: string }).picture && (
			<>
				<hr className='mt-8 w-full opacity-30'/>
				<div className='flex flex-col gap-4'>
					<Title kind='h3' className='mt-4'>
						{ t('picture') }
					</Title>
					<img src={ (data as { picture: string }).picture } alt='prestation picture' className='w-full rounded-xl'/>
				</div>
			</>
		)}
	</div>
}
