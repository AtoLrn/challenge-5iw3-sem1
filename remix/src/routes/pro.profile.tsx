import { MetaFunction, useLoaderData } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Title } from 'src/components/Title'
import { Map, Marker } from 'mapbox-gl'
import { LinksFunction, json } from '@remix-run/node'
import { motion as m } from 'framer-motion'
import { FaArrowRight, FaInstagram, FaPen, FaXmark } from 'react-icons/fa6'
import stylesheet from '../style/profile.css'
import ProfileForm from 'src/components/ProfileForm'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesheet }]
}

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
			date: '20/04/2021',
			time: '14:00',
			client: 'John Doe',
			status: 'Confirmed'
		},
		{
			date: '21/04/2021',
			time: '15:30',
			client: 'Jane Smith',
			status: 'Pending'
		},
		{
			date: '22/04/2021',
			time: '10:00',
			client: 'Alice Johnson',
			status: 'Cancelled'
		},
		{
			date: '23/04/2021',
			time: '16:45',
			client: 'Bob Williams',
			status: 'Cancelled'
		},
		{
			date: '24/04/2021',
			time: '12:30',
			client: 'Emma Davis',
			status: 'Confirmed'
		},
		{
			date: '25/04/2021',
			time: '09:15',
			client: 'Michael Brown',
			status: 'Pending'
		},
		{
			date: '20/04/2021',
			time: '14:00',
			client: 'John Doe',
			status: 'Confirmed'
		},
		{
			date: '20/04/2021',
			time: '14:00',
			client: 'John Doe',
			status: 'Confirmed'
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
	
	const { accessToken } = useLoaderData<typeof loader>()

	useEffect(() => {
		if (accessToken) {
			const map = new Map({
				accessToken,
				container: 'map',
				center: [2.333333, 48.866667], // [lng, lat]
				zoom: 11, 
				style: 'mapbox://styles/atolrn/clopw3ubf00j401nzaayg87wt',		
			})
	
			const marker = new Marker()
	
			marker.setLngLat([2.333333, 48.866667]).addTo(map)
		}
	}, [])

	return (
		<div className="flex-1 p-8 flex flex-col gap-8 text-white">
			<Title kind="h2">Profile</Title>

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
						My Latests appointments
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
										<th className="px-4 py-2 border">Date</th>
										<th className="px-4 py-2 border">Time</th>
										<th className="px-4 py-2 border">Client</th>
										<th className="px-4 py-2 border">Status</th>
									</tr>
								</thead>
								<tbody>
									{appointments.slice(0, 3).map((appointment, index) => (
										<tr key={index}>
											<td className="px-4 py-2 border">{appointment.date}</td>
											<td className="px-4 py-2 border">{appointment.time}</td>
											<td className="px-4 py-2 border">{appointment.client}</td>
											{appointment.status === 'Confirmed' ? (
												<td className="px-4 py-2 border text-green-500">{appointment.status}</td>
											) : appointment.status === 'Pending' ? (
												<td className="px-4 py-2 border text-yellow-500">{appointment.status}</td>
											) : appointment.status === 'Cancelled' ? (
												<td className="px-4 py-2 border text-red-500">{appointment.status}</td>
											) : (
												<td className="px-4 py-2 border">{appointment.status}</td>
											)}
										</tr>
									))}
								</tbody>
							</table>
							{appointments.length > 5 && (
								<a
									href={'/pro/dashboard'}
									title="See all appointments"
									className="bg-red-950 text-white px-4 py-2 rounded-md shadow-md mt-4 hover:bg-red-900 edit-btn"
								>
								See {appointments.length - 3} more <FaArrowRight className="inline-block mb-[.115rem]" />
								</a>
							)}
						</m.div>
					</div>
				</section>
			</div>
		</div>
	)
}

