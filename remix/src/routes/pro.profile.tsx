import { MetaFunction } from '@remix-run/react'
import { useState } from 'react'
import { Title } from 'src/components/Title'
import { json } from '@remix-run/node'
import { motion as m } from 'framer-motion'
import { FaArrowRight, FaInstagram, FaPen, FaXmark } from 'react-icons/fa6'
import ProfileForm from 'src/components/ProfileForm'
import { t } from 'i18next'
import { Validation } from 'src/utils/types/validation'
import { Badge } from 'src/components/Pro/Badge'


type ProfileData = {
  username: string;
  avatarUrl: string;
  email: string;
  isProfessional: boolean;
  isAdmin: boolean;
	instagramToken?: string;
};

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Profile | INKIT',
		}
	]
}

export const loader = () => {
	return json({ accessToken: process.env.MAP_BOX_TOKEN })
}

export default function () {
	const [isEditing, setIsEditing] = useState(false)

	/**
   * @TODO: Fetch user data from the database
   */
	const profile: ProfileData = {
		username: 'Jerry Gollet',
		avatarUrl: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
		isProfessional: true,
		isAdmin: false,
		email: 'test@test.com',
		instagramToken: '1234567890'
	}

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

	const toggleEdit = () => {
		setIsEditing(!isEditing)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		console.log(data)
		setIsEditing(false)
	}
	

	const moreCount = appointments.length - 3

	return (
		<div className="flex-1 p-8 flex flex-col gap-8 text-white">
			<Title kind="h2">{t('profile')}</Title>

			<div className="container mx-auto flex flex-col gap-10 relative">
				{/* Profile card with glass effect - make this a sidebar on desktop */}
				<m.section
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					custom={0}
					variants={cardVariants}
				>
					<div className="flex items-end justify-between bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full z-20 relative">
						<div className="flex items-center space-x-4 w-full">
							<img
								src={profile.avatarUrl}
								alt="Profile avatar"
								className="w-20 h-20 rounded-full object-cover max-w-xs"
							/>
							<div>
								<Title kind="h1" className="text-xl font-bold text-white">
									{profile.username}
								</Title>
								<p>
									{profile.isAdmin
										? 'Unlimited Power'
										: profile.isProfessional && 'Professional Artist'}
								</p>
								<p>
									{profile.email}
								</p>
								{profile.isProfessional && (
									<a
										href={'https://instagram.com/'}
										target="_blank"
										rel="noopener noreferrer"
										title="Go to Instagram"
										className="instagram-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md flex items-center mt-4 gap-2 max-w-[9rem]"
									>
										<FaInstagram className="text-2xl" />
										<span className="items-center gap-2">Instagram</span>
									</a>
								)}
							</div>
						</div>
						<a
							href={'#'}
							title="Edit Profile"
							className="edit-btn bg-red-950 text-white px-3 py-3 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
							onClick={toggleEdit}
						>
							{isEditing ? <FaXmark /> : <FaPen />}
							<span className="hidden">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
						</a>
					</div>
					{isEditing && (
						<ProfileForm profile={profile} isEditing={isEditing} handleSubmit={handleSubmit} />
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

