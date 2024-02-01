import { Form, MetaFunction, useLoaderData, useRevalidator } from '@remix-run/react'
import { Title } from 'src/components/Title'

import { t } from 'i18next'

import { BreadCrumb } from 'src/components/Breadcrumb'
import { TimePicker, TimePickerKind } from 'src/components/Calendar'
import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useState } from 'react'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { WeekViewer } from 'src/components/WeekViewer'
import { z } from 'zod'
import { zx } from 'zodix'
import { createDayOff, deleteDayOff, getDaysOff } from 'src/utils/requests/off-day'
import { getSession } from 'src/session.server'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Off Day | INKIT',
		}
	]
}

const schema = z.object({
	action: z.string().min(1)
})

const schemaCreate = z.object({
	startDate: z.string().min(1),
	endDate: z.string().min(1)
})

const schemaDelete = z.object({
	id: z.string().min(1)
})

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	const { action } = await zx.parseForm(request, schema)

	if (action === 'create') {
		const req = await zx.parseForm(request, schemaCreate)

		const dayOff = await createDayOff({...req, token })

		return json({
			dayOff
		})
	} else {
		const req = await zx.parseForm(request, schemaDelete)

		const success = await deleteDayOff({...req, token })

		return json({
			success
		})
	}

	
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	const daysOff = await getDaysOff({
		token
	})

	return json({
		daysOff
	})
}
export default function () {
	const {revalidate} = useRevalidator()
	const { daysOff } = useLoaderData<typeof loader>()
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()

	const onClick = useCallback(async (id: number) => {

		await fetch('/pro/profile/day', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;',
			},
			body: `action=delete&id=${id}`
		})

		revalidate()
		
	}, [])

	const filteredDaysOff = daysOff.map(({ id, startDate, endDate }) => ({
		id,
		startDate:  new Date(startDate),
		endDate: new Date(endDate),
		action: {
			cta: 'Cancel Day Off',
			onClick: onClick.bind(this, id)
		}
	}))

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			}, {
				name: 'Profile',
				url: '/pro/profile'
			}
		]} />
		<div className='flex flex-col gap-2'>
			<Title kind="h2">Take a day Off</Title>
			<span className='text-gray-400'>Take a day to rest, you earned it :)</span>
		</div>
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>
					{t('add-day-off')}
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
				<Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/4 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
					<Form method='POST' className='flex flex-col gap-2'>

						<div className='flex flex-col gap-2'>
							<Title kind={'h2'}>
								Add a day Off
							</Title>
							<span className='text-gray-400'>
								Please select the range of day you want to take off
							</span>
						</div>
						<hr />
						<div className='flex items-center gap-2'>
							<input type='hidden' name='action' value={'create'} />
							<TimePicker onChange={setStartDate} kind={TimePickerKind.DAY} maxDate={endDate ?? new Date()} name='startDate' />
							<span>To</span>
							<TimePicker onChange={setEndDate} kind={TimePickerKind.DAY} minDate={startDate ?? new Date()} name='endDate' />
						</div>

						{startDate && endDate ?
							<span>You are about to take the day off from <b>{`${startDate.getDate().toString().padStart(2, '0')}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getFullYear()}`}</b> to <b>{`${endDate.getDate().toString().padStart(2, '0')}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getFullYear()}`}</b>
							</span> : <span>
								Please select two dates
							</span>}

						<div className='flex gap-2 items-center justify-end w-full'>
							<Dialog.Close asChild>
								<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('cancel')}</button>
							</Dialog.Close>
							<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('create')}</button>
						</div>
					</Form>

				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>

		<WeekViewer events={[
			...filteredDaysOff
		]} />
	</div>
}

