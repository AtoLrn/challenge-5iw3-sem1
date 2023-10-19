import {
	Links,
	Meta,
	Outlet,
	LiveReload,
	Scripts,
	useLoaderData,
	Link
} from '@remix-run/react'
import { LinksFunction, json } from '@remix-run/node'
import { GoogleTagManager, GoogleTagManagerIframe } from './utils/gtm/GoogleTagManager'
import { getEnvironnement } from './utils/gtm/env/environnement.server'
import stylesheet from './tailwind.css'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]
  
export async function loader() {
	const contactsPromise = new Promise<string>((resolve) => {
		setTimeout(() => {
			resolve('World')
		}, 2000)
	})

	return json({ contacts: await contactsPromise, ...getEnvironnement() })
}

export default function App() {
	const { contacts, GOOGLE_TAG_MANAGER_ID, NODE_ENV } = useLoaderData<typeof loader>()

	return (
		<html>
			<head>
				<link
					rel="icon"
					href="data:image/x-icon;base64,AA"
				/>
				<Meta />
				<Links />
				<GoogleTagManager id={GOOGLE_TAG_MANAGER_ID}/>

			</head>
			<body suppressHydrationWarning={NODE_ENV === 'development'}>
				<GoogleTagManagerIframe id={GOOGLE_TAG_MANAGER_ID}/>

				<h1 className='text-3xl font-bold underline'>Hello { contacts }! </h1>

        
				<Link to={'/test'}>
					<button>Navigate</button>
				</Link>
				<Outlet />

				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
