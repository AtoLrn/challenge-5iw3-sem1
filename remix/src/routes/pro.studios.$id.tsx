import { Form, Link, MetaFunction, useFetcher } from '@remix-run/react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BreadCrumb } from 'src/components/Breadcrumb'
import { Title } from 'src/components/Title'
import * as Dialog from '@radix-ui/react-dialog'
import { List } from 'src/components/Pro/List'
import { ListItemProps } from 'src/components/Pro/ListItem'
import { TimePicker, TimePickerKind } from 'src/components/Calendar'
import { useCallback, useState } from 'react'
import { withDebounce } from 'src/utils/debounce'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { zx } from 'zodix'
import { z } from 'zod'
import { Artist } from 'src/utils/types/artist'
import { createPartnership } from 'src/utils/requests/partnership'
import { getSession } from 'src/session.server'
import { getArtists } from 'src/utils/requests/artists'



const formSchema = z.union([
	z.object({
		kind: z.literal('SEARCH'),
		artistName: z.string()
	}),
	z.object({
		kind: z.literal('POST'),
		artistId: z.string()
	})
])


export type ActionReturnType = {
	artists: Artist[]
	error?: string
	status?: 204
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

export async function action ({ request }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'))


	const token = session.get('token')
	if (!token) {
		return redirect('/login')
	}

	try {
		const body = await zx.parseForm(request, formSchema)
		
		if (body.kind === 'SEARCH') {
			return json<ActionReturnType>({
				artists: await getArtists()
			})
		} else {
			const isValid = await createPartnership({
				token,
				artistId: parseInt(body.artistId),
				startDate: new Date(),
				endDate: new Date()
			})

			console.log('ANTOINE: ', isValid)

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

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Studios | INKIT'
		}
	]
}

export default function () {
	const [ isSearching, setSearching ] = useState(false)
	const [ artistId, setArtistId ] = useState<number>()
	const [ artist, setArtist ] = useState<string>()

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

	const guests = [
		'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFRgVFRIYGBgYGhIVGBgYGBgSGBEYGBgZGRgYGBgcIS4lHB4rIRgYJjgmKy8xNTU1GiQ7QDs0Py40NTEBDAwMEA8QHhISHjQhJCUxMTQ0NDQ0NDQ0NDQ0NDExNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0MTQxNjQ0NDQ0NDQ0NDQ0NP/AABEIAPUAzgMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAQIDBAUGBwj/xAA+EAACAQIDBAcFBQgCAwEAAAABAgADEQQSIQUxQVEGImFxgZGxBxMyocFSYnKC0SMzQpKisuHwwvEUFXMk/8QAGQEAAgMBAAAAAAAAAAAAAAAAAAQBAgMF/8QAJBEAAgICAgICAwEBAAAAAAAAAAECEQMhEjEiMgRBUWFxkRP/2gAMAwEAAhEDEQA/AMeiRYBiV3xZF90ksOopO6CsptviEuOMUL85JASXjtzG1Qk6RRQwAUgPOLIPOEUPOGqGBDHBrpE2I0vHFp8bwnXtkkDlNYRpdsGXtkLEYtFG+58h58YNpAlZPVOF4MlgdZQNthybKBp42HMmD/3LHTKO+xN/0leSLcWX/u+N4ZQMCLyqw2176MviD9Dvllh3VusrX9R3iSpJlXFoStHmbQrKGtePFQeMaemL/FJKgYrlOsaFMGxvHPdC2+GEHOAMQRrEtYCOqAeMS9LtklRdNd0RmBJi6bDdCKAE6wKjeawhOut4qpa3GFmHCSBXoO2O0k7YwgkjKLDWUGQOljvhrFZe2AU7wIF0Brvi6g7YSUO2JembiBAEQ33x9U03wsmm+KprpJAK3bCSkSQBxjipc75dbPwOVc9rsdF7JSclFWTCLkyjxqZFIO/dz8AOJlK2EqtdsuUffO+dCw2wbtnexPM6hexRx75OGxad+sCx7d3kNJgpN7ZrwX0czwWz2927EWJyjdIB2c19/idx8Z1//wBcgFgotK/FbGpsPhA/3iJLkWUDmBpMpsy7uHA915LwzkG4OvA9nI8xNTiej+hA7bcbdgvw7JncXs5qZsQbeko5slQrRZ4dg6jgw3j6iOmiL75W4R7cdRu/3lLNXB8fl2RjFPkqfYvkhxYhlsN8K0UwEMgcJqYiLAawPUEOqukbCySopEud8cIGsOnlFtTE1ANbEySGMul4nKIt3AiCwgQVii0lJTuN8jlReSkS4mY2ApbjHqQ7YywG6LpqNJJBICC++Cw5xCgX3w3Qb7wIFJS3m8WF7Y3luN8XSXTfAglYPC5nA7RNpg8KBbn/AGjjb085mtjIBdjzA+p+k0nR/E+9V34Fyq/hXQfU+MUyPlkr8DmOPGF/kt0pC0S9MR5HG64gcS5UiZIzVpSZaNVFg6BWmVFenKbH4UOCLb5oMUJV1xMWjdNNGKxWGNNtdx3HnJWD1v5yRtsgnL3H/Mg4Gp1rH/f908oQlxkjPJHlFkxlEVlEUbEaGGx4ToI5rYxUItEKR4x0hbcYllXTUySrAALwCxv2RQUczGFYajnAgTXAIG+EyDS0OoOEIvbSBBWpvkxGAkIP1pMTWZjYTMLxSxDKLx6mBJIEoBePMBEoBeSRTW0CBCAWMVTQWhJTGsdoLAB7EOVoWXS+c5uC3KLe/DeZpejTXwqe7NrlwGP8IBIzW7gPOQ8Lg2qUWprbrix0BuAx8tbS26P4PJhlRhYjN4XYxFezf7OjXjG+qK7F4UoTbFZSd5P/AHH8BXxAI/arUXjKPH9Fqxd2aqzgtdLOVCryIA6x+Wm6Sti7FrU3WzkLc5wxLA3Nxl5W+kmUW+nsupQj9a/JtATlzWmd2rjqhbLTsOZM0VZiKZ7B9JkcfgnqqQlTIedr6cbQlF6VlYTjbbWivr0qjfHih3f6dI2Fqpb9oHS+o3lRzkHF9FGOuu8HexJ52a9xc385I2NsapSuKlRmGuUHeB374PS7snTe1RX9KauTI45sp7jYytwdcF1IINxb5gS06UYUuiAC9ie7x7I+MEURUNMDKgdXAswZNWB7DKyWtdhCLbd9DiACPOindeIYCKZxbSdCLtWciaptEdlh5BaKAvHGQCxliljYC8zeM06QuTc6RVZ9Y2jwKsVVUaWvGSl5IYg2iNLm0kgqgg3x1GjNJjJKrpMhwcVARAdBDptBVbWSQKw5F49UfhEJYaxecHfAA6bb49SYcIhLWkjA0wWAA4yHog1OzAUemo+w4PaSL+suFsLaWuAe48R5yiw9Wz3G9TYdwsLS1/8APSo5VGBZQGZdxUE2Nx321iPKrf7HsXkuL+iWyRdMAGNirCp3Y35br8ZdZE+i0sLW30OY49RgJS4M9a0sMXWqBMpszG4uoyjs01ldhKTrYuRcX3C2/sufWUeS30XjhqNtosXQWlLj2tpLLE4mwlHjahbdIlkT0jSOFpWyuqKCrXF7hgBzJBAj9SqPdgMtnKZAOWawIP5cx8I5gq1MhwHBZL5hvKWAP/IefhIq0yXDHvA5WHrrLrSsxnJJOJGqECAMIeISNhhHMT8UczL7MUBaCtUFgOUR70GKCg6zUwE5FOusR7tRz1jnvANIl2B3AwIEMyjTWDKvC8BUNvvE3A3XgVK3DrH80YW8eRZmPC1eKdgYgDWKECB07ozm1jqPpEjfAB6m8udiU7uDbdc+QlbRUcpfbEQBXPJT6iUyerDpgwd8/fnPp+kk7LAXFt95Mv8Ay+kXgKX7WmOaOfQxG00yVs66FQp/lP8A3ElGo2NQl5JI0T0F32lea9VLk0wb/CQ24ciD+slbPxyVlJU6qcrrxRt9j6iTWS4sReEYrtDjk1pmcxG0ql9EN+djYSvfaNS9hTzH+X/fKX2JwHIfMiQxhAmth6wb/TNfCtUNVAxUM4AJtcA3+ci40gLYR13uSSdBK/F1bqzncoY+Qma7Jb8Sm2Lh+rUe/wC+qNftVGNvp5S5FiLjt+ZH6Sm2ZUtRpjkifzNqZb4T4bcgo77C5mrlfQhPG1tkbEgDfGGpgiSsauo7vqY3cco5g9Tn5fYhqgjqLEq1zHXdV01vNzBkd6fGISPuwIja2HCBAgb4hjHCeyNMvKBUiqNIlmIgpCKeZjwqk0dJjAvHFgQOURHbdkZwzGTsthe0AGBXIG6aLo8+anUB3hflcTPUxfhLro81nZbfEjDx3/SZ5PRkpWy8dglWj3Kv8yyPtlxnJ7Cp9f1kTb+Jy5CDuyHyUGVu1No5gW7M3nrac3JNvSOl8XAkuUhvZGJZMacrWLp1hwa2monQqeJ0185yrYFX3uOzKbqqZTyzE/oJ1NU0EslKK0bTcZf6N4jFKBvlLjMXfdJ+Kw2shVMOJXnJujaEMaVkCnSZ9/w+si9JOphqtuCP/aZeolhKjpBh89J0+0rL5i0vBb2YZp2qRldkVr0kIPGkPC1vUTTUTZrd58N0550Z2gFJo1DYNdQfssDp85uxiNEY8DkfsJ0B7r285eUXFsX580v4Fj261uz6mRS/CSNpNqrflP0kfLeN/HlcTn/IjxkMs4XWKapm1iayCGlrWjIsxLvCDdkWyRs8IFQ7mNBo6z6xATtgBEVe2FY3jd+2ODeJmOC0GusNr3gYRSwACsRJK1yRI7jTSKo3gQPU3Mudhv1xcaymdgBckDvNpYbGrAZ6hFlQHrHQMxFrDnvMxzSSizTGrmkJ6X4gKia7iFPgCPQTBbU2yz3VbgHjxsQLASZ0oxpqWF95vbjbt+UqNm071kB3B1ZtL9VTdtOOgmHx8KrlIY+V8lp8Y9HRfZ3sr3a5jvLNc89bfSdKVdJn9h0QoChcoXQDQ6fwnTeCLG/G80SS8o1JlIZOSX8I9ZZDelrJ7G5hOky4bGf+lIrWSVG1GsrHkCZdV5mOlVfJhqrfcKjvbqj5mWjG3RjkyUrOPubknmSfM3mh2R0gsPd1dQRlzcxwv29szziJtGZQUtMTjNx2jo1LGB0tmDcOWcfQxylWB0HkdDOdUa7r8LEeMvdndIcvVqqWH2hqR3ymOEoS10WyzU1v6NW4BEGQcJGw20KVT4KgJ5Xsw8DrJLuBujSFWgiYhxDdhwiatxa436ySgh1iPexy+l4wVgBEIikU3vElY6o0mVDgvNA0aVZOw+DLpVqbkpU6jseZCkgDyhYUUOJ22EYoq5iDYkmw8OcLD7aXe5NvsoLfO8oIQkuNmSm0ac7dwam4o13bkzqFPfqTIm1Ok9asAiBaVNfhRNbnmzHfKADzPyEdUSqxx+9kubXWhQG9iSSd5OpPeZZ9FqGevuuAvqRK07pq/Z5hxndyNDlUeFyfUSZaWiI+T2dI2QpAFz8IsBa917LC+nLdx01vdo4IldhqANracR2SeW1uwLdqnX+UkDytM3UuzWKlHoNBrFuIhKlPm47CtvTNFNUS2hY9gUi3i1r/ACkcV+S7nL8Mh1qd9JgvaRiMlFaY1LuCSNyhRcX5km3gL8RN9VbMLWyjUE3uxB4X4f7u1vyn2lYsNWSku6mpJ/E5v6KPOWjFJmWSUmtmJaFDIgmhnYgb4qFxioEhSwwm2ayaZ8w5P1vnv+cg2jmGw7O6oguzsqjvJtI6Ds0+ydsis2RlyMbkWNw1uHYZeVhmt2aQ8f0YVEptTFnpZCrcXA+JT36+Jkf3+t7SYTUiuTG4sDEA21ihTG+8BS+sLWaGRWZ46H0kffHUPCZjgoGbyts3Jsyslus1GqzfiKE/4mU2Bg/eV0ThfM3cuv8AjxnT69IOjpwZWXzBEzm6ovGNpnnAaxDRwKQSDvGh7xpEpumgsErCLVhziQsMuOWvpJIpPoBa86D0HoWpqedz5nSc+M6r0VoWpIPuJ6CUkaRpGxwbaSTmkWgukkqJRmyFRDtFERppBYj13sDOE7dx/vcRUqbw7m3Hqjqr8gJ2DpZjPdYaq/EIVX8TdVfmROGmWiZS2LvBG3p2F7xIW8vZnxsW0IvEhICIWHEeUzYezjZ3vMS1QjSktx+N7gfIN5iY2nOvezXAZMJnIsarM/5R1V+S38ZWT8S+OPkXmLp3BmOx2Eyue3WbjErM3til/FymWOVSNs0eUX+inp1LC1o5iCLCMWt3RbPHLOdWypSGrawUIorMxw2HQTD3Z3PDKg8dT9JuFmX6DJagTzdvkAPpNPF5PyZtFeJ5523SyYiun2alYeGc2kJRa0v+nGHyY7ED7Tq4/Oqn1vKB5vF2rFJqm0JeJAiyLwIslrYRkkgPOy7Bp5UQclUfKcdWnmZV5lR5m07dstLKJWeqLR2XWHEkKsYpSSglTQMrGXWPmNVBKhZzb2p421OnRB+Ni5/Cg0+bA/lnMDNV7QMd7zGOAerTApDvGrf1MR4TK2mlFE7HN4jQWKhM0kjoSxgtpAohmBApAToNSdAOZO4T0HsrCClRp0x/AiJ5KBOH9FsN7zFUEO41EY9y9c/2zvZ3TLI/o3xL7ItYSl2jTuCJd1JWYwaGZG9GObiPCFujmNOVyI1a8di7VnNlGpNFdTMNG1jQaOIJUYOl9DR/+ZfxVP7jNDwlB0SS2GTtznzYy+4RSfbGorSOS+0/C5cSj/bSx70J+jfKYZp0j2qEfsftXqeVhf5kTnEYxO4oTzqpMJRwiwIgxwTZC0rQqmbMp5Mp8iDO54BOqJwt10M7psNw9FHG5kRvMAzPKjTC/osUMkU2kV4vDvrMb2MtaJN5Gx+ICI7toEVnPcoJPpHkaZf2j7Q91g3UHrVStMd3xP4WBH5paO2UlpHF8TWLuzt8TMzntLEk/MxkxZiW0mjKJiHMSohgcTFQBsIwooxEGSjV+zmjfF5/sIx8WsB8s07GDpOT+zZbO7fhXy1+s6oraRefsN4l4iakrsWNJYNIGJ3ShrRk9oqM/hIo0k3ai9YeMgkxvG/BHOzKpspyY6hjYYXjqa6DjJNDq3R5MuHpD7iHzF/rLVm0kTBJlRV5Ko8haPVG0ijG0tnL/ag96tIckf5sP0Ewhm29pf72mfuMPJh+sxLTfH6oVzrzYkxdFuHlEGEDrNU6F5RtUSiNJ132eYrPg0HFM6H8rHL/AE5ZyJWuJu/ZdjsprUTzSovbfqN6J5wntFMLqVHR6sYR9YqtUEhqb3A00O7h3ROT2dKMdFvQGk5N7TtpiriRSU3WiCp/G1i/kAo7wZ0jH7R9zhqlYC5Sm7gHcWA6o87ThdSoXJdjdmJZid7Em5J8YziV7FPkvjoiFYwTc9nCLqvc6bvWEJZspFOrYIUEEC1AMRFGJkEpG26Am1/xfQTqFE6TlXQM9Zh976CdSwx0i8+x3F6jjSBiZOqSvxJlDRGX2wesPGV5eWO2eHeZUF41i9RD5C8yrqJcybs5M1RF5vTH9QkdNRLHYi/t6f8A9E9ZLei0Vs6vTia50hpGsQ2kVkOQWznntEpZlR/ssVPcw/VRMC06f0oph0ZTxHkeB85y9xY2PDSaYZeNGXyoU1L8hGJhwptYrQtHsew/KXHRrHmjiab3sGb3bdz6D+rKfCUbCGr3Fr2I3Hjp9YXqivHy5Hb3xtxpJOH0W53mZrotiPfIlQm5I1H2WGjDzE0dR7CLcd2xp5lSSM7072jkwvuQdajqPyJ1z8wo8ZyyvU/hHj+k03T7aWfEZFPwKE7mbrMf7R4TJKJrDxVGWSpO2LEOFAZcpQIUF4V4WFBGCCAQJo2PQMdZu8ek6jh905n0AXRj94+gnS8Pui8n5D0I1BMcqSBipOqSBiTpIBGY22d3fKnvlnts7u8yncmM4+hLP7EHDmwlx0fF8TS/GD5AmU+WXPRZL4qn2Fj5KYS6ZePsjqCGM4k6R1ZHxBizG49mW27uM5nj167Tpu2/hM5ttEdcycfYfIfiQYIZETNxEEBWCCSQa3oBtHJUaixsH66/iUdYeIAP5TNntXaAp03c7kUt32Gg8TYeM5JQrMjK6GzoQyntB9JpulW2VqYdAh/eEMRyCalT2hrDwlWirXkjJVqjOzOxuzEsTzJNzCESoi5JdsESWhFoIAC8F4UEABeEzQQt+nPSAWdA6CUiq68et4NqPlOiUd0xPRZLEjllHkoE29LdF37M6EfRfwNzK/EmT6krsUYFDK7bbrL4yrcSw2yeuPGV5F4zj6EsvuyHfWaLokg/8lTyD+n+YIJEui0fZHQpGxBggirHomZ20dD4zn2NX94eWT+6CCaY+zPP6lWYRggm4iFBBBAkON1RoDffw4C++0EEACBgMKCQAIIIJIAhEwQSACjmFH7RB99PUQQQA6X0Z+Ju8ek2tHdBBF59s6MPRBVJW4zdDgkEMx21T15BBggjUPVCGT2Z/9k=',
		'https://img.freepik.com/photos-premium/portrait-bel-homme-masculin-visage-serieux-homme-elegant-magnifique-sexy_265223-11487.jpg',
		'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
		'data:image/jpeg;base64,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'
	]

	return <div className="flex-1 p-8 flex flex-col items-start gap-4">
		<BreadCrumb routes={[
			{
				name: 'Home',
				url: '/pro'
			},{
				name: 'Studios',
				url: '/pro/studios'
			},{
				name: 'Poivre Noir',
				url: '/pro/studios/poivre-noir'
			}
		]}/>
		<section className='flex items-center justify-between w-full'>
			<Title kind='h1'>Poivre Noir</Title>

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
			Your Guests
		</Title>
		<TimePicker kind={TimePickerKind.SLOT} slots={[
			new Date('2023-12-16T09:00:00'),
			new Date('2023-12-16T09:30:00'),
			new Date('2023-12-10T09:00:00'),
			new Date('2023-12-10T09:30:00'),
			new Date('2023-12-16T10:00:00'),
			new Date('2023-12-16T019:00:00'),
			new Date('2023-12-16T020:00:00'),	
			new Date('2023-12-16T11:00:00'),
			new Date('2023-12-16T18:00:00'),
			new Date('2023-12-16T19:00:00'),
			new Date('2023-12-16T20:00:00')
		]} />
		<TimePicker 
			kind={TimePickerKind.DAY} 
			availables={[
				new Date('2023-12-16T00:00:00'),
				new Date('2023-12-15T00:00:00'),
				new Date('2023-12-14T00:00:00')
			]} 
			defaultSelectedDay={new Date('2023-12-17T00:00:00')}
		/>

		<section className='flex items-center justify-start gap-6'>
			{ guests.map((guest, index) => {
				return  <img key={index} className={ 'rounded-full relative object-cover w-28 h-28 cursor-pointer' } src={guest}/>
			}) }
			

			<Dialog.Root>
				<Dialog.Trigger asChild>
					<div  className={ 'rounded-full relative object-cover w-28 h-28 cursor-pointer bg-opacity-20 bg-zinc-600 flex justify-center items-center' } >
						<AiOutlinePlus size={32} opacity={0.5} />
					</div>
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
					<Dialog.Content className="flex flex-col items-stretch justify-start gap-8 p-4 z-20 bg-gray-600 bg-opacity-50 w-96 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
						<h1 className='font-title text-xl font-bold'>Invite a tattoo artist</h1>
						<fetch.Form method='POST' className='w-full flex flex-col gap-2'>
							<input onChange={(e) => {
								setSearching(true)
								setArtist(e.target.value)
								debounce(e)
							}} 
							value={artist}
							placeholder="Artist's name" type="text" name='artist' className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border-1 border-gray-700 focus:border-red-400 duration-300' />
						
							<input  type="hidden" name='artistId' value={artistId} />
							<input  type="hidden" name='kind' value='POST' />
						
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
									Cancel
									</button>
								</Dialog.Close>
								<button className="outline-none px-4 py-2 bg-gray-700 rounded-md text-white">Invite</button>
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

