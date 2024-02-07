import {ActionFunctionArgs, LoaderFunctionArgs, json, redirect} from '@remix-run/node'
import { Form, Link, MetaFunction, NavLink, useLoaderData } from '@remix-run/react'
import {useTranslation} from 'react-i18next'
import { Title } from 'src/components/Title'
import {getSession} from 'src/session.server'
import {createPost, getPosts} from 'src/utils/requests/post'
import {Post} from 'src/utils/types/post'
import * as Dialog from '@radix-ui/react-dialog'
import {useEffect, useState} from 'react'
import {getUsers} from 'src/utils/requests/admin/users'
import {getArtists} from 'src/utils/requests/artists'
import {ListItemProps} from 'src/components/Admin/ListItem'
import {User} from 'src/utils/types/admin/user'
import {BreadCrumb} from 'src/components/Breadcrumb'
import {List} from 'src/components/Admin/List'
import {Prestation} from 'src/utils/types/prestation'
import {boolean} from 'zod'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Users'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get('Cookie'))

	const token = session.get('token')

	const users = await getUsers(token as string)

	return json({
		users: users,
	})
}

export const UserItem: React.FC<ListItemProps<User>> = ({ item }) => {
	const { t } = useTranslation()

	return <div className='flex flex-row justify-between gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<img className="rounded-full" height={32} width={32} src={item.picture}/>
        <span>{item.roles.includes('ROLE_PRO')}</span>
		<span className='flex-1'>{item.username}</span>
		<span className='flex-1'>{item.email}</span>
        <div className='flex-1'>
            <span className={`mr-2 text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 ${item.verified ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'}`}>{item.verified ? t('account-verified') : t('account-not-verified')}</span>
            {item.isBanned ?
                <span className='mr-2 text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 bg-red-500 border-red-500'>{t('ban')}</span> : null
            }
            {item.roles.includes('ROLE_PRO') ?
                <span className='mr-2 text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 bg-blue-500 border-blue-500'>{t('artist')}</span> : null
            }
            {item.roles.includes('ROLE_ADMIN') ?
                <span className='text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 bg-orange-500 border-orange-500'>Admin</span> : null
            }
        </div>
		<div className='flex items-center justify-end'>
			<Link to={`/admin/users/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('view')}</Link>
		</div>
	</div>
}

const enum FilterBooleanChoice {
    true = 'true',
    false = 'false',
    not = 'not'
}

export default function () {
	const { t } = useTranslation()
	const { users } = useLoaderData<typeof loader>()

    const [ userList, setUserList ] = useState<User[]>(users)
    const [ username, setUsername ] = useState("")
    const [ isVerified, setIsVerified ] = useState<FilterBooleanChoice>(FilterBooleanChoice.not)
    const [ isArtist, setIsArtist ] = useState<boolean>(false)
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false)

    const filterUsers = () => {
        const filteredUsers = users.filter((user: User) => {
            let isStaying = true
            if (isAdmin && !user.roles.includes('ROLE_ADMIN')) {
                isStaying = false
            }
            if (isArtist && !user.roles.includes('ROLE_PRO')) {
                isStaying = false
            }
            if (isVerified === FilterBooleanChoice.true && !user.verified) {
                isStaying = false
            }
            if(isVerified === FilterBooleanChoice.false && user.verified) {
                isStaying = false
            }
            if(username.length > 0 && !user.username.startsWith(username)) {
                isStaying = false
            }
            return isStaying
        })

        setUserList(filteredUsers)
    }

    useEffect(() => {
        filterUsers()
    }, [isAdmin, isArtist, isVerified, username])

    const getClassName = (state: FilterBooleanChoice) => {
        let className = "";

        switch(state) {
        case FilterBooleanChoice.false:
            className += 'bg-red-500 border-red-500'
            break
        case FilterBooleanChoice.true:
            className += 'bg-green-500 border-green-500'
            break
        case FilterBooleanChoice.not:
            className += ''
            break
        }

        return className
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
            }
        ]}/>
		<Title kind="h2">{t('list-of-users')}</Title>

        <div className='flex'>
            <input placeholder={t('username')} className='mr-4 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300' value={username} onChange={(e) => setUsername(e.target.value)} />
            <button 
                className={`text-sm mr-4 px-2 py-1 rounded-md border-1 bg-opacity-30 ${getClassName(isVerified)}`} 
                onClick={() => {
                    if(isVerified === FilterBooleanChoice.not) {
                        setIsVerified(FilterBooleanChoice.true)
                    } else if(isVerified === FilterBooleanChoice.true) {
                        setIsVerified(FilterBooleanChoice.false)
                    } else if(isVerified === FilterBooleanChoice.false) {
                        setIsVerified(FilterBooleanChoice.not)
                    }
                    filterUsers()
                }}>{t('verified')}</button>
            <button 
                className={`text-sm mr-4 px-2 py-1 rounded-md border-1 bg-opacity-30 ${isArtist ? 'bg-green-500 border-green-500' : null}`}
                onClick={() => setIsArtist(!isArtist)}>{t('artist')}</button>
            <button 
                className={`text-sm px-2 py-1 rounded-md border-1 bg-opacity-30 ${isAdmin ? 'bg-green-500 border-green-500' : null}`}
                onClick={() => setIsAdmin(!isAdmin)}>Admin</button>
        </div>

		<List items={userList as User[]} ListItem={UserItem} />
	</div>
}

