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
import stylesheet from './style/tailwind.css'
import { Navigation } from './components/Navigation'
import { User } from './utils/types/user'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
]
  
export async function loader() {
	const user: User = {
		name: 'Placeholder',
		avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg'
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
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<Meta />
				<Links />
				<GoogleTagManager id={GOOGLE_TAG_MANAGER_ID}/>

			</head>
			<body suppressHydrationWarning={'development' === NODE_ENV}>
				<GoogleTagManagerIframe id={GOOGLE_TAG_MANAGER_ID}/>

				<Navigation user={user} />
				<Outlet />
				
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
