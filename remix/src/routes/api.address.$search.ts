/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoaderFunctionArgs, json } from '@remix-run/node'

export interface AddressSearch {
	locations: Array<AddressSearchResult>
}

export interface AddressSearchResult {
	id: string,
	name: string,
	x: number,
	y: number
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const address = params.search

	if (!address) {
		return json({
			locations: []
		})
	}

	const accessToken = process.env.MAP_BOX_TOKEN

	if (!accessToken) {
		console.error('Your map box token is undefined')
		return json({
			locations: []
		})
	}

	try {
		const req = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?proximity=ip&access_token=${accessToken}`)

		const results = await req.json()
	
		// TODO ADD RETURN CHECK
		const locations = results.features.map((result: any) => ({
			id: result.id,
			name: result.place_name,
			x: result.center[0],
			y: result.center[1]
		}))
		return json({
			locations
		})
	} catch {
		return json({
			locations: []
		})
	}
	
}