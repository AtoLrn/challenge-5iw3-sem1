import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData, useNavigation } from '@remix-run/react'
import { t } from 'i18next'
import { Title } from 'src/components/Title'
import { commitSession, getSession } from 'src/session.server'
import { login } from 'src/utils/requests/login'
import { z } from 'zod'
import { zx } from 'zodix'

const schema = z.object({
	email: z.string().min(1),
	password: z.string().min(1)
})

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	return json({
		errors: [error] 
	})
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const session = await getSession(request.headers.get('Cookie'))
		
		const body = await zx.parseForm(request, schema)

		const token = await login(body)

		session.set('token', token)

		return redirect('/', {
			headers: {
				'Set-Cookie': await commitSession(session),
			}
		})

	} catch (e) {
		if (e instanceof Error)
			return redirect(`/login?error=${e.message}`)
		
		return redirect(`/login?error=${'Unexpected Error'}`)
	}
}

export default function MainPage() {
	const { errors } = useLoaderData<typeof loader>()
	const navigation = useNavigation()

	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
						{t('login')}
					</Title>
					{/* /PAGE TITLE */}

					{ errors.map((error) => {
						return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
							{error}
						</div>
					})}

					{/* LOGIN FORM */}
					<Form method='POST' className="flex flex-col">
						<input id="email" type="email" name="email" placeholder="Email Address" className="bg-transparent outline-none border-white border-b hover:border-b-[1.5px] mb-8 placeholder-gray-300 transition ease-in-out duration-300"/>
						<input id="password" type="password" name="password" placeholder="Password" className="bg-transparent outline-none border-white border-b hover:border-b-[1.5px] mb-8 placeholder-gray-300 transition ease-in-out duration-300"/>

						<div className="flex items-center justify-between">
							<button disabled={navigation.state === 'submitting'} type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
								{navigation.state === 'submitting' ? t('loading') : t('login-to-your-account')}
							</button>

							<Link to='/sign-up' className="inline-block align-baseline font-bold text-sm text-gray-300 hover:text-white transition-all">
								{t('forgot-password')}
							</Link>
						</div>
					</Form>
					{/* /LOGIN FORM */}
				</div>

				<div className="hidden sm:w-full"></div>

			</div>

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg" alt="login background" />
			</div>
		</main>
	)
}

