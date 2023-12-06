import { Link, MetaFunction } from '@remix-run/react'
import { t } from 'i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
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


export const InvitationItem: React.FC<ListItemProps<Studio>> = ({ item }) => {
	return <div className='grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.state} />
		</span>
		<span>{ item.title }</span>
		<span>{ item.description }</span>
		<span className='text-right col-span-2 flex gap-2 justify-center items-center'>
			<b>
				2023-10-20
			</b>
			<span>
				to
			</span>
			<b>
				2024-10-20
			</b>
		</span>
		<div className='flex items-center gap-2 justify-end'>
			<Link to={`/pro/invitations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Accepter</Link>
			<Link to={`/pro/invitations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>Refuser</Link>

		</div>
	</div>
}


export default function () {
	const studio: Studio[] = [{
		id: '123',
		title: 'Super Studio',
		description: 'Ouga bouga le bon studio',
		seats: 10,
		available: 3,
		state: Validation.ACCEPTED
	},
	{
		id: '1232',
		title: 'Super Studio 2',
		description: 'Ouga bouga le bon studio 2',
		seats: 10,
		available: 3,
		state: Validation.PENDING
	},
	{
		id: '12324',
		title: 'Super Studio 4',
		description: 'Ouga bouga le bon studio 2',
		seats: 10,
		available: 3,
		state: Validation.REFUSED
	}]

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
		<Link to={'/pro/invitations/new'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('new-request')}</button>
		</Link>
		<List items={studio} ListItem={InvitationItem} />
	</div>
}

