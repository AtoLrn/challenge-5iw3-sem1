import { Kind } from "./kind";

export interface Prestation {
	id: number,
	name: string,
	kind: Kind,
	proposedBy: string,
	picture: string | null,
	created_at: string
}
