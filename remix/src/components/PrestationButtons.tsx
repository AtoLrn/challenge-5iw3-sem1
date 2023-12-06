import { useState } from 'react'

export const PrestationButtons = () => {
	const [selected, setSelected] = useState(null)

	const handleClick = (index) => {
		setSelected(index)
	}

	const gridItems = [
		'Tattoo',
		'Fill',
		'Piercing',
		'Barber'
	]

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			{gridItems.map((item, index) => (
				<div
					key={index}
					onClick={() => handleClick(index)}
					className={`flex items-center justify-center h-full cursor-pointer ${
						selected === index ? 'bg-white text-black' : 'bg-transparent text-white'
					} hover:bg-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300`}
				>
					<p className="text-center">{item}</p>
				</div>
			))}
		</div>
	)
}
