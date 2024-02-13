import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {deleteFeedback} from 'src/utils/requests/admin/feedbacks'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	try {
		if (!params.id) {
			redirect('/admin/feedbacks')
		}

		await deleteFeedback(token as string, params.id as string)

		return redirect('/admin/feedbacks')
	} catch(e) {
		if (e instanceof Error)
			return redirect(`/admin/feedbacks?error=${e.message}`)

		return redirect(`/admin/feedbacks?error${'Unexpected Error'}`)
	}
}
