export const createPartnership = async ({ token, artistId, startDate, endDate }: CreatePartnership): Promise<boolean> => {
	const res = await fetch(`${process.env.API_URL}/day_offs`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify({
			userId: artistId,
			startDate: `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`,
			endDate: `${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`
		})
	})


	console.log(await res.json())
	
	return res.status === 201
}


export interface BasePartnerShip {
	token: string
}

export type CreatePartnership = {
	artistId: number,
	startDate: Date,
	endDate: Date
} & BasePartnerShip