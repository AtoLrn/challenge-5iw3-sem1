import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { t } from 'i18next'
import { json, LoaderFunction } from '@remix-run/node';
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Badge } from 'src/components/Pro/Badge'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server';
import { Prestation } from 'src/utils/types/prestation';
import { getPrestations } from 'src/utils/requests/prestations';

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Prestations | INKIT'
		}
	]
}

export const PrestationItem: React.FC<ListItemProps<Prestation>> = ({ item }) => {
	return <div className='grid grid-cols-5 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
			<span><Badge state={item.kind} /></span>
			<span>{item.name}</span>
			<span>Test</span>
			<span className='text-right'>{item.proposedBy}</span>
			<div className='flex items-center justify-end'>
					<Link to={`/pro/prestations/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('view')}</Link>
			</div>
	</div>;
};

export const loader: LoaderFunction = async ({ request }) => {
	const session = await getSession(request.headers.get('Cookie'));
	const token = session.get('token') as string;
	const prestations = await getPrestations(token);

	return json(prestations);
};

export default function Prestations() {
	const data = useLoaderData();
	const prestations = data as Prestation[];

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
			<BreadCrumb routes={[{ name: 'Home', url: '/pro' }, { name: 'Prestation', url: '/pro/prestation' }]} />
			<Title kind="h2">{t('prestation')}</Title>
			<Link to={'/pro/prestations/add'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('add')}</button>
			</Link>
			<List items={prestations} ListItem={PrestationItem} />
	</div>;
}