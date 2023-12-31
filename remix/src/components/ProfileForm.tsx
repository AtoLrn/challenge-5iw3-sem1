import { t } from 'i18next'
import { ProfileFormInterface } from 'src/utils/types/profileForm'
import { motion as m } from 'framer-motion'

const ProfileForm: React.FC<ProfileFormInterface> = ({ profile, isEditing, handleSubmit }) => {
	const formClasses = !profile.isProfessional ? 'lg:w-1/4 md:w-1/3 user-sidebar md:absolute md:top-0 md:left-[22.5rem]' : ''
	const slideInFromLeft = {
		hidden: { x: '-100%' },
		visible: { 
			x: 0,
			transition: { duration: .5, ease: 'easeOut' }
		}
	}
	const slideInFromTop = {
		hidden: { y: '-100%' },
		visible: { 
			y: 0,
			transition: { duration: .5, ease: 'easeOut' }
		}
	}
	const slideOutToLeft = {
		hidden: { 
			x: -100,
			transition: { duration: .5, ease: 'easeOut' }
		}
	}
	const slideOutToTop = {
		hidden: { 
			y: -100,
			transition: { duration: .5, ease: 'easeOut' }
		}
	}
	const animationClasses = isEditing ? (profile.isProfessional ? slideInFromTop : slideInFromLeft) : (profile.isProfessional ? slideOutToLeft : slideOutToTop)
	return (
		<m.form
			className={`bg-neutral-800 p-5 text-white shadow-lg w-full z-10 ${formClasses}`}
			onSubmit={handleSubmit}
			initial="hidden"
			animate="visible"
			custom={profile.isProfessional ? 0 : 1}
			variants={animationClasses}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label htmlFor="username">{t('username')}</label>
					<input
						type="text"
						name="username"
						id="username"
						placeholder="John Doe"
						className="bg-transparent border-b border-white text-white"
						defaultValue={profile.username}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="email">{t('email')}</label>
					<input
						type="email"
						name="email"
						id="email"
						placeholder="test@test.com"
						className="bg-transparent border-b border-white text-white"
						defaultValue={profile.email}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="password">{t('password')}</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="********"
						className="bg-transparent border-b border-white text-white"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="confirm-password">{t('confirm-password')}</label>
					<input
						type="password"
						name="confirm-password"
						id="confirm-password"
						placeholder="********"
						className="bg-transparent border-b border-white text-white"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="avatar">{t('avatar')}</label>
					<input
						type="file"
						name="avatar"
						id="avatar"
						className="bg-transparent border-b border-white text-white"
					/>
				</div>
				{profile.isProfessional && (
					<div className="flex flex-col gap-2">
						<label htmlFor="instagram-token">Instagram Token</label>
						<input
							type="text"
							name="instagram-token"
							id="instagram-token"
							placeholder="Instagram Token"
							className="bg-transparent border-b border-white text-white"
							defaultValue={profile.instagramToken}
						/>
					</div>
				)}
			</div>
			<button
				type="submit"
				className="px-4 py-2 rounded-md shadow-md mt-4 bg-red-950 text-white hover:bg-red-900 edit-btn"
			>
				{t('save-changes')}
			</button>
		</m.form>
	)
}

export default ProfileForm
