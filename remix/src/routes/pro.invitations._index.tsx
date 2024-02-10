import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Link, MetaFunction, useFetcher, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import { asnwerPartnership, getPartnerShip } from 'src/utils/requests/partnership'
import { PartnerShip } from 'src/utils/types/partnership'
import { Validation } from 'src/utils/types/validation'
import { z } from 'zod'
import { zx } from 'zodix'


export interface Studio {
	id: string,
	title: string,
	description: string
	seats: number
	available: number
	state: Validation
}

export const actionSchema = z.object({
	kind: z.string(),
	id: z.string()
})

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}

	const { id, kind } = await zx.parseForm(request, actionSchema)

	if (kind === 'ACCEPT') {
		await asnwerPartnership({
			token,
			status: 'ACCEPTED',
			id
		})
	} else {
		await asnwerPartnership({
			token,
			status: 'DENIED',
			id
		})
	}

	return json({})
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

interface AdditionalProps {
	onConfirm: () => unknown
	onDeny: () => unknown
}

export const InvitationItem: React.FC<ListItemProps<PartnerShip & AdditionalProps>> = ({ item }) => {
	return <div className='grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.status} />
		</span>
		<span>{ item.studio?.name }</span>
		<span className='text-right col-span-2 flex gap-2 justify-center items-center'>
			<b>
				{item.startDate.getDate().toString().padStart(2, '0')}-{(item.startDate.getMonth() + 1).toString().padStart(2, '0')}-{item.startDate.getFullYear()}
			</b>
			<span>
				to
			</span>
			<b>
				{item.endDate.getDate().toString().padStart(2, '0')}-{(item.endDate.getMonth() + 1).toString().padStart(2, '0')}-{item.endDate.getFullYear()}
			</b>
		</span>
		{ item.status === Validation.PENDING ? <div className='flex items-center gap-2 justify-end'>
			<button onClick={item.onConfirm} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Accepter</button>
			<button onClick={item.onDeny} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Refuser</button>
		</div> : <div className='flex items-center gap-2 justify-end'>
		</div>}
		
	</div>
}


export default function () {
	const { partnerships } = useLoaderData<typeof loader>()
	const { t } = useTranslation()

	const fetch  = useFetcher<typeof action>()


	const formattedPartnerShip = partnerships.map<PartnerShip & AdditionalProps>((p) => ({
		...p,
		startDate: new Date(p.startDate),
		endDate: new Date(p.endDate),
		onConfirm: () => {
			fetch.submit({
				kind: 'ACCEPT',
				id: p.id
			}, {
				method: 'POST'
			})
		},
		onDeny: () => {
			fetch.submit({
				kind: 'DENY',
				id: p.id
			}, {
				method: 'POST'
			})
		}
	}))

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
		<List items={formattedPartnerShip} ListItem={InvitationItem} />
	</div>
}

