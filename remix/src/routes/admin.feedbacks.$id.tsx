import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, MetaFunction, useLoaderData, useNavigate } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import {getSession} from 'src/session.server'
import {BreadCrumb} from 'src/components/Breadcrumb'
import { z } from 'zod'
import { getFeedback, patchFeedback } from 'src/utils/requests/admin/feedbacks'
import React from 'react'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Feedbacks'
		}
	]
}

const schema = z.object({
	rating: z.number().min(1).max(5),
	comment: z.string().min(1),
}) 

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  if (!params.id) {
    return redirect('/admin/feedbacks');
  }

  try {
    const formData = await request.formData();
    const rating = formData.get('rating');
    const comment = formData.get('comment');

    const result = schema.safeParse({
      rating: rating ? Number(rating) : undefined,
      comment: comment ? String(comment) : undefined,
    });

		console.log('result', result)

    if (!result.success) {
			console.log('result.error', result.error)
      throw new Error('Invalid form data', result.error);
    }

    const feedback = await getFeedback(token as string, params.id);

    const updatedFeedback = {
      id: feedback.id,
      rating: result.data.rating,
      comment: result.data.comment,
    };

    await patchFeedback(token as string, params.id, updatedFeedback);

    return redirect(`/admin/feedbacks/${params.id}?success=true`);
  } catch (e) {
    console.error(e); // Ajouter un log pour déboguer
    if (e instanceof Error) {
      return redirect(`/admin/feedbacks/${encodeURIComponent(params.id)}?error=${encodeURIComponent(e.message)}`);
    }

    return redirect(`/admin/feedbacks/${params.id}?error=Unexpected Error`);
  }
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!params.id) {
		redirect('/admin/feedbacks')
	}

	try {
	    const feedback = await getFeedback(token as string ?? '', params.id as string)

		return json({
			feedback: feedback,
			errors: [error],
			success: success
		})
	} catch(e) {
		return redirect('/admin/feedbacks')
	}
}

export default function () {
	const { t } = useTranslation()
	const { feedback, errors, success } = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	console.log('feedback', feedback)

	const [rating, setRating] = React.useState(feedback.rating)
	const [comment, setComment] = React.useState(feedback.comment)

	const deleteUser = () => {
		if(confirm(t('about-to-delete-user'))) {
			navigate(`/admin/feedbacks/delete/${feedback.id}`)
		} else {
			return
		}
	}

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{ 
				name: t('home'), 
				url: '/admin' 
			},
			{ 
				name: t('users'), 
				url: '/admin/feedbacks'
			},
			{ 
				name: feedback.submittedBy.username + ' ' + t('feedback-from') + ' ' + feedback.prestation.name,
				url: `/admin/feedbacks/${feedback.id}`
			}
		]}/>

		{ errors.map((error) => {
			return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		{success ?
			<div className='font-bold text-green-600 border-b border-white self-start'>
				{t('user-updated')}
			</div> : null
		}

		<div className='overflow-scroll'>
			<Form method='POST'>
			<div className='flex mb-10'>
				<div className='flex flex-col'>
					<div className="flex flex-col gap-4 mb-10">
						<input value={rating} onChange={(e) => setRating(Number(e.currentTarget.value))} type="number" max={5} min={1} name="rating" placeholder={t('rating')} className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						<textarea cols={25} rows={8} placeholder='Description' onChange={(e) => setComment(e.currentTarget.value)} className='resize-y my-4 bg-transparent border-1 border-white' name='comment' id='comment' value={comment} />
					</div>
				</div>
			</div>
				<div className='flex justify-center'>
					<button type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
						{t('update')}
					</button>
				</div>
			</Form>
			<hr className='my-10'/>
			<div className='flex justify-center'>
				<button onClick={deleteUser} className="bg-transparent hover:bg-red-500 hover:bg-opcaity-30 text-white border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
					{t('delete')}
				</button>
			</div>
		</div>

		<style>
			{`
                input[type=checkbox] {
                    position: relative;
                    border: 2px solid white;
                    background: none;
                    outline: 0;
                    height: 20px;
                    width: 20px;
                    -webkit-appearance: none;
                }
                
                input[type=checkbox]:checked {
                    background-color: white;
                }
                
                input[type=checkbox]:checked:before {
                    content: '';
                    position: absolute;
                    right: 50%;
                    top: 50%;
                    width: 4px;
                    height: 10px;
                    border: solid #000;
                    border-width: 0 2px 2px 0;
                    margin: -1px 0 0 -1px;
                    transform: rotate(45deg) translate(-50%, -50%);
                    z-index: 2;
                }
            `}
		</style>
	</div>
}

