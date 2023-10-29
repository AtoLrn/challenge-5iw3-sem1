import { NavLink } from '@remix-run/react'
import { User } from 'src/utils/types/user'

export interface NavigationProps {
    user?: User
}

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
	return <nav className="absolute top-0 left-0 w-full text-white z-50 px-36 py-8 flex items-center justify-between">
		<h1>INKIT</h1>
		<ul className="flex gap-4 items-center">
			{
				user ? <>
					<li className="cursor-pointer">
						<NavLink to='/appointements'>
                            Appointements
						</NavLink>
					</li>
					<li className="cursor-pointer">
						<NavLink to='/messages'>
                            Messages
						</NavLink>
					</li>
					<li className="cursor-pointer">
						<NavLink to='/profile'>
							<img className="rounded-full" height={32} width={32} src={user.avatar}/>
						</NavLink>
					</li>
				</> : <>
					<li className="cursor-pointer">
						<NavLink to='/login'>
                            Login
						</NavLink>
					</li>
					<li className="cursor-pointer">
						<NavLink to='/sign-up'>
                            Sign-up
						</NavLink>
					</li>
				</>
			}
			
		</ul>
	</nav>
}