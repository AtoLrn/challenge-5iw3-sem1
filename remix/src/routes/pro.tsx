import { Outlet, useLoaderData } from '@remix-run/react'
import { ProNavigation } from './../components/Pro/Navigation'
import { User } from 'src/utils/types/user'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { getSession } from 'src/session.server'
import { me } from 'src/utils/requests/me'
import { Title } from 'src/components/Title'
import { useTranslation } from 'react-i18next'


export interface LoaderReturnType {
	user?: User
}


export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	try {
		const user = await me({
			token
		})

		if (!user.isProfessional) {
			return redirect('/login')
		} else if(!user.isKbisVerified) {
			return redirect(`/login?error=${'You have to wait until an administrator verify your kbis file'}`)
		}

		return json<LoaderReturnType>({ user })

	} catch (e) {
		return redirect('/login')
	}
}

export default function ProLayout () {
	const { user } = useLoaderData<typeof loader>()
	
	return <main className='w-screen h-screen flex gradient-bg relative text-white'>
		<ProNavigation user={user as User}/>
		<Outlet />
	</main>
}

export function ErrorBoundary() {
	const { t } = useTranslation()
	
	return  <main className='w-screen h-screen flex gradient-bg relative text-white'>
		<ProNavigation/>
		<div className='flex-1 flex items-center justify-center '>
			<div className='w-2/3 mx-auto'>

				<Title kind='h2'>{t('looks-you-found-an-error')}</Title>
			</div>
		</div>
	</main>
}