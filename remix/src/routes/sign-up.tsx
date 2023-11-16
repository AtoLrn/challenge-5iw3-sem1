import { Title } from 'src/components/Title'
import {NavLink} from '@remix-run/react'

export default function MainPage() {


	return (
		<main className='min-h-screen min-w-full bg-black text-white flex flex-col justify-center items-center gap-4 relative'>

			<div className="min-h-screen min-w-full z-20 flex flex-row flex-wrap">

				<div className="w-full sm:w-1/2 p-20 flex flex-col justify-center">

					{/* PAGE TITLE */}
					<Title kind="h1" className="z-20 pb-20">
                        Sign up
					</Title>
					{/* /PAGE TITLE */}

					{/* REGISTER FORM */}
					<form action="" className="flex flex-col">
						<Title kind="h4" className="z-20 pb-4">
                            Identity
						</Title>
						<div className="flex flex-row gap-4 mb-8">
							<input type="text" name="firstname" placeholder="First Name" className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
							<input type="text" name="lastname" placeholder="Last Name" className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
							<input type="text" name="nickname" placeholder="Nickname" className="w-1/3 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<Title kind="h4" className="z-20 pb-4 pt-2">
                            Account
						</Title>
						<div className="flex flex-row gap-4 mb-8">
							<input type="email" name="email" placeholder="Email Address" className="w-full bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<div className="flex flex-row gap-4 mb-10">
							<input type="password" name="password" placeholder="Password" className="w-1/2 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
							<input type="password" name="passwordConfirm" placeholder="Confirm Password" className="w-1/2 bg-transparent outline-none border-white border-b hover:border-b-[1.5px] placeholder-gray-300 transition ease-in-out duration-300"/>
						</div>
						<div className="checkbox-container flex flex-row gap-3 mb-4 items-center">
							<input id="tattooArtist" type="checkbox" name="tattooArtist" className="checkBox cursor-pointer"/>
							<label htmlFor="tattooArtist" className="cursor-pointer">I am a tattoo artist</label>
						</div>
						<div className="checkbox-container flex flex-row gap-3 mb-10 items-center">
							<input id="shopOwner" type="checkbox" name="shopOwner" className="checkBox cursor-pointer"/>
							<label htmlFor="shopOwner" className="cursor-pointer">I am a tattoo-shop owner</label>
						</div>
						<div className="flex items-center justify-between">
							<button type="submit" className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                Create your account
							</button>

							<a href="#" className="inline-block align-baseline font-bold text-sm text-gray-300 hover:text-white transition-all">
								<NavLink to='/login'>
                                    Already have an account ?
								</NavLink>
							</a>
						</div>
					</form>
					{/* /REGISTER FORM */}
				</div>

				<div className="hidden sm:w-full"></div>

			</div>

			<div className='absolute top-0 left-0 w-1/2 h-screen object-cover z-10 bg-black' style={{ boxShadow: '50px 0px 50px 13px rgba(0,0,0,9)' }}></div>
			<div className='absolute top-0 left-1/2 w-1/2 z-0 h-screen' style={{ filter: ' grayscale(100%) sepia(100%) blur(1px) brightness(30%) hue-rotate(300deg) saturate(495%) contrast(150%)'}}>
				<img className='w-screen h-screen object-cover z-0' src="https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg" alt="sign-up background" />
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
		</main>
	)
}

