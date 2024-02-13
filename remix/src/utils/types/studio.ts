import { Booking } from '../requests/booking'
import { PartnerShip } from './partnership'
import { Validation } from './validation'

export interface Studio {
	id: number,
	name: string,
	description: string,
	location: string,
	status: Validation
	maxCapacity: number,
	openingTime: string | null,
	closingTime: string | null,
	monday: boolean | null,
	tuesday: boolean | null,
	wednesday: boolean | null,
	thursday: boolean | null,
	friday: boolean | null,
	saturday: boolean | null,
	sunday: boolean | null,
	picture: string,

	bookRequests: Booking[]
	partnerShips: PartnerShip[]  
}
