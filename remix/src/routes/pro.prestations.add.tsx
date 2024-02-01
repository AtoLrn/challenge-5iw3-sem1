import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, Link, MetaFunction, useActionData } from '@remix-run/react'
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

		console.log("Coucou" , newFormData)

    const session = await getSession(request.headers.get('Cookie'));
    const token = session.get('token') as string;

		for (let [key, value] of newFormData.entries()) {
			console.log(`${key}: ${value}`);
		}

    const response = await createPrestation(newFormData, token);

    if (!response.ok) {
      return json({ errors: { server: 'An error occurred while creating the prestation' } });
    }

		return redirect('/pro/prestations');

	} catch (err) {
		console.log(err)
	} 
	return json({
		errors: {
			server: 'An unknown error occured'
		}
	})
}

export default function () {

	const actionData = useActionData<typeof action>()

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
		<div className='w-full flex flex-col gap-2'>
			{ actionData?.errors && Object.entries(actionData.errors).map(([key, value]) => {
				return <div className='w-full'><b>{key}</b>: {value}</div>
			})}
		</div>
		
		<Form method='POST' encType='multipart/form-data' className='w-full flex flex-col gap-4'>
			<div className='grid grid-cols-2 w-full gap-4'>
				<input placeholder='Name' type="text" name='name' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<input placeholder='kind' type='text' name='kind' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
				<input placeholder='Picture' type="file" name='picture' accept=".png, .jpg, .jpeg" className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 hover:border-red-400 duration-300' />
				
			</div>
			
			<button className='px-4 py-2 bg-gray-700 rounded-lg text-white self-end'>Create</button>
		</Form>
	</div>
}

