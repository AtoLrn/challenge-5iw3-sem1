import {LoaderFunctionArgs, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {deletePost} from 'src/utils/requests/post'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

    try {
        if (!params.id) {
            redirect('/pro/posts')
        }

        await deletePost(token as string, params.id as string)

        return redirect('/pro/posts')
    } catch(e) {
        if (e instanceof Error)
            return redirect(`/pro/posts?error=${e.message}`)

        return redirect(`/pro/posts?error${'Unexpected Error'}`)
    }
}
