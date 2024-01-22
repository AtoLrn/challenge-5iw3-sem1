import { useState, useEffect } from 'react'
import { NavLink } from '@remix-run/react'
import { User } from 'src/utils/types/user'

export interface NavigationProps {
  user?: User;
}

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
	const [isVisible, setIsVisible] = useState(true)
	const [lastScrollY, setLastScrollY] = useState(0)

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
					{user ? (
						<>
							<li className="cursor-pointer">
								<NavLink to="/appointments">Appointments</NavLink>
							</li>
							<li className="cursor-pointer">
								<NavLink to="/messages">Messages</NavLink>
							</li>
							<li className="cursor-pointer">
								<NavLink to="/profile">
									<img
										className="rounded-full"
										height={32}
										width={32}
										src={user.avatar}
									/>
								</NavLink>
							</li>
						</>
					) : (
						<>
							<li className="cursor-pointer">
								<NavLink to="/login">Login</NavLink>
							</li>
							<li className="cursor-pointer">
								<NavLink to="/sign-up">Sign-up</NavLink>
							</li>
						</>
					)}
				</ul>
			</div>
		</nav>
	)
}
