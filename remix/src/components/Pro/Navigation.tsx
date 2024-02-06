import { NavLink } from '@remix-run/react'
import * as HoverCard from '@radix-ui/react-hover-card'
import {useTranslation} from 'react-i18next'


export const ProNavigation = () => {
	const { i18n, t } = useTranslation()

    const links = [
        {
            name: t('dashboard'),
            url: '/pro/dashboard'
        },
        {
            name: t('guests'),
            url: '/pro/guests'
        },
        {
            name: 'Studios',
            url: '/pro/studios'
        },
        {
            name: 'Prestations',
            url: '/pro/prestations'
        },
        {
            name: 'Posts',
            url: '/pro/posts'
        },
        {
            name: 'Chat',
            url: '/pro/chat'
        },
        {
            name: 'Invitations',
            url: '/pro/invitations'
        }
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
        <div className='flex flex-row'>
            <HoverCard.Root>
                <HoverCard.Trigger asChild>
                    <a className="flex items-center justify-start w-full h-16 py-2 px-8 gap-4 cursor-pointer" href='/pro/profile'>
                        <img className="rounded-full" height={32} width={32} src='https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'/>
                        <div className="flex flex-col ">
                            <span className="text-sm">Your name</span>
                            <span className="opacity-70 text-sm">Tattoo artist</span>
                        </div>
                    </a>
                </HoverCard.Trigger>
                <HoverCard.Portal>
                    <HoverCard.Content className="rounded-xl bg-white text-black shadow-lg w-56 z-10" sideOffset={5}>
                        <section className="flex  flex-col items-center justify-start w-full py-2 px-8 gap-4 cursor-pointer">
                            <div className="flex flex-col ">
                                <span className="text-sm">You've done 14 tattoos</span>
                                <span className="opacity-70 text-sm">You traveled throught 4 studios</span>
                            </div>
                        </section>

                        <HoverCard.Arrow className="fill-white" />
                    </HoverCard.Content>
                </HoverCard.Portal>
            </HoverCard.Root>
            <div className='flex items-center'>
		        <img className='cursor-pointer' width={16} src={`/images/${i18n.language}-flag.png`} alt="flag" onClick={changeLanguage}/>
            </div>
        </div>
	</nav>
}
