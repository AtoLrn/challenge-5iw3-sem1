import { Form, Link, MetaFunction, NavLink, useLoaderData } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { motion as m } from 'framer-motion'
import { FaArrowRight, FaPen} from 'react-icons/fa6'
import { Validation } from 'src/utils/types/validation'
import { Badge } from 'src/components/Pro/Badge'
import {useTranslation} from 'react-i18next'
import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import {getSession} from 'src/session.server'
import {me, patchMe} from 'src/utils/requests/me'
import {User} from 'src/utils/types/user'
import {useState} from 'react'
import { z } from 'zod'
import { zx } from 'zodix'

const schema = z.object({
	description: z.string().min(1),
}) 


export const meta: MetaFunction = () => {
	return [
		{
			title: 'Profile | INKIT',
		}
	]
}

export interface LoaderReturnType {
	user: User
    errors: (string | null)[]
    success: string | null
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	try {
		const user = await me({
			token
		})

		return json<LoaderReturnType>({ 
			user,
            errors: [error],
			success: success
		})

	} catch (e) {
		return redirect('/login')
	}
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const session = await getSession(request.headers.get('Cookie'))
    const token = session.get('token')

	try {
		const { description } = await zx.parseForm(request, schema)
        console.log(description)

		if (!token) {
			return redirect('/login')
		}

        await patchMe(token, {
            description
        })

		return redirect('/pro/profile?success=true')
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/profile?error=${e.message}`)

		return redirect(`/pro/profile?error=${'Unexpected Error'}`)
	}

}

export default function () {
	const { t } = useTranslation()
	const { user, errors, success } = useLoaderData<typeof loader>()

    const [ description, setDescription ] = useState(user.description)

	const appointments = [

		{
			date: '25/04/2021',
			time: '09:15',
			client: 'Michael Brown',
			status: Validation.ACCEPTED
		},
		{
			date: '20/04/2021',
			time: '14:00',
			client: 'John Doe',
			status: Validation.ACCEPTED
		},
		{
			date: '20/04/2021',
			time: '14:00',
			client: 'John Doe',
			status: Validation.PENDING
		},
	]

	// Animation variants for Framer Motion
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: custom * 0.1 },
		}),
	}

	const moreCount = appointments.length - 3

	return (
		<div className="flex-1 p-8 flex flex-col gap-8 text-white">
			<Title kind="h2">{t('profile')}</Title>
			<Link to={'/pro/profile/day'}>
				{t('day-off')}
			</Link>

            { errors.map((error) => {
                return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
                    {error}
                </div>
            })}
            {success ?
                <div className='font-bold text-green-600 border-b border-white self-start'>
                    {t('success')}
                </div> : null
            }

			<div className="container overflow-scroll mx-auto flex flex-col gap-10 relative">
				{/* Profile card with glass effect - make this a sidebar on desktop */}
				<m.section
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					custom={0}
					variants={cardVariants}
				>
					<div className="flex flex-col items-end justify-between bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full z-20 relative">
						<div className="flex items-center space-x-4 w-full">
							<img
								src={user.avatar}
								alt="Profile avatar"
								className="w-20 h-20 rounded-full object-cover max-w-xs"
							/>
							<div>
								<Title kind="h1" className="text-xl font-bold text-white">
									{user.name}
								</Title>
								<p>
									{user.email}
								</p>
							</div>
						</div>
                        <div className='w-full my-4'>
                            <Form method='POST' className='flex flex-col items-start'>
                                <label htmlFor="description">{t('introduce-yourself')}</label>
                                <textarea cols={100} rows={8} onChange={(e) => setDescription(e.currentTarget.value)} className='resize-y my-4 bg-transparent border-1 border-white' name='description' id='description' value={description} />
                                <button type="submit" className="edit-btn bg-red-950 text-white px-3 py-3 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center">
                                    {t('update-description')}
                                </button>
                            </Form>
                        </div>
                    	<NavLink
							to={'/profile'}
							className="edit-btn bg-red-950 text-white px-3 py-3 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
						>
							<FaPen />
						</NavLink>
					</div>
				</m.section>

				<section className="flex-grow">
					{/* My latest appointments */}
					<div>
						<Title kind="h2" className="text-xl font-bold text-white mb-4">
							{t('my-latests-appointments')}
						</Title>
						<m.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							custom={0}
							variants={cardVariants}
							className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg"
						>
							<table className="w-full mb-6">
								<thead>
									<tr>
										<th className="px-4 py-2 border">{t('date')}</th>
										<th className="px-4 py-2 border">{t('time')}</th>
										<th className="px-4 py-2 border">{t('client')}</th>
										<th className="px-4 py-2 border">{t('status')}</th>
									</tr>
								</thead>
								<tbody>
									{appointments.slice(0, 3).map((appointment, index) => (
										<tr key={index}>
											<td className="px-4 py-2 border">{appointment.date}</td>
											<td className="px-4 py-2 border">{appointment.time}</td>
											<td className="px-4 py-2 border">{appointment.client}</td>
											<td className="px-4 py-2 border"> <Badge state={appointment.status}/></td>
										</tr>
									))}
								</tbody>
							</table>
							{appointments.length > 5 && (
								<a
									href={'/pro/dashboard'}
									title={t('see-more-appointments')}
									className="bg-red-950 text-white px-4 py-2 rounded-md shadow-md mt-4 hover:bg-red-900 edit-btn"
								>
									{t('see-more-appointments-count', { count: moreCount })} <FaArrowRight className="inline-block mb-[.115rem]" />
								</a>
							)}
						</m.div>
					</div>
				</section>
			</div>
		</div>
	)
}

