import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import { getMyStudios } from 'src/utils/requests/studios'
import { Studio } from 'src/utils/types/studio'


export const meta: MetaFunction = () => {
	return [
		{
			title: 'Studios | INKIT'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}
	
	const studios = await getMyStudios({ 
		token
	})

	return json({
		studios
	})
}

export const StudioItem: React.FC<ListItemProps<Studio>> = ({ item }) => {
	const { t } = useTranslation()

	return <div className='grid grid-cols-5 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.status} />
		</span>
		<span>{ item.name }</span>
		<span>{ item.description }</span>
		<span className='text-right'>{ item.maxCapacity } / { item.maxCapacity }</span>
		<div className='flex items-center justify-end'>
			<Link to={`/pro/studios/${encodeURIComponent(item.id)}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('view')}</Link>
		</div>	</div>
}


export default function () {
	const { studios } = useLoaderData<typeof loader>()
	const { t } = useTranslation()


	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: t('home'),
				url: '/pro'
			},{
				name: 'Studios',
				url: '/pro/studios'
			}
		]}/>
		<Title kind="h2">{t('studios')}</Title>
		<Link to={'/pro/studios/add'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('add')}</button>
		</Link>
		<List items={studios} ListItem={StudioItem} />
	</div>
}

