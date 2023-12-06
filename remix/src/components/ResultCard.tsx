import {SlStar} from 'react-icons/sl'
import {BsDot, BsShop} from 'react-icons/bs'
import {LuUser} from 'react-icons/lu'
import {FiMapPin} from 'react-icons/fi'

export interface ResultCardProps {
    kind: 'artist' | 'studio';
    name: string;
    rating?: number;
    nbReviews?: number;
    location?: string;
    description: string;
    picture: string;
}


export const ResultCard: React.FC<ResultCardProps> = ({kind, name, rating, nbReviews, description, picture}) => {
	return (
		<div className="overflow-hidden shadow-lg bg-zinc-950 rounded-sm relative h-fit cursor-pointer">
			<img className="w-full" src={picture} alt="tattoo artist picture" />
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black"></div>

			<div className="px-6 pb-4 relative z-10">
				<div className="font-bold font-title tracking-xl text-xl md:text-base lg:text-xl xl:text-xl mb-2">{name}</div>
				<div className="flex gap-1.5 text-sm text-gray-200 font-semibold pb-2">
					{kind === 'artist' ? (
						<>
							<div className="flex gap-2">
								<SlStar size={20} />
								<span>{rating}</span>
							</div>
							<div>
								<BsDot size={20} />
							</div>
							<div>
								<span>{nbReviews} reviews</span>
							</div>
						</>
					) : (
						<>
							<FiMapPin size={20} />
							<span>London</span>
						</>
					)}
				</div>
				<p className="text-gray-500 text-sm pt-2">
					{description}
				</p>
			</div>
			<div className="px-6 pt-2 pb-4 relative z-10">
				<div className="flex items-center gap-2 bg-gray-200 text-sm font-semibold text-gray-700 rounded-full px-3 py-1 w-fit">
					{kind === 'artist' ? (
						<>
							<LuUser size={20} />
							<span>Artist</span>
						</>
					) : (
						<>
							<BsShop size={20} />
							<span>Studio</span>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
