import { Prestation } from "./prestation";
import { ProfileInterface } from "./profileForm";
import { Validation } from "./validation";

export interface Booking {
  profile: ProfileInterface,
	prestation: Prestation,
	date: string,
	duration: number,
	status: Validation.ACCEPTED | Validation.PENDING | Validation.REFUSED,
}
