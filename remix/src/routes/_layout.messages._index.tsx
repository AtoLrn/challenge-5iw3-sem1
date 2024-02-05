import { Title } from 'src/components/Title'
import {useLoaderData} from '@remix-run/react'
import { t } from 'i18next'
import { MessageSide } from 'src/components/Messages/MessageSide'
import {getSession} from 'src/session.server'
import {LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import {getChannels} from 'src/utils/requests/channel'
import {GetChannelAs} from 'src/utils/types/channel'


export function meta() {
	return [
		{
			title: 'Messages | INKIT',
		},
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	try {
		const channels = await getChannels(token, GetChannelAs.requestingUser)
        
	    return json({
			channels,
			errors: [error]
		})
	} catch (e) {
		if (e instanceof Error)
		    return redirect(`/messages?error${e.message}`)

		return redirect(`/messages?error${'Unexpected Error'}`)
	}
}

export default function () {
	const { channels, errors } = useLoaderData<typeof loader>()

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<div className="flex divide-x divide-white h-[88vh] mt-auto">

				<MessageSide channels={channels} />
				<div className="w-2/3 h-full">

					<div className="flex flex-col items-center justify-center h-full">
						<Title kind={'h2'}>{t('choose-artist-to-chat')}</Title>
						{ errors.map((error) => {
							return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
								{error}
							</div>
						})}
					</div>

				</div>

			</div>

		</main>
	)
}



