import { Feedback } from "src/utils/types/admin/feedback";
import { z } from "zod";

const schemaCollection = z.object({
  'hydra:member': z.array(z.object({
    id: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1),
    prestation: z.object({
      name: z.string().min(1),
    }),
    submittedBy: z.object({
      username: z.string().min(1)
    })
  }))
})

const schema = z.object({
  id: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
  prestations: z.object({
    name: z.string().min(1),
  }),
  submittedBy: z.object({
    username: z.string().min(1)
  })
})

export const getFeedbacks = async (token: string): Promise<Feedback[]> => {
  const res = await fetch(`${process.env.API_URL}/admin/feedbacks`, {
    headers: {
      'Accept': 'application/ld+json',
      'Authorization': `Bearer ${token}`
    },
  })

  console.log('res', res)

  const body = await res.json()

  console.log('body', body)

  try {
    const parsedBody = schemaCollection.parse(body)

    console.log('parsedBody', parsedBody)

    return parsedBody['hydra:member']
  } catch (e) {
    return e as Feedback[]
  }
}
