import { Title } from 'src/components/Title'
import {useLoaderData} from '@remix-run/react'
import {getSession} from 'src/session.server'
import {LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import {getChannels} from 'src/utils/requests/channel'
import {GetChannelAs} from 'src/utils/types/channel'
import {useTranslation} from 'react-i18next'


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
	const { t } = useTranslation()

	return (
		<>

			<div className="flex flex-col items-center justify-center h-full">
				{channels.length > 0 ?
					<Title kind={'h2'}>
						{t('choose-artist-to-chat')}
					</Title>
					:
					<p className='opacity-50'>{t('no-one-to-chat-client')}</p>
				}
				{ errors.map((error) => {
					return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
						{error}
					</div>
				})}
			</div>

		</>
	)
}



