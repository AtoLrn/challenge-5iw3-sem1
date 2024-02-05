import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { destroySession, getSession } from 'src/session.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))
	console.log(session.get('token'))

	return redirect('/', {
		headers: {
			'Set-Cookie': await destroySession(session)
		}
	})
}
