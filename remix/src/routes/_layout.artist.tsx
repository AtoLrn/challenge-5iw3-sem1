import { Title } from 'src/components/Title'
import { SlStar } from 'react-icons/sl'


export default function MainPage() {


	return (
		<main className='min-h-screen max-h-screen min-w-full gradient-bg text-white flex flex-col justify-center items-center gap-4 relative'>
			<div className="flex w-screen min-h-screen pt-20">
				<div className="w-1/3 px-4 pt-16 justify-center">
					<img src="https://cdn.pixabay.com/photo/2017/08/06/10/26/woman-2591043_1280.jpg" alt="tattoo artist picture"/>
				</div>
				<div className="w-2/3 p-16 overflow-y-auto max-h-screen">
					<div className="flex flex-col gap-4">
						<div className="flex flex-row justify-between">
							<div>
								<Title kind="h1" className='z-20 pb-2 font-title'>John Doe</Title>
								<div className="flex gap-2">
									<span className="font-bold">Rating :</span>
									<div className="flex">
										<span>5 &nbsp;</span>
										<SlStar size={20} />
									</div>
								</div>
								<div className="flex gap-2">
									<span className="font-bold">Reviews :</span>
									<span>100</span>
								</div>
							</div>
							<div>
								<button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    Book now
								</button>
							</div>
						</div>
						<div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda earum iste qui quisquam similique? Aperiam consectetur consequuntur, ex facere libero minima mollitia nihil nobis ratione repellat reprehenderit soluta ullam ut.
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4 font-title'>Prestations</Title>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								<div className="flex items-center justify-center h-full bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
									<p className="text-center">Tattoo</p>
								</div>
								<div className="flex items-center justify-center h-full bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
									<p className="text-center">Fill</p>
								</div>
								<div className="flex items-center justify-center h-full bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
									<p className="text-center">Piercing</p>
								</div>
								<div className="flex items-center justify-center h-full bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
									<p className="text-center">Barber</p>
								</div>
							</div>
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4 font-title'>Portfolio</Title>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
							</div>
						</div>
						<div className="pt-12">
							<Title kind="h2" className='z-20 pb-4 font-title'>Flashes</Title>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
								<img src="https://png.pngtree.com/background/20230426/original/pngtree-man-with-bird-tattooed-back-in-the-salon-picture-image_2487443.jpg" alt="Image 1" className="w-full h-48 object-cover"/>
							</div>
						</div>

						<form className="max-w-md mx-auto my-8">

							<div className="flex flex-col space-y-4">
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 1
								</label>
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 2
								</label>
								<label className="flex items-center">
									<input type="radio" name="option" className="mr-2"/>
										Option 3
								</label>
							</div>


							<div className="my-4 border-t"></div>


							<label className="block my-4">
								Commentaires :
								<textarea className="w-full h-24 p-2 border" placeholder="Saisissez vos commentaires ici"></textarea>
							</label>


							<button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Envoyer</button>
						</form>


					</div>
				</div>
			</div>
		</main>
	)
}

