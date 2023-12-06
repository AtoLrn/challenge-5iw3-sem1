import { Title } from 'src/components/Title'
import {PrestationButtons} from 'src/components/PrestationButtons'
import {Form} from '@remix-run/react'
import {TextArea} from '../components/TextArea.tsx'


export default function MainPage() {


	return (
		<main className='min-h-screen max-h-screen min-w-full gradient-bg text-white flex flex-col justify-center items-center gap-4 relative'>
			<div className="flex w-screen min-h-screen pt-20">
				<div className="w-1/3 px-4 pt-16 justify-center">
					<img src="https://cdn.pixabay.com/photo/2017/08/06/10/26/woman-2591043_1280.jpg" alt="tattoo artist picture"/>
				</div>
				<div className="w-2/3 p-16 overflow-y-auto max-h-screen">
					<div className="flex flex-col gap-8">
						<Title kind="h1" className='font-title'>John Doe</Title>
						<Form className='flex flex-col gap-4' method='POST'>
							<Title kind="h4" className='font-title'>Choose a prestation</Title>
							<PrestationButtons />
							<Title kind="h4" className='font-title pt-4'>Tell me more about your project...</Title>
							<TextArea name={'prestationDescription'} className={'w-full'} height={'h-48'} placeholder={'Give me as much details as possible'}/>
							<button className="w-fit bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 ml-auto focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                Get an appointment
							</button>
						</Form>
					</div>
				</div>
			</div>
		</main>
	)
}

