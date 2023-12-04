import { Title } from 'src/components/Title';
import { BsShop } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { SlStar } from "react-icons/sl";
import { LuUser } from "react-icons/lu";
import { BsDot } from "react-icons/bs";
import {AiOutlineArrowRight} from "react-icons/ai";
import {Form} from "@remix-run/react";



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

				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">Tattoo Shop</div>
						<div className="flex gap-2 text-sm text-gray-200 font-semibold pb-2">
							<FiMapPin size={20} />
							<span>London</span>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<BsShop size={20} />
							<span>Studio</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">Tattoo Shop</div>
						<div className="flex gap-2 text-sm text-gray-200 font-semibold pb-2">
							<FiMapPin size={20} />
							<span>London</span>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<BsShop size={20} />
							<span>Studio</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">Tattoo Shop</div>
						<div className="flex gap-2 text-sm text-gray-200 font-semibold pb-2">
							<FiMapPin size={20} />
							<span>London</span>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<BsShop size={20} />
							<span>Studio</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>
				<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
					<img className="w-full" src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Sunset in the mountains"/>
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

					<div className="px-6 pb-4 relative z-10">
						<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">John Doe</div>
						<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>5</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>110 reviews</span>
							</div>
						</div>
						<p className="text-gray-500 text-sm pt-2">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla!
						</p>
					</div>
					<div className="px-6 pt-2 pb-4 relative z-10">
						<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
							<LuUser size={20} />
							<span>Artist</span>
						</div>
					</div>
				</div>

			</div>

		</main>
	)
}

