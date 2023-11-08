import { MetaFunction } from '@remix-run/react'
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
			},{
				name: 'Poivre Noir',
				url: '/pro/studios/poivre-noir'
			}
		]}/>
		<Title kind='h1'>Poivre Noir</Title>
	</div>
}

