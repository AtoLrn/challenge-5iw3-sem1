import { t } from 'i18next'
import { Title } from 'src/components/Title'

export default function MainPage() {


	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
                        {t('login')}
					</Title>
					{/* /PAGE TITLE */}

					{/* LOGIN FORM */}
					<form action="" className="flex flex-col">
						<input id="email" type="email" name="email" placeholder="Email Address" className="bg-transparent outline-none border-white border-b hover:border-b-[1.5px] mb-8 placeholder-gray-300 transition ease-in-out duration-300"/>
						<input id="password" type="password" name="password" placeholder="Password" className="bg-transparent outline-none border-white border-b hover:border-b-[1.5px] mb-8 placeholder-gray-300 transition ease-in-out duration-300"/>

						<div className="flex items-center justify-between">
							<button type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                {t('login-to-your-account')}
							</button>

							<a href="#" className="inline-block align-baseline font-bold text-sm text-gray-300 hover:text-white transition-all">
                                {t('forgot-password')}
							</a>
						</div>
					</form>
					{/* /LOGIN FORM */}
				</div>

				<div className="hidden sm:w-full"></div>

			</div>

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg" alt="login background" />
			</div>
		</main>
	)
}

