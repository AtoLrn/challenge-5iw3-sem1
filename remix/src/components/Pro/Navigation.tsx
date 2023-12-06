import { NavLink } from '@remix-run/react'
import * as HoverCard from '@radix-ui/react-hover-card'

const links = [
	{
		name: 'Dashboard',
		url: '/pro/dashboard'
	},
	{
		name: 'Guests',
		url: '/pro/guests'
	},
	{
		name: 'Studios',
		url: '/pro/studios'
	},
	{
		name: 'Prestation',
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
]

export const ProNavigation = () => {
	return <nav className="flex flex-col items-strech justify-between h-full w-64 text-white z-10 bg-opacity-30 bg-zinc-950 shadow-2xl backdrop-blur-3xl">
		<section className="flex flex-col gap-4">
			<div className="w-full h-24 flex items-center justify-center">
				<h1 className="text-2xl font-bold text-center tracking-widest">INKIT</h1>
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
	</nav>
}