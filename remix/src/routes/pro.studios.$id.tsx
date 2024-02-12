import { Link, MetaFunction, useFetcher, useLoaderData } from '@remix-run/react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import * as Dialog from '@radix-ui/react-dialog'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { useCallback, useState } from 'react'
import { withDebounce } from 'src/utils/debounce'
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { Artist } from 'src/utils/types/artist'
import { createPartnership } from 'src/utils/requests/partnership'
import { getSession } from 'src/session.server'
import { getArtists } from 'src/utils/requests/artists'
import {useTranslation} from 'react-i18next'
import { Studio } from 'src/utils/types/studio'
import { getStudio } from 'src/utils/requests/studios'
import { Validation } from 'src/utils/types/validation'
import { TimePicker, TimePickerKind } from 'src/components/Calendar'



const formSchema = z.union([
	z.object({
		kind: z.literal('SEARCH'),
		artistName: z.string()
	}),
	z.object({
		kind: z.literal('POST'),
		artistId: z.string(),
		startDate: z.string(),
		endDate: z.string()
	})
])


export type ActionReturnType = {
	artists: Artist[]
	error?: string
	status?: 204
}

export type LoaderReturnType = {
	error?: string
	studio: Studio
}

export interface Appointement {
	id: string,
	name: string,
	with: string
	date: Date
}

export const AppointementItem: React.FC<ListItemProps<Appointement>> = ({ item }) => {
	const h = item.date.getHours().toString().padStart(2, '0')
	const m = item.date.getMinutes().toString().padStart(2, '0')


	const formattedDate = `${h}h${m}`
	return <div className='grid grid-cols-3 gap-4 w-full px-8 py-4 backdrop-blur-xl bg-slate-700 bg-opacity-30 rounded-xl items-center'>
		<span>{ item.name }</span>
		<span>{ item.with }</span>
		<span><b>{ formattedDate }</b></span>
		{/* <span className='text-right'>{ item.available } / { item.seats }</span> */}

	</div>
}

export async function action ({ request, params }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'))

	const { id } = params

	if (!id) {
		return json({
			error: 'Something wrong happened in form validation'
		})
	}

	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}

	try {
		const body = await zx.parseForm(request, formSchema)
		
		if (body.kind === 'SEARCH') {
			const artists = await getArtists()

			return json<ActionReturnType>({
				artists
			})
		} else {
			console.log('ANTOINE: ', body)
			await createPartnership({
				token,
				studioId: +id,
				artistId: parseInt(body.artistId),
				startDate: new Date(body.startDate),
				endDate: new Date(body.endDate)
			})

			return json<ActionReturnType>({
				status: 204,
				artists: []
			})
		}

			
	} catch {
		return json({
			error: 'Something wrong happened in form validation'
		})
	}
}

export async function loader ({ request, params }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'))

	const { id } = params

	if (!id) {
		return json({
			error: 'Something wrong happened in form validation'
		})
	}

	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}

	const studio = await getStudio({
		id
	})

	return json<LoaderReturnType>({
		studio
	})
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Studios | INKIT'
		}
	]
}

export default function () {
	const [ isOpen, setOpen ] = useState(false)
	const { studio } = useLoaderData<LoaderReturnType>()
	const [ isSearching, setSearching ] = useState(false)
	const [ artistId, setArtistId ] = useState<number>()
	const [ artist, setArtist ] = useState<string>()
	const { t } = useTranslation()

	const fetch  = useFetcher<ActionReturnType>()

	const debounce = useCallback(withDebounce((event: React.ChangeEvent<HTMLInputElement>) => {
		fetch.submit({
			kind: 'SEARCH',
			artistName: event.target.value
		}, {
			method: 'POST'
		})
	}, 300), [])

	const appointements: Appointement[] = [{
		id: '1',
		name: 'Lucas Campistron',
		with: 'Erromis',
		date: new Date()
	},
	{
		id: '12',
		name: 'Izia Crinier',
		with: 'Matin',
		date: new Date()
	}] 

	return <div className="flex-1 p-8 flex flex-col items-start gap-4 h-screen overflow-y-scroll">
		<BreadCrumb routes={[
			{
				name: t('home'),
				url: '/pro'
			},{
				name: 'Studios',
				url: '/pro/studios'
			},{
				name: studio.name,
				url: `/pro/studios/${studio.id}`
			}
		]}/>
		<section className='flex items-center justify-between w-full'>
			<Title kind='h1'>{studio.name}</Title>

			<div className='flex items-center gap-2'>
				<Link to={'/pro/studios/poivre-noir/edit'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Add Closing Day</button>
				</Link>
				<Link to={'/pro/studios/poivre-noir/edit'}>
					<button className='px-4 py-2 bg-gray-700 rounded-lg text-white'>Edit</button>
				</Link>
			</div>
			
		</section>
		<hr className='w-full opacity-30'/>
		<Title kind='h3' className='mt-4'>
			{t('your-guests')}
		</Title>

		<section className='flex items-center justify-start gap-6'>
			{ studio.partnerShips.filter(p => p.status !== 'DENIED' as any).map((guest) => {
				return  <img key={guest.userId?.id} className={ `rounded-full relative object-cover w-28 h-28 cursor-pointer border-4 ${guest.status === Validation.ACCEPTED.toUpperCase() ? 'border-green-500' : guest.status === Validation.PENDING.toUpperCase() ? 'bg-orange-500 border-orange-500' : 'bg-red-500 border-red-500'  }` } src={guest.userId?.picture} alt={guest.userId?.username}/>
			}) }
			

			<Dialog.Root open={isOpen} onOpenChange={(open) => setOpen(open)}>
				<Dialog.Trigger asChild>
					<div  className={ 'rounded-full relative object-cover w-28 h-28 cursor-pointer bg-opacity-20 bg-zinc-600 flex justify-center items-center' } >
						<AiOutlinePlus size={32} opacity={0.5} />
					</div>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
					<Dialog.Content className="flex flex-col items-stretch justify-start gap-8 p-4 z-20 bg-gray-600 bg-opacity-50 w-96 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
						<h1 className='font-title text-xl font-bold'>{t('invite-artist')}</h1>
						<fetch.Form onSubmit={() => setOpen(false)} method='POST' className='w-full flex flex-col gap-2'>
							<input onChange={(e) => {
								setSearching(true)
								setArtist(e.target.value)
								debounce(e)
							}} 
							value={artist}
							placeholder={t('artist-name')} type="text" name='artist' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
						
							<input  type="hidden" name='artistId' value={artistId} />
							<input  type="hidden" name='kind' value='POST' />
							<div className='flex items-center gap-2'>
								
								<TimePicker name='startDate' kind={TimePickerKind.DAY} />
								<TimePicker name='endDate' kind={TimePickerKind.DAY} />
							</div>

							<div className='flex flex-col gap-1'>
								{ isSearching && fetch.data?.artists.map((artist) => {
									return <div onClick={() => {
										setArtistId(artist.id)
										setArtist(artist.username)
										setSearching(false)
									}} className='cursor-pointer flex items-center gap-4 justify-start px-4 py-2 rounded-lg bg-zinc-900' key={artist.id}>
										{ artist.username }
									</div>
								}) }
							</div>
						
							<div className='w-full flex items-center justify-end gap-4'>
								<Dialog.Close asChild>
									<button className="outline-non px-4 py-2 bg-red-700 rounded-md text-whitee" aria-label="Close">
									    {t('cancel')}
									</button>
								</Dialog.Close>
								<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">{t('invite')}</button>
							</div>
						</fetch.Form>
						
				
						
						
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

		</section>
		<hr className='mt-8 w-full opacity-30'/>
		<div className='w-1/2 flex flex-col gap-4'>
			<Title kind='h3' className='mt-4'>
				Today's Appointements
			</Title>
			<List items={appointements} ListItem={AppointementItem} />
		</div>
	</div>
}

