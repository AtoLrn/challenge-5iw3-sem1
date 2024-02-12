import { z } from 'zod'
import { PartnerShip } from '../types/partnership'
import { Validation } from '../types/validation'

export const partnerShipSchema = z.object({
	id: z.number(),
	status: z.enum(['PENDING', 'ACCEPTED', 'DENIED']),
	startDate: z.string().min(1),
	endDate: z.string().min(1),
	studioId: z.object({
		id: z.number(),
		name: z.string().min(1),
		location: z.string().min(1),
		openingTime: z.string().min(1),
		closingTime: z.string().min(1),
	}).optional(),
	userId: z.object({
		id: z.number(),
		username: z.string().min(1),
		picture: z.string().min(1)
	}).optional(),
}) 

const getPartnerShipSchema = z.object({
	'hydra:member': z.array(partnerShipSchema)
})


export const createPartnership = async ({ token, artistId, startDate, endDate, studioId }: CreatePartnership): Promise<boolean> => {
	const res = await fetch(`${process.env.API_URL}/studio/${studioId}/invites`, {
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
	
	return res.status === 201
}

export const asnwerPartnership = async ({ token, id, status }: AnswerPartnership): Promise<boolean> => {
	const res = await fetch(`${process.env.API_URL}/invites/${id}/answer`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/ld+json'
		},
		body: JSON.stringify({
			status
		})
	})
	
	return res.status === 201
}

export const getPartnerShip = async ({ token }: BasePartnerShip): Promise<PartnerShip[]> => {
	const res = await fetch(`${process.env.API_URL}/invites`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const json = await res.json()

	const body = getPartnerShipSchema.parse(json)

	const partnerShips = body['hydra:member'].map<PartnerShip>((partnerShip) => {
		return {
			id: partnerShip.id,
			status: partnerShip.status === 'ACCEPTED' ? Validation.ACCEPTED : partnerShip.status === 'PENDING' ? Validation.PENDING : Validation.REFUSED ,
			startDate: new Date(partnerShip.startDate),
			endDate: new Date(partnerShip.endDate),
			studio: partnerShip.studioId
		}
	})

	return partnerShips
}


export const getPartnerShipForUser = async ({ token, artistId }: GetPartnerShipForUser): Promise<PartnerShip[]> => {
	const res = await fetch(`${process.env.API_URL}/invites/${artistId}/accepted`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`,
		},
	})

	const json = await res.json()

	const body = getPartnerShipSchema.parse(json)

	const partnerShips = body['hydra:member'].map<PartnerShip>((partnerShip) => {
		return {
			id: partnerShip.id,
			status: partnerShip.status === 'ACCEPTED' ? Validation.ACCEPTED : partnerShip.status === 'PENDING' ? Validation.PENDING : Validation.REFUSED ,
			startDate: new Date(partnerShip.startDate),
			endDate: new Date(partnerShip.endDate),
			studio: partnerShip.studioId
		}
	})

	return partnerShips
}

export interface BasePartnerShip {
	token: string
}

export interface GetPartnerShipForUser extends BasePartnerShip {
	artistId: number | string
}

export type AnswerPartnership = {
	id: string
	status: 'ACCEPTED' | 'DENIED'
} & BasePartnerShip

export type CreatePartnership = {
	studioId: number,
	artistId: number,
	startDate: Date,
	endDate: Date
} & BasePartnerShip