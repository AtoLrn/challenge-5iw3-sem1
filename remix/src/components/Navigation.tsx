import { useState, useEffect } from 'react';
import { NavLink } from '@remix-run/react';
import { User } from 'src/utils/types/user';

export interface NavigationProps {
  user?: User;
}

export const Navigation: React.FC<NavigationProps> = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // Si scroll vers le bas, cacher la navbar
        setIsVisible(false);
      } else {
        // Si scroll vers le haut, montrer la navbar
        setIsVisible(true);
      }
      // Mise à jour du dernier scroll
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return <nav
      className={`fixed top-0 left-0 w-full text-white backdrop-blur-sm z-50 px-36 py-8 flex items-center justify-between transition-transform duration-300 ${
        !isVisible && '-translate-y-full'
      }`}
    >
		<a href="/" title='Home' aria-label='Home'>
			INKIT
		</a>
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