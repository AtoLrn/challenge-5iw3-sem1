import {
	Links,
	Meta,
	Outlet,
	LiveReload,
	Scripts,
	useLoaderData
} from '@remix-run/react'
import { LinksFunction, json } from '@remix-run/node'
import { GoogleTagManager, GoogleTagManagerIframe } from './utils/gtm/GoogleTagManager'
import { getEnvironnement } from './utils/gtm/env/environnement.server'
import stylesheet from './tailwind.css'
import driverJSStyle from 'driver.js/dist/driver.css'

import { Navigation } from './components/Navigation'
import { User } from './utils/types/user'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'stylesheet', href: driverJSStyle },
]
  
export async function loader() {
	const user: User = {
		name: 'Placeholder',
		avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
	}

	return json({ ...getEnvironnement(), user })
}

export default function App() {
	const { GOOGLE_TAG_MANAGER_ID, NODE_ENV, user } = useLoaderData<typeof loader>()

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

				<Navigation user={user} />
				<Outlet />
				
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
