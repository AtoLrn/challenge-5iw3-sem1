import { Link, MetaFunction } from '@remix-run/react'
import { t } from 'i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { Validation } from 'src/utils/types/validation'


export interface Prestation {
	id: string,
	name: string,
	kind: Validation,
	location: string,
	proposedBy?: string,
	picture: string,
	createdAt: string
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestations | INKIT'
		}
	]
}


export const PrestationItem: React.FC<ListItemProps<Prestation>> = ({ item }) => {
	return <div className='grid grid-cols-5 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>
			<Badge state={item.kind} />
		</span>
		<span>{ item.name }</span>
		<span>{ item.location }</span>
		<span className='text-right'>{ '3' } / { '10' }</span>
		<div className='flex items-center justify-end'>
			<Link to={`/pro/prestation/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{ t('view') }</Link>
		</div>	</div>
}


export default function () {
	const prestation: Prestation[] = [{
		id: '123',
		name: 'Super tattoo',
		kind: Validation.ACCEPTED,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	},
	{
		id: '1232',
		name: 'Encore un super tattoo',
		kind: Validation.PENDING,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	},
	{
		id: '12324',
		name: 'Encore un autre super tattoo',
		kind: Validation.REFUSED,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	}]

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Prestation',
				url: '/pro/prestation'
			}
		]}/>
		<Title kind="h2">{t('prestation')}</Title>
		<Link to={'/pro/prestation/add'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('add')}</button>
		</Link>
		<List items={prestation} ListItem={PrestationItem} />
	</div>
}

