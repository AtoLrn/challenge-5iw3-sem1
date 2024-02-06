import { Link, MetaFunction } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { Validation } from 'src/utils/types/validation'


export interface Guest {
	id: string,
	avatarUrl: string
	name: string,
	reserved: number
	state: Validation
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Guests | INKIT'
		}
	]
}

export const GuestsItem: React.FC<ListItemProps<Guest>> = ({ item }) => {
	const { t } = useTranslation()

	return <div className='grid grid-cols-6 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.state} />
		</span>
		<span><img src={item.avatarUrl} alt={item.name} className='w-8 h-8 rounded-full' /></span>
		<span>{ item.name }</span>
		<span>{ item.reserved }</span>
		<span>
			<Link to={'/pro/studios/poivre-noir'}>Poivre Noir</Link>
		</span>
		<div className='flex items-center justify-end'>
			<Link to={`/pro/guests/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('view')}</Link>
		</div>
	</div>
}

export default function () {
	const studio: Guest[] = [{
		id: '123',
		name: 'Laink et Terracid',
		avatarUrl: 		'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
		reserved: 3,
		state: Validation.PENDING
	},
	{
		id: '1233',
		name: 'Erromis',
		avatarUrl: 		'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
		reserved: 3,
		state: Validation.ACCEPTED
	},
	{
		id: '1255',
		name: 'Izia',
		avatarUrl: 		'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
		reserved: 3,
		state: Validation.REFUSED
	}]
	

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Guests',
				url: '/pro/guests'
			}
		]}/>
		<Title kind="h2">Guests</Title>
		<Link to={'/pro/guests/invite'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Invite</button>
		</Link>
		<List items={studio} ListItem={GuestsItem} />
		<hr className='w-full opacity-30'/>
		<Title kind="h3">Your requests</Title>

		<List items={studio} ListItem={GuestsItem} />

	</div>
}

