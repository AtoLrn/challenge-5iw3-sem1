import { z } from 'zod';
import { Prestation } from '../types/prestation';
import { Kind } from '../types/kind';

const prestationSchema = z.array(z.object({
  id: z.number(),
  name: z.string(),
  kind: z.nativeEnum(Kind),
  proposedBy: z.string(),
  picture: z.string().nullable(),
  createdAt: z.string(),
}));

export const getPrestations = async (token: string): Promise<Prestation[]> => {
  const response = await fetch(`${process.env.API_URL}/prestations/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/ld+json',
    },
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  const result = await response.json();
  const data = prestationSchema.parse(result);
  return data;
};

export const createPrestation = async (formData: FormData, token: string): Promise<Response> => {
  const response = await fetch(`${process.env.API_URL}/prestations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  console.log('Response:', response);

  if (!response.ok) {
    const errorBody = await response.json();
    console.error('Error response body:', errorBody);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }


  return response;
};
