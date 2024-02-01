import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, MetaFunction, useLoaderData } from '@remix-run/react'
import { createPrestation } from 'src/utils/requests/prestations';
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Add Prestations | INKIT'
		}
	]
}

export const loader = ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	return json({
		errors: [error],
		success: success
	})
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const newFormData = new FormData();

		formData.forEach((value, key) => {
			if (key === 'picture' && value instanceof File) {
				newFormData.append(key, value, value.name);
			} else {
				newFormData.append(key, value.toString());
			}
		});

    const session = await getSession(request.headers.get('Cookie'));
    const token = session.get('token') as string;

    const response = await createPrestation(newFormData, token);

		return redirect('/pro/prestations');

	} catch (e) {
		if (e instanceof Error)
			return redirect(`/pro/prestations/add?error=${e.message}`)

		return redirect(`/pro/prestations/add?error=${'Unexpected Error'}`)
	}
}

export default function () {
	const { errors } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Prestations',
				url: '/pro/prestations'
			}
		]}/>
		<Title kind="h2">Prestations</Title>
		<Link to={'/pro/prestations'}>
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Return</button>
		</Link>
		{ errors.map((error) => {
			return <div className='mb-16 font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		<Form method='POST' encType='multipart/form-data' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>
				<input placeholder='Name' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<select name="kind" className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300'>
					<option value="Tattoo">Tattoo</option>
					<option value="Jewelery">Jewelery</option>
					<option value="Barber">Barber</option>
				</select>
				<input placeholder='Picture' type="file" name='picture' accept=".png, .jpg, .jpeg" className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 hover:border-red-400 duration-300' />
				
			</div>
			
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Create</button>
		</Form>
	</div>
}

