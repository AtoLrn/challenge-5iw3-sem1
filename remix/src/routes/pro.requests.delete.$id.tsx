import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {deletePreBook} from 'src/utils/requests/pre-book'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	try {
		if (!params.id) {
			redirect('/pro/requests')
		}

		await deletePreBook(token as string, params.id as string)

		return redirect('/pro/requests')
	} catch(e) {
		if (e instanceof Error)
			return redirect(`/pro/requests?error=${e.message}`)

		return redirect(`/pro/requests?error${'Unexpected Error'}`)
	}
}
