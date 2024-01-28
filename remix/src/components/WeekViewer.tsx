import { add, addDays, differenceInDays, isAfter, isBefore, startOfWeek, sub } from 'date-fns'
import { t } from 'i18next'
import { useState } from 'react'
import { Validation } from 'src/utils/types/validation'

export interface WeekViewerProps {
    events: {
        startDate: Date
        endDate: Date
        kind?: Validation
    }[]
}

const months = [
	t('january'),
	t('february'),
	t('march'),
	t('april'),
	t('may'),
	t('june'),
	t('july'),
	t('august'),
	t('september'),
	t('october'),
	t('november'),
	t('december')
]

export const WeekViewer: React.FC<WeekViewerProps> = ({ events }) => {
	const [ viewingDate, setViewingDate ] = useState(startOfWeek(new Date(), {
		weekStartsOn: 1
	}))

	const weekEvents = events.filter((event) => {
		if (isBefore(event.startDate, viewingDate) && isBefore(event.endDate, viewingDate)) {
			return false
		}

		const endOfWeek = addDays(viewingDate, 7)

		if (isAfter(event.startDate, endOfWeek) && isAfter(event.endDate, endOfWeek)) {
			return false
		}
		return true
	})
    
	return <div className='w-full flex flex-col gap-4'>
		<div className='w-full flex items-center justify-between gap-4 backdrop-blur-md rounded-lg bg-black bg-opacity-30'>
			<button className='px-2 py-2 bg-transparent rounded-lg text-white' onClick={() => setViewingDate(sub(viewingDate, {
				weeks: 1
			}))}> Previous </button>
			<span>
                Week of the <b>{viewingDate.getDate()} { months[viewingDate.getMonth()] }</b>
			</span>
			<button className='px-2 py-2 bg-transparent rounded-lg text-white' onClick={() => setViewingDate(add(viewingDate, {
				weeks: 1
			}))}> Next </button>
		</div>
		<div className='relative'>
			<div className='w-full grid grid-cols-7 gap-6'>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        Lundi
					</span>
					<span className='text-xl font-bold'>
						{ viewingDate.getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        Mardi
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 1).getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        
                    Mercredi
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 2).getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        Jeudi
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 3).getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        Vendredi
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 4).getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                       Samedi
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 5).getDate()}
					</span>
				</div>
				<div className='backdrop-blur-md rounded-lg bg-black bg-opacity-50 flex-col flex justify-start items-center h-96'>
					<span>
                        Dimanche
					</span>
					<span className='text-xl font-bold'>
						{ addDays(viewingDate, 6).getDate()}
					</span>
				</div>
			</div>
			<div className='top-0 left-0 w-full grid grid-cols-7 gap-6 absolute '>
				<div className='col-span-7 h-10'>
					{/* Placeholder */}
				</div>
				{ weekEvents.map((event, index) => {
					const startIndex =  isBefore(event.startDate, viewingDate) ? 1 : differenceInDays(event.startDate, viewingDate) + 1
					const duration =( isBefore(event.startDate, viewingDate) ? differenceInDays(event.endDate, viewingDate) : differenceInDays(event.endDate, event.startDate)) + 1

					const flooredDuration = startIndex + duration > 7 ? 8 - startIndex: duration


					return <div key={index} className={`col-span-${flooredDuration} col-start-${startIndex} cursor-pointer rounded-lg bg-opacity-30 ${event.kind === Validation.REFUSED && 'bg-red-500 border-red-500 '}  ${event.kind === Validation.ACCEPTED || !event.kind && 'bg-green-500 border-green-500 '} ${event.kind === Validation.PENDING && 'bg-orange-500 border-orange-500 '} border-1 h-8 flex items-center justify-start px-2 font-bold`}>
						<span>
                            Off Day
						</span>
					</div>
				})}
				
			</div>
		</div>

	</div>
}