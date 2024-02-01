import { z } from 'zod'

const schema = z.object({
	id: z.number(),
	startDate: z.string().min(1),
	endDate: z.string().min(1),
})

const schemaGetDays = z.object({
	'hydra:member': z.array(schema)
})


export const deleteDayOff = async (props: DeleteDayOff): Promise<boolean> => {
	const res = await fetch(`${process.env.API_URL}/day_offs/${props.id}`, {
		method: 'DELETE',
		headers: {
			'Authorization': `Bearer ${props.token}`,
			'Content-Type': 'application/ld+json'
		},
	})

	return res.status === 204
}

export const createDayOff = async (props: CreateDayOff): Promise<DayOff> => {
	const res = await fetch(`${process.env.API_URL}/day_offs`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${props.token}`,
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify(props)
	})

	const body = await res.json()

	const dayOff = schema.parse(body)
    
	return {
		id: dayOff.id,
		startDate: new Date(dayOff.startDate),
		endDate: new Date(dayOff.endDate)
	}
}

export const getDaysOff = async ({ token }: { token: string }): Promise<DayOff[]> => {
	const res = await fetch(`${process.env.API_URL}/day_offs`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/ld+json'
		}
	})

	const body = await res.json()

	const json = schemaGetDays.parse(body)

	const daysOff = json['hydra:member'].map((day) => {
		return {
			id: day.id,
			startDate: new Date(day.startDate),
			endDate: new Date(day.endDate)
		}
	})
    
	return daysOff
}

export interface CreateDayOff {
    startDate: string,
    endDate: string,
	token: string
}

export interface DeleteDayOff {
    id: string,
	token: string
}

export interface DayOff {
	startDate: Date,
    endDate: Date,
	id: number
}