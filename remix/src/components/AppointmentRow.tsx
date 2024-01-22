import * as Avatar from '@radix-ui/react-avatar'
import {LuCalendarClock} from 'react-icons/lu'
import {FiMapPin} from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { FaStar } from 'react-icons/fa6'
import { t } from 'i18next'
import * as Dialog from '@radix-ui/react-dialog'
import {Title} from './Title.tsx'

export interface AppointmentRowProps {
    kind: 'current' | 'past',
    artistFirstName: string,
    artistLastName: string,
    appointmentDate: string,
    appointmentTime: string,
    address: string,
    city: string,
    projectDescription: string,
}

export const AppointmentRow: React.FC<AppointmentRowProps> = ({kind, artistFirstName, artistLastName, appointmentDate, appointmentTime, address, city, projectDescription}) => {
	return (
		<div className="flex flex-row items-center gap-8 border-b-1 pb-8 mb-8">
			<div className="w-4/12 flex flex-row items-center gap-4">
				<div className="">
					<Avatar.Root className="AvatarRoot">
						<Avatar.Image
							className="AvatarImage rounded-full w-12 h-12 object-cover"
							src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
							alt="Artist picture"
						/>
					</Avatar.Root>
				</div>
				<div className="font-title text-center text-xl">
					{artistFirstName} {artistLastName}
				</div>
			</div>
			<div className="w-3/12 flex flex-row gap-4">
				<div>
					<LuCalendarClock size={20} />
				</div>
				<div className="flex flex-col text-sm">
					<div>
						{appointmentDate}
					</div>
					<div>
						{appointmentTime}
					</div>
				</div>
			</div>
			<div className="w-3/12 flex flex-row gap-4">
				<div>
					<FiMapPin size={20} />
				</div>
				<div className="flex flex-col text-sm underline">
					<div>
						{address}
					</div>
					<div>
						{city}
					</div>
				</div>
			</div>
			<div className="w-2/12 flex flex-col gap-4">

				<Dialog.Root>
					<Dialog.Trigger asChild>
						<button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
							{t('details')}
						</button>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay className="top-0 left-0 absolute w-screen h-screen bg-zinc-900 bg-opacity-70 z-10 backdrop-blur-sm" />
						<Dialog.Content className="flex flex-col items-stretch justify-start gap-8 p-4 z-20 bg-zinc-600 bg-opacity-30 top-1/2 left-1/2 fixed -translate-x-1/2 -translate-y-1/2 rounded-lg text-white">
							<div>
								<div className="flex flex-row justify-between items-center">
									<Title kind={'h3'}>
										{t('project-description')}
									</Title>
									<Dialog.Close asChild className="hover:cursor-pointer">
										<IoClose size={20} />
									</Dialog.Close>
								</div>
								<div className="pt-6">
									{projectDescription}
								</div>
							</div>

							<div className="flex flex-col">
								{kind === 'past' && (
									<>
										<div className="font-title text-lg pb-2">
											{t('review')} :
										</div>
										<div className="flex flex-row pb-4">
											<FaStar size={20} className="text-gray-200 hover:text-amber-400" />
											<FaStar size={20} className="text-gray-200 hover:text-amber-400" />
											<FaStar size={20} className="text-gray-200 hover:text-amber-400" />
											<FaStar size={20} className="text-gray-200 hover:text-amber-400" />
											<FaStar size={20} className="text-gray-200 hover:text-amber-400" />
										</div>
										<input name="review" type="text" className="rounded-lg p-3 bg-black text-white w-full" placeholder="Leave a comment..."/>
									</>
								)}
							</div>

							<div className='w-full flex items-center justify-end gap-4 border-t-1 border-white pt-4'>
								{kind === 'current' ? (
									<>
										<Dialog.Close asChild>
											<button className="bg-transparent hover:bg-white text-sm text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
												{t('cancel-appointment')}
											</button>
										</Dialog.Close>
										<Dialog.Close asChild>
											<button className="bg-transparent hover:bg-white text-sm text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
												{t('reschedule')}
											</button>
										</Dialog.Close>
									</>
								) : (
									<>
										<Dialog.Close asChild>
											<button className="bg-transparent hover:bg-white text-sm text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
												{t('new-appointment')}
											</button>
										</Dialog.Close>
									</>
								)}
							</div>

						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>

			</div>
		</div>
	)
}
