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
import driverJSStyle from 'driver.js/dist/driver.css'

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'stylesheet', href: driverJSStyle },
]
  
export async function loader() {
	return json({ ...getEnvironnement() })
}

export default function App() {
	const { GOOGLE_TAG_MANAGER_ID, NODE_ENV } = useLoaderData<typeof loader>()

	return (
		<html>
			<head>
				<link
					rel="icon"
					href="data:image/x-icon;base64,AA"
				/>
				<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@^2.4/dist/maplibre-gl.css" />
				<Meta />
				<Links />
				<GoogleTagManager id={GOOGLE_TAG_MANAGER_ID}/>

			</head>
			<body suppressHydrationWarning={'development' === NODE_ENV}>
				<GoogleTagManagerIframe id={GOOGLE_TAG_MANAGER_ID}/>
				<Outlet />				
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
