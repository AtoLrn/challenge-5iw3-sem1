import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { t } from 'i18next'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { List } from 'src/components/Pro/List'
import { getSession } from 'src/session.server'
import { getChannels } from 'src/utils/requests/channel'
import { Channel, GetChannelAs } from '../utils/types/channel'
import { formatDate } from '../utils/date'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Chat Pro | INKIT'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

    const channels = await getChannels(token, GetChannelAs.tattooArtist)

	return json({
		channels: channels,
        errors: [error]
	})
}

export const ChannelItem: React.FC<ListItemProps<Channel>> = ({ item }) => {
	return <div className='grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>{ item.requestingUser.username }</span>
		<img className={ 'rounded-full relative border-2 border-gray-900 object-cover w-8 h-8' } src={item.requestingUser.picture}/>
		<span className='text-right col-span-2 flex gap-2 justify-center items-center'>
            { item.messages.length > 0 ?
                <i>
                    <b>{ item.messages[item.messages.length - 1]?.content }</b> {formatDate(item.messages[item.messages.length - 1]?.createdAt as string)}
                </i>
                :
                <i>{t('chat-empty-last-message')}</i>
            }
		</span>
		<div className='flex items-center gap-2 justify-end'>
			<Link to={`/pro/chat/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Chat</Link>
		</div>
	</div>
}


export default function () {
	const { channels, errors } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Chat',
				url: '/pro/chat'
			}
		]}/>
        { errors.map((error) => {
            return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
                {error}
            </div>
        })}
		<Title kind="h2">{t('pro-chat-page-title')}</Title>
		<List items={channels} ListItem={ChannelItem} />
	</div>
}

