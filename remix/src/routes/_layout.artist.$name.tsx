import { Title } from 'src/components/Title'
import { SlStar } from 'react-icons/sl'
import { getArtist } from 'src/utils/requests/artists'
import { LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import {ArtistPostPicture, ArtistPrestation} from 'src/utils/types/artist'
import {useTranslation} from 'react-i18next'


export const loader = async ({ params }: LoaderFunctionArgs) => {
	const { name } = params

	if (!name) {
		throw new Response(null, {
			status: 404,
			statusText: 'Not Found',
		}) 
	}

	const artist = await getArtist({
		name
	})
    console.log(artist)

	return json({
		artist
	})
}

export default function MainPage() {
	const { artist } = useLoaderData<typeof loader>()
    const { t } = useTranslation()

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col justify-center items-center gap-4 relative'>
			<div className="container mx-auto flex w-screen min-h-screen pt-20">
				<div className="w-1/3 px-4 pt-16 justify-center">
					<img className='w-full rounded-full aspect-square' src={artist.picture} alt="tattoo artist picture"/>
				</div>
				<div className="w-2/3 p-16">
					<div className="flex flex-col gap-4">
						<div className="flex flex-row justify-between">
							<div>
								<Title kind="h1" className='z-20 pb-2'>{artist.username}</Title>
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
                            {artist.description}
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4 font-title'>Prestations</Title>
                            {artist.prestations?.length > 0 ?
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {artist.prestations?.map((prestation: ArtistPrestation) => {
                                        return <div key={prestation.picture} className="flex items-center justify-center h-full bg-transparent text-white border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                            <p className="text-center">{prestation.name}</p>
                                        </div>
                                    })}
                                </div>
                            :
                                <p className='opacity-50'>{t('artist-no-prestation')}</p>
                            }
						</div>
						<div className="pt-12">
							<Title kind="h3" className='z-20 pb-4'>Portfolio</Title>
                            {artist.postPictures?.length > 0 ?
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {artist.postPictures?.map((postPicture: ArtistPostPicture) => {
                                        return <img key={postPicture.picture} src={postPicture.picture} alt={postPicture.picture} className="w-full h-48 object-cover"/>
                                    })}
                                </div>
                            :
                                <p>{t('artist-no-post')}</p>
                            }
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

