import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import { verify } from 'src/utils/requests/verify'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const token = url.searchParams.get('token')

	try {
		await verify(token as string)

		return json({
			errors: [],
			success: true
		})
	} catch (e) {
		if (e instanceof Error)
			return json({
				errors: [e.message],
				success: false
			})

		return json({
			errors: ['Unexpected Error'],
			success: false
		})
	}

}

export default function Verify() {
	const { errors, success } = useLoaderData<typeof loader>()
	const { t } = useTranslation()

	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
						{t('email-verify')}
					</Title>
					{/* /PAGE TITLE */}

					{ errors.map((error) => {
						return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
							{error}
						</div>
					})}
					{success ?
						<div className='mb-16 font-bold text-green-600 border-b border-white self-start'>
							{t('email-verified')}
						</div> : null
					}

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

