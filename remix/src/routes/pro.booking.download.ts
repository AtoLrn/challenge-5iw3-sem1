import { LoaderFunctionArgs, redirect } from '@remix-run/node'
import { format, isBefore } from 'date-fns'
import { getSession } from 'src/session.server'
import { getProBookings } from 'src/utils/requests/booking'

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const accessToken = process.env.MAP_BOX_TOKEN
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!token) {
		return redirect(`/login?error=${'You need to login'}`)
	}

	const appointements = await getProBookings({ token })

	const filteredAppointements = await Promise.all(appointements.filter((appointement) => {
		if (!appointement.time) { return false }

		const date = new Date(appointement.time)

		const now = new Date()

		return isBefore(now, date)
	}).map(async (appointement) => {
		const req = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${appointement.studio!.location}.json?proximity=ip&access_token=${accessToken}`)
		const body = await req.json()

		const [ feature ] = body.features

		return {
			username: appointement.requestingUser.username,
			date: new Date(appointement.time ?? ''),
			duration: appointement.duration ?? '30min',
			studio: appointement.studio?.name,
			address: feature.place_name
		}
	}))

	return new Response(`Username,Date,Duration,Studio,Location\n${filteredAppointements.reduce((acc, val) => {
		return acc += `${val.username},${format(val.date, 'yyyy-MM-dd  hh:mm aa')},${val.duration},${val.studio},"""${val.address}"""\n`
	}, '')}`, {
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': 'attachment; filename="appointements.csv"',
		}
	})
}


