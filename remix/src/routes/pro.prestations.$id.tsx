import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { getPrestation } from 'src/utils/requests/prestations'
import { getSession } from 'src/session.server'
import {useTranslation} from 'react-i18next'
import {Prestation} from 'src/utils/types/prestation'
import {Kind} from 'src/utils/types/kind'

export interface LoaderReturnType {
	prestation: Prestation
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestations | INKIT'
		}
	]
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	const id = parseInt(params.id as string)
	if (!id) {
		throw new Response('Not Found', { status: 404 })
	}

	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token') as string

	const prestation = await getPrestation(id, token)

	return json<LoaderReturnType>({
		prestation
	})
}

export default function () {
	const { t } = useTranslation()

	const { prestation } = useLoaderData<typeof loader>()

	const getTranslatedKind = (kind: Kind) => {
		switch (kind) {
		case Kind.TATTOO:
			return t('tattoo')
		case Kind.JEWELERY:
			return t('jewelry')
		case Kind.BARBER:
			return t('barber')
		}
	}

	return <div className="flex-1 p-8 flex flex-col items-start gap-4">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Prestations',
				url: '/pro/prestations'
			},{
				name: prestation.name,
				url: `/pro/prestations/${prestation.id}`
			}
		]}/>
		<section className='flex items-center justify-between w-full'>
			<Title kind='h1'>{ prestation.name }</Title>

			<div className='flex items-center gap-2'>
				<Link to={'/pro/prestations/super-tattoo/edit'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Edit</button>
				</Link>
			</div>
			
		</section>
		<hr className='w-full opacity-30'/>
		<Title kind='h3' className='mt-4'>
			{ t('prestation-type') }
		</Title>
		<section className='flex items-center justify-start gap-6'>
			<p className='text-2xl'>{ getTranslatedKind(prestation.kind) }</p>
		</section>
		{ prestation.picture && (
			<>
				<hr className='mt-8 w-full opacity-30'/>
				<div className='flex flex-col gap-4'>
					<Title kind='h3' className='mt-4'>
						{ t('picture') }
					</Title>
					<img src={ prestation.picture } alt='prestation picture' className='w-full rounded-xl'/>
				</div>
			</>
		)}
	</div>
}
