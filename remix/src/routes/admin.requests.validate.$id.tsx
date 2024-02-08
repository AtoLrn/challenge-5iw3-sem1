import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {patchUser} from 'src/utils/requests/admin/users'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	try {
		if (!params.id) {
			redirect('/admin/requests')
		}

		await patchUser(token as string, params.id as string, {
			kbisVerified: true
		})

		return redirect('/admin/requests?success=true')
	} catch(e) {
		if (e instanceof Error)
			return redirect(`/admin/requests?error=${e.message}`)

		return redirect(`/admin/requests?error${'Unexpected Error'}`)
	}
}
