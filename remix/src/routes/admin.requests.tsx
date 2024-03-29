import {LoaderFunctionArgs, json} from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import {getSession} from 'src/session.server'
import {getWaitingArtists} from 'src/utils/requests/admin/users'
import {ListItemProps} from 'src/components/Admin/ListItem'
import {ArtistWaiting} from 'src/utils/types/admin/user'
import {BreadCrumb} from 'src/components/Breadcrumb'
import {List} from 'src/components/Admin/List'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Requests'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	const users = await getWaitingArtists(token as string)

	return json({
		users: users,
		errors: [error],
		success: success
	})
}

export const UserItem: React.FC<ListItemProps<ArtistWaiting>> = ({ item }) => {
	const { t } = useTranslation()

	return <div className='flex flex-row justify-between gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<img className="rounded-full" height={32} width={32} src={item.picture}/>
		<span className='flex-1'>{item.username}</span>
		<span className='flex-1'>{item.email}</span>
		<div className='flex items-center justify-end'>
			<Link to={item.kbisFileUrl} target='_blank' className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('file')}</Link>
		</div>
		<div className='flex items-center justify-end'>
			<Link to={`/admin/requests/validate/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1 hover:bg-opacity-30 hover:bg-green-500 hover:border-green-500'>{t('approve')}</Link>
		</div>
	</div>
}

export default function () {
	const { t } = useTranslation()
	const { users, errors, success } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8 overflow-scroll">
		<BreadCrumb routes={[
			{ 
				name: t('home'), 
				url: '/admin' 
			},
			{ 
				name: t('requests'), 
				url: '/admin/requests'
			}
		]}/>
		<Title kind="h2">{t('list-of-requests')}</Title>
		{ errors.map((error) => {
			return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		{success ?
			<div className='font-bold text-green-600 border-b border-white self-start'>
				{t('user-approved')}
			</div> : null
		}

		{users.length > 0 ? 
			<List items={users} ListItem={UserItem} />
			:
			<p>{t('no-request')}</p>
		}
	</div>
}

