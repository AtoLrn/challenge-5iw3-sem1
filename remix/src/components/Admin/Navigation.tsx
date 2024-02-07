import { NavLink } from '@remix-run/react'
import {useTranslation} from 'react-i18next'

export const AdminNavigation: React.FC = () => {
	const { i18n, t } = useTranslation()

	const links = [
		{
			name: t('statistics'),
			url: '/admin/statistics'
		},
		{
			name: t('users'),
			url: '/admin/users'
		},
		{
			name: t('requests'),
			url: '/admin/requests'
		},
	]

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

	return <nav className="flex flex-col items-strech justify-between h-full w-64 text-white z-10 bg-opacity-30 bg-zinc-950 shadow-2xl backdrop-blur-3xl">
		<section className="flex flex-col gap-4">
			<div className="w-full h-24 flex items-center justify-center">
				<NavLink to={'/'}><h1 className="text-2xl font-bold text-center tracking-widest">INKIT</h1></NavLink>
			</div>
			<ul className="flex flex-col items-start justify-start px-8 gap-6">
				{
					links.map((link) => {
						return <NavLink key={link.url} to={link.url} className='aria-[current]:border-opacity-100 border-opacity-0 border-b-2 border-white pb-2 duration-200 ease-in hover:border-opacity-25'>
							<li className="w-full rounded-lg font-bold">
								{link.name}
							</li>
						</NavLink>
					})
				}
				
			</ul>
		</section>
		<div className='h-16 flex flex-row justify-center items-center'>
			<div className='flex'>
		        <img className='cursor-pointer' width={16} src={`/images/${i18n.language}-flag.png`} alt="flag" onClick={changeLanguage}/>
			</div>
		</div>
	</nav>
}
