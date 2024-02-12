import {LoaderFunctionArgs, json} from '@remix-run/node'
import { Link, MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import {getSession} from 'src/session.server'
import {ListItemProps} from 'src/components/Admin/ListItem'
import {ArtistWaiting} from 'src/utils/types/admin/user'
import {BreadCrumb} from 'src/components/Breadcrumb'
import {List} from 'src/components/Admin/List'
import { getFeedbacks } from 'src/utils/requests/admin/feedbacks'
import { Feedback } from 'src/utils/types/admin/feedback'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'feedbacks'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	const feedbacks = await getFeedbacks(token as string)

	console.log(feedbacks)

	return json({
		feedbacks: feedbacks,
		errors: [error],
		success: success
	})
}

export const FeedbackItem: React.FC<ListItemProps<Feedback>> = ({ item }) => {
	const { t } = useTranslation()

	return <div className='flex flex-row justify-between gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span className='flex-1'>{item.submittedBy.username}</span>
		<span className='flex-1'>{item.prestation.name}</span>
		<div className='flex items-center justify-end'>
			<Link to={`/admin/feedbacks/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1 hover:bg-opacity-30 hover:bg-green-500 hover:border-green-500'>{t('approve')}</Link>
		</div>
	</div>
}

export default function () {
	const { t } = useTranslation()
	const { feedbacks, errors, success } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8 overflow-scroll">
		<BreadCrumb routes={[
			{ 
				name: t('home'), 
				url: '/admin' 
			},
			{ 
				name: t('feedbacks'), 
				url: '/admin/feedbacks'
			}
		]}/>
		<Title kind="h2">{t('list-of-feedbacks')}</Title>
		{errors.map((error, index) => {
			return <p key={index} className='text-red-500'>{error}</p>
		})}

		{success && <p className='text-green-500'>{success}</p>}

		{feedbacks.length > 0 ? 
			<List items={feedbacks} ListItem={FeedbackItem} />
			:
			<p>{t('no-feedback')}</p>
		}
	</div>
}

