import { Title } from 'src/components/Title'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { t } from 'i18next'
import { z } from 'zod'
import { zx } from 'zodix'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { sendLink } from 'src/utils/requests/resetPassword'

const schema = z.object({
	email: z.string().min(1),
}) 

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	return json({
		errors: [error],
		success: success
	})
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const body = await zx.parseForm(request, schema)

		await sendLink(body)

		return redirect('/forgot-password?success=true')
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/forgot-password?error=${e.message}`)

		return redirect(`/forgot-password?error=${'Unexpected Error'}`)
	}

}

export default function ForgotPassword() {
	const { errors, success } = useLoaderData<typeof loader>()
	const navigation = useNavigation()
	
	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
						{t('forget-password-title')}
					</Title>
					{/* /PAGE TITLE */}

					{ errors.map((error) => {
						return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
							{error}
						</div>
					})}
					{success ?
						<div className='mb-16 font-bold text-green-600 border-b border-white self-start'>
							{t('send-link-success')}
						</div> : null
					}

					{/* FORGOT PASSWORD FORM */}
					<Form method='POST' className="flex flex-col">
						<div className="flex flex-row gap-4 mb-8">
							<input type="text" required name="email" placeholder="email" className="w-full bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<button type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
							{navigation.state === 'submitting' ? t('loading') : t('reset-password-link')}
						</button>
					</Form>
					{/* /FORGOT PASSWORD FORM */}
				</div>

				<div className="hidden sm:w-full"></div>

			</div>

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg" alt="sign-up background" />
			</div>

			<style>
				{`
                    input[type=checkbox] {
                        position: relative;
                        border: 2px solid white;
                        background: none;
                        outline: 0;
                        height: 20px;
                        width: 20px;
                        -webkit-appearance: none;
                    }
                    
                    input[type=checkbox]:checked {
                        background-color: white;
                    }
                    
                    input[type=checkbox]:checked:before {
                        content: '';
                        position: absolute;
                        right: 50%;
                        top: 50%;
                        width: 4px;
                        height: 10px;
                        border: solid #000;
                        border-width: 0 2px 2px 0;
                        margin: -1px 0 0 -1px;
                        transform: rotate(45deg) translate(-50%, -50%);
                        z-index: 2;
                    }
                `}
			</style>
		</main>
	)
}

