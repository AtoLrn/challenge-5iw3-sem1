import { motion as m } from 'framer-motion'
import { FaInstagram, FaPen, FaXmark } from 'react-icons/fa6'
import { Title } from 'src/components/Title'
import { LinksFunction } from '@remix-run/node'
import stylesheet from '../style/profile.css'
import React, { useState } from 'react'
import ProfileForm from 'src/components/ProfileForm'
import { t } from 'i18next'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesheet }]
}

type ProfileData = {
  username: string;
  avatarUrl: string;
  email: string;
  isProfessional: boolean;
  isAdmin: boolean;
};

export function meta() {
	return [
		{
			title: 'User Profile | INKIT',
			description: 'User profile page',
		},
	]
}

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false)

	/**
   * @TODO: Fetch user data from the database
   */
	const profile: ProfileData = {
		username: 'John Doe',
		avatarUrl: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
		isProfessional: false,
		isAdmin: false,
		email: 'test@test.com'
	}

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
								src={profile.avatarUrl}
								alt="Profile avatar"
								className="w-20 h-20 md:w-full md:h-full rounded-full md:rounded-md object-cover max-w-xs"
							/>
							<div className="md:flex md:flex-col md:items-center">
								<Title kind="h1" className="text-xl font-bold text-white">
									{profile.username}
								</Title>
								<p className="md:text-center">
									{profile.isAdmin
										? 'Unlimited Power'
										: profile.isProfessional
											? 'Professional Artist'
											: 'Tattoo Lover'}
								</p>
								{profile.isProfessional && (
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
						<a
							href={'#'}
							title="Edit Profile"
							className="edit-btn bg-red-950 text-white px-3 md:px-4 py-3 md:py-2 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
							onClick={toggleEdit}
						>
							{isEditing ? <FaXmark /> : <FaPen />}
							<span className="hidden md:block">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
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
							<p>{t('no-appointments-yet.')}</p>
						</m.div>
					</div>
				</section>
			</div>
		</main>
	)
}
