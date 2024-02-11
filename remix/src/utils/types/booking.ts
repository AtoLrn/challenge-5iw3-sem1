import { Prestation } from './prestation'
import { ProfileFormInterface } from './profileForm'
import { Validation } from './validation'

export interface Booking {
  	profile: ProfileFormInterface,
	prestation: Prestation,
	date: string,
	duration: number,
	status: Validation.ACCEPTED | Validation.PENDING | Validation.REFUSED,
}
