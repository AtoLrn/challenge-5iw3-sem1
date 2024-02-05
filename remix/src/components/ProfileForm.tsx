import { t } from 'i18next'
import { ProfileFormInterface } from 'src/utils/types/profileForm'
import { motion as m } from 'framer-motion'
import {Form} from '@remix-run/react'
import {useState} from 'react'

const ProfileForm: React.FC<ProfileFormInterface> = ({ profile, isEditing, errors, success }) => {
	const [ password, setPassword ] = useState('')
	const [ passwordConfirmation, setPasswordConfirmation ] = useState('')

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
		<m.div
			className={`bg-neutral-800 p-5 text-white shadow-lg w-full z-10 ${formClasses}`}
			initial="hidden"
			animate="visible"
			custom={profile.isProfessional ? 0 : 1}
			variants={animationClasses}
		>
			<div className="flex flex-col gap-4">
                { errors.map((error) => {
                    return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
                        {error}
                    </div>
                })}
                {success ?
                    <div className='font-bold text-green-600 border-b border-white self-start'>
                        {t('update-profil-success')}
                    </div> : null
                }
                <Form method='POST'>
                    <input value="update-info" name="request-type" readOnly hidden />
                    <div className="mb-4 flex flex-col gap-2">
                        <label htmlFor="username">{t('username')}</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="John Doe"
                            className="bg-transparent border-b border-white text-white"
                            defaultValue={profile.name}
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
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md shadow-md mt-4 bg-red-950 text-white hover:bg-red-900 edit-btn"
                    >
                        {t('save-changes')}
                    </button>
                </Form>
                <Form method='POST' className='mt-6'>
                    <input value="update-password" name="request-type" readOnly hidden />
                    <div className="mb-4 flex flex-col gap-2">
                        <label htmlFor="password">{t('current-password')}</label>
                        <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            placeholder="********"
                            className="bg-transparent border-b border-white text-white"
                        />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <label htmlFor="password">{t('new-password')}</label>
                        <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            placeholder="********"
                            className="bg-transparent border-b border-white text-white"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </div>
                    <div className="mb-4 flex flex-col gap-2">
                        <label htmlFor="confirm-password">{t('confirm-password')}</label>
                        <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            placeholder="********"
                            className="bg-transparent border-b border-white text-white"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.currentTarget.value)}
                        />
                    </div>
                    { password !== passwordConfirmation && 
                    
                    <div className="flex flex-row gap-4 mb-2 font-bold text-red-600 border-b border-white self-start">
                        {t('no-match')}
                    </div>
                    }
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md shadow-md mt-4 bg-red-950 text-white hover:bg-red-900 edit-btn"
                        disabled={password !== passwordConfirmation}
                    >
                        {t('update-password')}
                    </button>
                </Form>
                <Form method='POST' encType='multipart/form-data' className='mt-6'>
                    <input value="update-picture" name="request-type" readOnly hidden />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="avatar">{t('avatar')}</label>
                        <input
                            type="file"
                            name="profilePictureFile"
                            id="avatar"
                            className="bg-transparent border-b border-white text-white"
                            accept="image/png, image/jpeg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-md shadow-md mt-4 bg-red-950 text-white hover:bg-red-900 edit-btn"
                    >
                        {t('update-profil-picture')}
                    </button>
                </Form>
			</div>
		</m.div>
	)
}

export default ProfileForm
