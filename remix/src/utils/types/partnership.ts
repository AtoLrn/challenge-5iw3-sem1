import { Validation } from './validation'

export interface PartnerShip {
    id: number,
    status: Validation,
    startDate: Date,
    endDate: Date,

    studio?: {
        id: number,
        name: string
    }

    userId?: {
        id: number,
        username: string,
        picture: string
    }
}