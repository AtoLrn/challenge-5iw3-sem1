import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import { getPartnerShip } from 'src/utils/requests/partnership'
import { PartnerShip } from 'src/utils/types/partnership'
import { Validation } from 'src/utils/types/validation'


export interface Studio {
	id: string,
	title: string,
	description: string
	seats: number
	available: number
	state: Validation
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Invitations | INKIT'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}

	return json({
		partnerships: await getPartnerShip({ token })
	})
}

export const InvitationItem: React.FC<ListItemProps<PartnerShip>> = ({ item }) => {
	return <div className='grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.status} />
		</span>
		<span>{ item.studio.name }</span>
		<span className='text-right col-span-2 flex gap-2 justify-center items-center'>
			<b>
				{item.startDate.getDate().toString().padStart(2, '0')}-${(item.startDate.getMonth() + 1).toString().padStart(2, '0')}-${item.startDate.getFullYear()}
			</b>
			<span>
				to
			</span>
			<b>
				{item.endDate.getDate().toString().padStart(2, '0')}-${(item.endDate.getMonth() + 1).toString().padStart(2, '0')}-${item.endDate.getFullYear()}
			</b>
		</span>
		{ item.status === Validation.PENDING ? <div className='flex items-center gap-2 justify-end'>
			<Link to={`/pro/invitations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Accepter</Link>
			<Link to={`/pro/invitations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Refuser</Link>
		</div> : <div className='flex items-center gap-2 justify-end'>
		</div>}
		
	</div>
}


export default function () {
	const { partnerships } = useLoaderData<typeof loader>()
	const { t } = useTranslation()


	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Invitations',
				url: '/pro/invitations'
			}
		]}/>
		<Title kind="h2">{t('invitations')}</Title>
		<Link to={'/pro/invitations/request'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('new-request')}</button>
		</Link>
		<List items={partnerships} ListItem={InvitationItem} />
	</div>
}

