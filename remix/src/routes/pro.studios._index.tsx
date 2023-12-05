import { Link, MetaFunction } from '@remix-run/react'
import { t } from 'i18next'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Studios | INKIT'
		}
	]
}

export default function () {
	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Studios',
				url: '/pro/studios'
			}
		]}/>
		<Title kind="h2">{t('studios')}</Title>
		<Link to={'/pro/studios/poivre-noir'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>{t('add')}</button>
		</Link>
	</div>
}

