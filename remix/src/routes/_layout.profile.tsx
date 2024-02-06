import { motion as m } from 'framer-motion'
import { FaInstagram, FaPen, FaXmark } from 'react-icons/fa6'
import { Title } from 'src/components/Title'
import { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import stylesheet from '../style/profile.css'
import { useState } from 'react'
import ProfileForm from 'src/components/ProfileForm'
import {getSession} from 'src/session.server'
import {me, patchMe, patchMePassword, updateMePicture} from 'src/utils/requests/me'
import {useLoaderData} from '@remix-run/react'
import {User} from 'src/utils/types/user'
import {useTranslation} from 'react-i18next'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesheet }]
}

export interface LoaderReturnType {
	user: User
    errors: (string | null)[]
    success: string | null
}

export function meta() {
	return [
		{
			title: 'User Profile | INKIT',
			description: 'User profile page',
		},
	]
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
	try {
		const session = await getSession(request.headers.get('Cookie'))
		const token = session.get('token')

		const formData = await request.formData()
		const requestType = formData.get('request-type')

		if (!token) {
			return redirect('/login')
		}

		switch (requestType) {
		case 'update-info':
			const oldUserInfo = await me({
				token
			})

			await patchMe(token, {
				username: formData.get('username') as string,
				email: formData.get('email') as string
			})

			if (oldUserInfo.email !== formData.get('email')){
				return redirect(`/login?error=${'You have updated your email, you need to login again'}`)
			}

			break
		case 'update-password':
			await patchMePassword(token, {
				currentPassword: formData.get('current-password') as string,
				newPassword: formData.get('new-password') as string
			})
			break
		case 'update-picture':
			formData.delete('requestType')
			await updateMePicture(token as string, formData)
			break
		default:
			break
		}

		return redirect('/profile?success=true')

	} catch (e) {
		if (e instanceof Error)
			return redirect(`/profile?error=${e.message}`)
		
		return redirect(`/profile?error=${'Unexpected Error'}`)
	}
}

export default function ProfilePage() {
	const { t } = useTranslation()
	const { user, errors, success } = useLoaderData<typeof loader>()

	const [isEditing, setIsEditing] = useState(false)

	// Animation variants for Framer Motion
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: custom * 0.1 },
		}),
	}

	const toggleEdit = () => {
		setIsEditing(!isEditing)
	}

	return (
		<main className="bg-neutral-900 min-h-screen pt-28">
			<div className="container mx-auto flex flex-col md:flex-row gap-10 relative">
				{/* Profile card with glass effect - make this a sidebar on desktop */}
				<m.section
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					custom={0}
					variants={cardVariants}
				>
					<div className="flex md:flex-col items-end md:items-center justify-between bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full user-sidebar z-20 relative">
						<div className="flex md:flex-col items-center md:space-y-4 md:space-x-0 space-x-4 w-full">
							<img
								src={user.avatar}
								alt="Profile avatar"
								className="w-20 h-20 md:w-full md:h-full rounded-full md:rounded-md object-cover max-w-xs"
							/>
							<div className="md:flex md:flex-col md:items-center">
								<Title kind="h1" className="text-xl font-bold text-white">
									{user.name}
								</Title>
								{user.isProfessional && (
									<a
										href={'https://instagram.com/'}
										target="_blank"
										rel="noopener noreferrer"
										title="Go to Instagram"
										className="instagram-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md md:mt-4 flex items-center mt-4 gap-2"
									>
										<FaInstagram className="text-2xl lg:text-md" />
										<span className="items-center gap-2">Instagram</span>
									</a>
								)}
							</div>
						</div>
						<p
							title="Edit Profile"
							className="cursor-pointer edit-btn bg-red-950 text-white px-3 md:px-4 py-3 md:py-2 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
							onClick={toggleEdit}
						>
							{isEditing ? <FaXmark /> : <FaPen />}
							<span className="hidden md:block">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
						</p>
					</div>
					{isEditing && (
						<ProfileForm profile={user} isEditing={isEditing} errors={errors} success={success} />
					)}
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
							<p>{t('no-appointments-yet.')}</p>
						</m.div>
					</div>
				</section>
			</div>
		</main>
	)
}
