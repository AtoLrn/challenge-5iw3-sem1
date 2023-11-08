import { MetaFunction } from '@remix-run/react'
import { Title } from 'src/components/Title'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Dashboard'
		}
	]
}

export default function () {
	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<Title kind="h2">Posts</Title>
		<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Create</button>
	</div>
}

