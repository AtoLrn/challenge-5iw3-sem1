import { useState, useEffect } from 'react'
import { NavLink } from '@remix-run/react'
import { User } from 'src/utils/types/user'
import * as Popover from '@radix-ui/react-popover'
import { useTranslation } from 'react-i18next'

export interface NavigationProps {
  user?: User;
}

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
	const [isVisible, setIsVisible] = useState(true)
	const [lastScrollY, setLastScrollY] = useState(0)
	const [popOverOpen, setPopOverOpen] = useState(false)

	const { i18n, t } = useTranslation()

	const handleMouseEnter = () => {
		setPopOverOpen(true)
	}

	const handleMouseLeave = () => {
		setPopOverOpen(false)
	}

	const controlNavbar = () => {
		if ('undefined' !== typeof window) {
			if (window.scrollY > lastScrollY) {
				// Hide navbar when scrolling down
				setIsVisible(false)
			} else {
				setIsVisible(true)
			}
			setLastScrollY(window.scrollY)
		}
	}

	const changeLanguage = () => {
		const currentLanguage = i18n.language

		if (currentLanguage === 'en') {
            window.localStorage.setItem('i18nextLng', 'fr')
			i18n.changeLanguage('fr')
		} else if(currentLanguage === 'fr') {
            window.localStorage.setItem('i18nextLng', 'en')
			i18n.changeLanguage('en')
		}
	}

	useEffect(() => {
		if ('undefined' !== typeof window) {
			window.addEventListener('scroll', controlNavbar)

			return () => {
				window.removeEventListener('scroll', controlNavbar)
			}
		}
	}, [lastScrollY])

	return (
		<nav
			className={`fixed top-0 left-0 w-full text-white backdrop-blur-sm z-50 transition-transform duration-300 shadow-md ${
				!isVisible && '-translate-y-full'
			}`}
		>
			<div className="container mx-auto py-8 flex items-center justify-between">
				<a href="/" title="Home" aria-label="Home">
          INKIT
				</a>
				<ul className="flex gap-4 items-center">
                    <li className="cursor-pointer">
                        <img width={16} src={`/images/${i18n.language}-flag.png`} alt="flag" onClick={changeLanguage}/>
                    </li>
					{user ? (
						<>

							{ user.isProfessional && <li className="cursor-pointer">
								<NavLink to="/pro">Dashboard</NavLink>
							</li> }
							
							<li className="cursor-pointer">
								<NavLink to="/appointments">{t('appointments')}</NavLink>
							</li>
							<li className="cursor-pointer">
								<NavLink to="/messages">Messages</NavLink>
							</li>
							<li className="cursor-pointer">
								<Popover.Root open={popOverOpen} onOpenChange={setPopOverOpen}>
									<Popover.Trigger 
										onMouseEnter={handleMouseEnter}
										asChild
									>
										<NavLink to="/profile">
											<img
												className="rounded-full"
												height={32}
												width={32}
												src={user.avatar}
											/>
										</NavLink>
									</Popover.Trigger>
									<Popover.Portal>
										<Popover.Content 
											className='z-50'
											onMouseLeave={handleMouseLeave}
										>
											<div className='border mt-4 px-4 py-2 rounded-md shadow bg-black'>
								            <NavLink className="text-white" to="/logout">{t('logout')}</NavLink>
											</div>
										</Popover.Content>
									</Popover.Portal>
								</Popover.Root>
							</li>
						</>
					) : (
						<>
							<li className="cursor-pointer">
								<NavLink to="/login">{t('login')}</NavLink>
							</li>
							<li className="cursor-pointer">
								<NavLink to="/sign-up">{t('sign-up')}</NavLink>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	)
}
