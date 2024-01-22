import {AiOutlineArrowRight} from 'react-icons/ai'
import {Form} from '@remix-run/react'
import {ResultCard} from '../components/ResultCard.tsx'


export default function MainPage() {


	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<Form className='flex justify-center h-20 items-center mx-auto mt-28 w-1/4' method='POST'>
				<input id='search-bar' autoComplete='off' name="title" type="text" className='w-11/12 bg bg-transparent h-12 border-b-2 border-white text-base outline-none' placeholder='Search for tattoos, cities, studios & artists'/>
				<button className='w-1/12 border-b-2 h-12 border-white cursor-pointer text-base text'>
					<AiOutlineArrowRight className="ml-auto" />
				</button>
			</Form>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-16">
				<ResultCard kind={'artist'} name={'Tattoueur sympa'} rating={3} nbReviews={20} description={'Super description'} picture={'https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg'} />
				<ResultCard kind={'studio'} name={'Cool studio'} location={'Paris'} description={'Super descr.'} picture={'https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg'} />
			</div>

		</main>
	)
}

