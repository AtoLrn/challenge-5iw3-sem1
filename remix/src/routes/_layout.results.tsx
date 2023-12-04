import {AiOutlineArrowRight} from 'react-icons/ai'
import {Form} from '@remix-run/react'
import {ResultCard} from '../components/ResultCard.tsx'



export default function MainPage() {


	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<Form className='flex md:w-8/12 lg:w-6/12 h-20 items-center gap-8 mx-auto mt-28' method='POST'>
				<input id='search-bar' autoComplete='off' name="title" type="text" className='bg bg-transparent h-16 w-4/5 border-b-2 border-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl outline-none' placeholder='Search for tattoos, cities, studios & artists'/>
				<button className='border-b-2 h-16 border-white w-1/5 cursor-pointer text-base sm:text-lg md:text-xl lg:text-2xl flex  justify-center items-center gap-2' >
					<span>Search</span><AiOutlineArrowRight />
				</button>
			</Form>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-16">
				<ResultCard kind={'artist'} name={'Tattoueur sympa'} rating={3} nbReviews={20} description={'Super description'} picture={'https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg'} />
				<ResultCard kind={'studio'} name={'Cool studio'} location={'Paris'} description={'Super descr.'} picture={'https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg'} />
			</div>

		</main>
	)
}

