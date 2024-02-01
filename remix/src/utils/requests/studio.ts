import { z } from 'zod'

const schema = z.object({
    id: z.number(),
    name: z.string().min(1),
    description: z.string().min(1),
    addressId: z.string().min(1),
    maxCapacity: z.number(),
    openingTime: z.string().min(1),
    closingTime: z.string().min(1),
})

export const createStudio = async (props: CreateStudio): Promise<Studio> => {
    console.log('--------------------------------------------------')
    const res = await fetch(`${process.env.API_URL}/studios`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${props.token}`,
            'Content-Type': 'application/ld+json'
        },
        body: JSON.stringify(props)
    })
    const body = await res.json()
    console.log("body", body)
    const studio = schema.parse(body)
    console.log("studio", studio)
    return studio
}

export interface CreateStudio {
    name: string,
    description: string,
    addressId: string,
    maxCapacity: number,
    openingTime: string,
    closingTime: string
}


export interface Studio {
    id: string,
    name: string,
    description: string,
    addressId: string,
    maxCapacity: number,
    openingTime: string,
    closingTime: string
}
