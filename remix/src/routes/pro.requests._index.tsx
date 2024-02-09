import { Link, MetaFunction, useLoaderData, useNavigate } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { Title } from 'src/components/Title'
import { getSession } from 'src/session.server'
import {useTranslation} from 'react-i18next'
import {PreBook} from 'src/utils/types/prebook'
import {getPreBook} from 'src/utils/requests/pre-book'
import * as Dialog from '@radix-ui/react-dialog'
import {useState} from 'react'

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Requests | INKIT'
		}
	]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url)
	const error = url.searchParams.get('error')
	const success = url.searchParams.get('success')

	const session = await getSession(request.headers.get('Cookie'))
	const token = session.get('token') as string

	const preBook = await getPreBook(token)

	return json({
        preBook,
		errors: [error],
        success: success
    })
}


export const PreBookItem: React.FC<ListItemProps<PreBook>> = ({ item }) => {
	const { t } = useTranslation()
	const [ isDialogOpen, setIsDialogOpen ] = useState(false)
	const navigate = useNavigate()

	const deleteRequest = () => {
		if(confirm(t('about-to-delete-request'))) {
			navigate(`/pro/requests/delete/${item.id}`)
            console.log(item.id)
		} else {
			return
		}
	}

	return <div className='flex flex-row justify-between gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<img className="rounded-full" height={32} width={32} src={item.requestingUser.picture}/>
		<span>{item.requestingUser.username}</span>
        <Dialog.Root open={isDialogOpen}>
            <Dialog.Trigger asChild>
		        <button onClick={() => setIsDialogOpen(true)} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1'>{t('see-description')}</button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
                <Dialog.Content className="flex flex-col items-stretch justify-start gap-4 p-4 z-20 bg-zinc-600 bg-opacity-30 w-1/2 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
                    <div className='flex flex-col gap-2'>
                        <Title kind={'h2'}>
                            Description
                        </Title>
                    </div>
                    <hr className='pb-4' />
                    <div className='pb-4 flex items-center gap-2'>
                        <textarea cols={70} rows={8} className='p-2 resize-y my-4 bg-transparent border-1 border-white' name='description' id='description' value={item.description} />
                    </div>
                    <div className='flex gap-2 items-center justify-end w-full'>
                        <Dialog.Close asChild>
                            <button onClick={() => {
                                setIsDialogOpen(false)
                            }} className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('return')}</button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
		<div >
			<Link to={`/pro/requests/approve/${item.id}`} className='text-center text-sm px-2 py-1 rounded-md hover:bg-opacity-30 hover:bg-green-500 hover:border-green-500 border-1 mr-2'>{t('approve')}</Link>
			<button onClick={deleteRequest} className='text-center text-sm px-2 py-1 rounded-md bg-opacity-30 border-1 hover:bg-opacity-30 hover:border-red-500 hover:bg-red-500'>{t('delete')}</button>
		</div>
	</div>
}

export default function Prestations() {
	const { t } = useTranslation()
	const { preBook, errors, success } = useLoaderData<typeof loader>()

	return <div className="flex-1 p-8 flex flex-col items-start gap-8">
		<BreadCrumb routes={[
			{ 
				name: t('home'), 
				url: '/pro' 
			},
			{ 
				name: t('requests'), 
				url: '/pro/requests'
			}
		]} />
		<Title kind="h2">{t('list-of-requests')}</Title>

		{ errors.map((error) => {
			return <div className='font-bold text-red-600 border-b border-white self-start' key={error}>
				{error}
			</div>
		})}
		{success ?
			<div className='font-bold text-green-600 border-b border-white self-start'>
				{t('request-approved')}
			</div> : null
		}

		{preBook.length > 0 ?
			<List items={preBook} ListItem={PreBookItem} />
			:
			<p className='opacity-50'>{t('no-request')}</p>
		}
	</div>
}
