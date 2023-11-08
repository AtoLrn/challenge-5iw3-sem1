import { Outlet } from '@remix-run/react'
import { ProNavigation } from './../components/Pro/Navigation'

export default function ProLayout () {
	return <main className='w-screen h-screen flex gradient-bg relative text-white'>
		<ProNavigation />
		<Outlet />
	</main>
}