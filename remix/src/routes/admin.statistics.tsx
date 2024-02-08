import {LoaderFunctionArgs, json} from '@remix-run/node'
import { MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import {getSession} from 'src/session.server'
import {getUsers} from 'src/utils/requests/admin/users'
import {BreadCrumb} from 'src/components/Breadcrumb'
import {StatInfo} from 'src/components/Admin/StatInfo'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Statistics'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	const users = await getUsers(token as string)

	return json({
		users: users,
		errors: [error]
	})
}

export default function () {
	const { t } = useTranslation()
	const { users, errors } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{ 
				name: t('home'), 
				url: '/admin' 
			},
			{ 
				name: t('statistics'), 
				url: '/admin/statistics'
			}
		]}/>
		<Title kind="h2">{t('statistics')}</Title>
		{ errors.map((error) => {
			return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}

		<div className='flex justify-around w-full'>
			<StatInfo
				count={users.length}
				caption={t('user-number')} 
			/>
			<StatInfo
				count={users.filter(user => user.roles.includes('ROLE_PRO')).length}
				caption={t('artist-number')} 
			/>
			<StatInfo
				count={users.filter(user => user.isBanned).length}
				caption={t('banned-number')} 
			/>
		</div>
	</div>
}

