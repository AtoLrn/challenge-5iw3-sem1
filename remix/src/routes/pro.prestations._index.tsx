import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { t } from 'i18next'
import { json, LoaderFunction } from '@remix-run/node';
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { Kind } from 'src/utils/types/kind'
import { getSession } from 'src/session.server';


export interface Prestation {
	id: string,
	name: string,
	kind: Kind,
	location: string,
	proposedBy: string,
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
		<span className='text-right'>{ item.proposedBy }</span>
		<div className='flex items-center justify-end'>
			<Link to={`/pro/prestations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{ t('view') }</Link>
		</div>	</div>
}

/*
export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get('Cookie'))
	const response = await fetch('https://localhost/prestations/', {
		headers: {
			'Authorization': `Bearer ${session.get('token')}`
		}
	});
	if (!response.ok) {
			throw new Response("Problème lors de la récupération des prestations", {
					status: response.status
			});
	}
	const prestations = await response.json();
	return json(prestations);
};
*/


export default function Prestations() {

	const prestation: Prestation[] = [{
		id: '123',
		name: 'Super tattoo',
		kind: Kind.BARBER,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		proposedBy: 'Antouane',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	},
	{
		id: '1232',
		name: 'Encore un super tattoo',
		kind: Kind.JEWELERY,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		proposedBy: 'Antouane',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	},
	{
		id: '12324',
		name: 'Encore un autre super tattoo',
		kind: Kind.TATTOO,
		location: 'Studio d\'Antouane, 2 rue de la paix, 75000 Paris',
		proposedBy: 'Antouane',
		picture: 'https://picsum.photos/200/300',
		createdAt: '2021-05-01T00:00:00Z'
	}]

	const prestations = useLoaderData<Prestation[]>();

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
		<Link to={'/pro/prestations/add'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('add')}</button>
		</Link>
		<List items={prestation} ListItem={PrestationItem} />
	</div>
}

