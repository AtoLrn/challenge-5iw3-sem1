import {  Outlet, useLoaderData } from '@remix-run/react'
import { Navigation } from 'src/components/Navigation'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { getSession } from 'src/session.server'
import { me } from 'src/utils/requests/me'
import { User } from 'src/utils/types/user'
import { Title } from 'src/components/Title'
import { useTranslation } from 'react-i18next'

export interface LoaderReturnType {
	user?: User
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')


	if (!token) {
		return json<LoaderReturnType>({
			user: undefined
		})
	}

	try {
		const user = await me({
			token
		})

		return json<LoaderReturnType>({ user })

	} catch (e) {
		console.log(e)
		return json<LoaderReturnType>({
			user: undefined
		})
	}
}

export default function() {
	const { user } = useLoaderData<typeof loader>()

	return <>
		<Navigation user={user} />
		<Outlet />
	</>

}

export function ErrorBoundary() {
	const { t } = useTranslation()
	
	return  <>
		<Navigation />
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4 justify-center items-center'>
			<Title kind='h2'>{t('looks-you-found-an-error')}</Title>
		</main>

	</>
}