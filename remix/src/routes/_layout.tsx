import {  Outlet, useLoaderData } from '@remix-run/react'
import { Navigation } from 'src/components/Navigation'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { getSession } from 'src/session.server'
import { me } from 'src/utils/requests/me'
import { User } from 'src/utils/types/user'

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

	} catch {
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