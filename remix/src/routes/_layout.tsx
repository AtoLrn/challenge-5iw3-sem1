import {  Outlet, useLoaderData } from '@remix-run/react'
import { Navigation } from 'src/components/Navigation'
import { User } from './../utils/types/user'
import { json } from '@remix-run/node'

export async function loader() {
	const user: User = {
		name: 'Placeholder',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
	}

	return json({ user })
}
export default function() {
	const { user } = useLoaderData<typeof loader>()

	return <>
		<Navigation user={user} />
		<Outlet />
	</>

}