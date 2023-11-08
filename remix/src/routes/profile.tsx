import { motion as m } from 'framer-motion'
import { FaInstagram, FaPen } from 'react-icons/fa'
import { Title } from 'src/components/Title'

// Type pour les données chargées, modifiez selon vos données de profil réelles
type ProfileData = {
  username: string;
  avatarUrl: string;
  isProfessional: boolean;
  isAdmin: boolean;
  instagramToken: string;
  workingDays: {
    day: string;
    start: string;
    end: string;
  }[];
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
	// Create false data for the profile
	const profile: ProfileData = {
		username: 'John Doe',
		// tattoo artist avatar
		avatarUrl: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
		isProfessional: false,
		isAdmin: false,
		instagramToken: '123456789',
		workingDays: [
			{
				day: 'Monday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Tuesday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Wednesday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Thursday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Friday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Saturday',
				start: '08:00',
				end: '18:00',
			},
			{
				day: 'Sunday',
				start: '08:00',
				end: '18:00',
			},
		],
	}

	// Animation variants for Framer Motion
	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (custom: number) => ({
			opacity: 1,
			y: 0,
			transition: { delay: custom * 0.1 }
		}),
	}

	return (
		<main className="bg-neutral-900 min-h-screen pt-28">
			<div className="container mx-auto flex flex-col md:flex-row gap-10">
				{/* Profile card with glass effect - make this a sidebar on desktop */}
				<m.section
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					custom={0}
					variants={cardVariants}
					className="flex flex-row md:flex-col items-end md:items-center justify-between bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full lg:w-1/4 md:w-1/3 user-sidebar"
				>
					<div className="flex md:flex-col items-center md:space-y-4 md:space-x-0 space-x-4 w-full">
						<img
							src={profile.avatarUrl}
							alt="Profile avatar"
							className="w-20 h-20 md:w-full md:h-full rounded-full md:rounded-md object-cover max-w-xs"
						/>
						<div className='md:flex md:flex-col md:items-center'>
							<Title kind='h1' className='text-xl font-bold text-white'>{profile.username}</Title>
							<p className='md:text-center'>
								{profile.isAdmin ? 'Unlimited Power' : profile.isProfessional ? 'Professional Artist' : 'Tattoo Lover'}
							</p>
							{profile.isProfessional && (
								<a
									href={'https://instagram.com/'}
									target="_blank"
									rel="noopener noreferrer"
									title='Go to Instagram'
									className="instagram-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md md:mt-4 flex items-center mt-4 gap-2"
								>
									<FaInstagram className="text-2xl lg:text-md" />
									<span className="items-center gap-2">
                    Instagram
									</span>
								</a>
							)}
						</div>
					</div>
					<a
						href={'/profile/edit'}
						title='Edit Profile'
						className="edit-btn bg-red-950 text-white px-3 md:px-4 py-3 md:py-2 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
					>
						<FaPen className="text-md" />
						<span className="hidden md:block">
              Edit Profile
						</span>
					</a>
				</m.section>

				<section className="flex-grow">
					{/* Working Days */}
					{profile.isProfessional ? (
						<div>
							<Title kind='h2' className='text-xl font-bold text-white mb-4'>Working Days</Title>
							<m.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								custom={0}
								variants={cardVariants}
								className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg"
							>
								<ul>
									{profile.workingDays.map((workingDay, index) => (
										<li key={index} className="flex justify-between py-1">
											<span>{workingDay.day}</span>
											<span>{workingDay.start} - {workingDay.end}</span>
										</li>
									))}
								</ul>
							</m.div>
						</div>
					) : (
						<div>
							<Title kind='h2' className='text-xl font-bold text-white mb-4'>My Latests appointments</Title>
							<m.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								custom={0}
								variants={cardVariants}
								className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg"
							>
								<p>
                  You don't have any appointments yet.
								</p>
							</m.div>
						</div>
					)}
				</section>
			</div>
		</main>
	)
}
