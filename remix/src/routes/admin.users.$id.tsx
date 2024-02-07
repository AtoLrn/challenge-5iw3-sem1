import {LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, MetaFunction, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import {getSession} from 'src/session.server'
import {getUser} from 'src/utils/requests/admin/users'
import {BreadCrumb} from 'src/components/Breadcrumb'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Users'
		}
	]
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
        return redirect(`/admin/users`)
    }
}

export default function () {
	const { t } = useTranslation()
	const { user, errors, success } = useLoaderData<typeof loader>()

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
                {t('email-verify-send')}
            </div> : null
        }

        <div className='flex'>
            <Form method='POST'>
                <div className="flex flex-row gap-4 mb-8">
                    <input value={user.email} type="email" name="email" placeholder={t('email-address')} className="w-full bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
                </div>
            </Form>
        </div>
	</div>
}

