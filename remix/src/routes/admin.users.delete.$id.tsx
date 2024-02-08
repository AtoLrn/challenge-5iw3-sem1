import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {deleteUser} from 'src/utils/requests/admin/users'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	try {
		if (!params.id) {
			redirect('/admin/users')
		}

		await deleteUser(token as string, params.id as string)

		return redirect('/admin/users')
	} catch(e) {
		if (e instanceof Error)
			return redirect(`/admin/users?error=${e.message}`)

		return redirect(`/admin/users?error${'Unexpected Error'}`)
	}
}
