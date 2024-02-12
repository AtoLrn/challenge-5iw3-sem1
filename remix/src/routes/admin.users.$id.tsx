import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, MetaFunction, useLoaderData, useNavigate } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import {getSession} from 'src/session.server'
import {getUser, patchUser} from 'src/utils/requests/admin/users'
import {BreadCrumb} from 'src/components/Breadcrumb'
import {useState} from 'react'
import { formatDate } from 'src/utils/date'
import { z } from 'zod'
import { zx } from 'zodix'
import {UserPatch} from 'src/utils/types/admin/user'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Users'
		}
	]
}

const schema = z.object({
	username: z.string().min(1),
	email: z.string().min(1),
	description: z.string().min(1),
	isAdmin: zx.CheckboxAsString,
	isArtist: zx.CheckboxAsString,
	isBanned: zx.CheckboxAsString,
	isVerified: zx.CheckboxAsString,
}) 

export const action = async ({ request, params }: ActionFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token')

	if (!token) {
		return redirect('/login')
	}

	if (!params.id) {
		return redirect('/admin/users')
	}

	try {
		const user = await getUser(token as string, params.id)
        
		const { username, email, description, isAdmin, isArtist, isBanned, isVerified } = await zx.parseForm(request, schema)

		const updatedUser: UserPatch = {}

		if(isAdmin && !user.roles.includes('ROLE_ADMIN')) {
			user.roles.push('ROLE_ADMIN')
		} else if (!isAdmin && user.roles.includes('ROLE_ADMIN')) {
			user.roles = user.roles.filter(role => role !== 'ROLE_ADMIN')
		}

		if(isArtist && !user.roles.includes('ROLE_PRO')) {
			user.roles.push('ROLE_PRO')
			updatedUser.kbisVerified = true
		} else if (!isArtist && user.roles.includes('ROLE_PRO')) {
			user.roles = user.roles.filter(role => role !== 'ROLE_PRO')
			updatedUser.kbisVerified = false
		}

		username !== user.username ? updatedUser.username = username : null
		email !== user.email ? updatedUser.email = email : null
		description !== user.description ? updatedUser.description = description : null
		isBanned !== user.isBanned ? updatedUser.isBanned = isBanned : null
		isVerified !== user.verified ? updatedUser.verified = isVerified : null
        console.log(user.roles)
		updatedUser.roles = user.roles

		await patchUser(token, params.id, updatedUser)

		return redirect(`/admin/users/${params.id}?success=true`)
	} catch (e) {
		if (e instanceof Error)
			return redirect(`/admin/users/${params.id}?error=${e.message}`)

		return redirect(`/admin/users/${params.id}?error=${'Unexpected Error'}`)
	}

}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	if (!params.id) {
		redirect('/admin/users')
	}

	try {
	    const user = await getUser(token as string, params.id as string)

		return json({
			user: user,
			errors: [error],
			success: success
		})
	} catch(e) {
		return redirect('/admin/users')
	}
}

export default function () {
	const { t } = useTranslation()
	const { user, errors, success } = useLoaderData<typeof loader>()
	const navigate = useNavigate()

	const [ description, setDescription ] = useState(user.description)
	const [ username, setUsername ] = useState(user.username)
	const [ email, setEmail ] = useState(user.email)
	const [ isAdmin, setIsAdmin ] = useState(user.roles.includes('ROLE_ADMIN'))
	const [ isArtist, setIsArtist ] = useState(user.roles.includes('ROLE_PRO'))
	const [ isBanned, setIsBanned ] = useState(user.isBanned)
	const [ isVerified, setIsVerified ] = useState(user.verified)

	const deleteUser = () => {
		if(confirm(t('about-to-delete-user'))) {
			navigate(`/admin/users/delete/${user.id}`)
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
				url: '/admin/users'
			},
			{ 
				name: user.username, 
				url: `/admin/users/${user.id}`
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
					<div className='mx-10'>
						<img width={150} className='rounded-full object-cover max-w-xs' src={user.picture} alt='user picture' />
					</div>
					<div className='flex flex-col'>
						<div className="flex flex-row gap-4 mb-10">
							<input value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email" name="email" placeholder={t('email-address')} className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
							<input value={username} onChange={(e) => setUsername(e.currentTarget.value)} type="text" name="username" placeholder={t('username')} className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<div>
							<textarea cols={100} rows={8} placeholder='Description' onChange={(e) => setDescription(e.currentTarget.value)} className='resize-y my-4 bg-transparent border-1 border-white' name='description' id='description' value={description} />
						</div>
						<div>
							<p>{t('creation-date')} : {formatDate(user.createdAt)}</p>
							<p>{t('last-update')} : {formatDate(user.updatedAt)}</p>
						</div>
					</div>
				</div>
				<div className='mb-10 flex justify-around'>
					<div>
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<label htmlFor="isAdmin" className="cursor-pointer">{t('make-admin')} : </label>
							<input id="isAdmin" defaultChecked={isAdmin} type="checkbox" name="isAdmin" className="checkBox cursor-pointer" onChange={(e) => setIsAdmin(e.target.checked)}/>
						</div>
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<label htmlFor="isArtist" className="cursor-pointer">{t('make-artist')} : </label>
							<input id="isArtist" defaultChecked={isArtist} type="checkbox" name="isArtist" className="checkBox cursor-pointer" onChange={(e) => setIsArtist(e.target.checked)}/>
						</div>
					</div>
					<div>
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<label htmlFor="isBanned" className="cursor-pointer">{t('to-ban')} : </label>
							<input id="isBanned" defaultChecked={isBanned} type="checkbox" name="isBanned" className="checkBox cursor-pointer" onChange={(e) => setIsBanned(e.target.checked)}/>
						</div>
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<label htmlFor="isVerified" className="cursor-pointer">{t('verified')} : </label>
							<input id="isVerified" defaultChecked={isVerified} type="checkbox" name="isVerified" className="checkBox cursor-pointer" onChange={(e) => setIsVerified(e.target.checked)}/>
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

