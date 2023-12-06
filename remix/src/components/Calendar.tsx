import { AnimatePresence, motion as m } from 'framer-motion'
import { useState } from 'react'

export interface CalendarProps {
    selectedDate?: Date
}

const wekkDays = ['Mon', 'Tue', 'Wes', 'Thu', 'Fri', 'Sat', 'Sun']

const getDaysArray = (days: number): number[] => {
	const allDays = []
	for (let i = 1; i <= days; i++) {
		allDays.push(i)
	}

	return allDays
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate }) => {
	const [ selectMode, setSelectMode ] = useState<'days' | 'hours'>('days')
	const today = selectedDate ?? new Date()
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
	const numberOfDaysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
	const leftDays = (firstDayOfMonth.getDate() - numberOfDaysInMonth) % 7

	const days = getDaysArray(numberOfDaysInMonth)

	return <div className="flex w-96 h-80 relative items-start align-middle overflow-hidden gap-1 p-2 border-1 border-zinc-600 bg-zinc-700 bg-opacity-10 rounded-md flex-wrap">
		<AnimatePresence mode='wait'>
			{ selectMode === 'days' &&
			<m.div 
				key='calendar-days'
				initial={{ transform: 'translateX(-100%)' }}
				animate={{ transform: 'translateX(0%)' }}
				exit={{ transform: 'translateX(-100%)' }}
				
				className="grid grid-cols-7 w-full gap-1 flex-1">
				{ wekkDays.map(day => {
					return <div key={day} className="col-span-1 aspect-square backdrop-blur-3xl rounded-sm text-white font-bold flex items-center justify-center h-12">
						{ day }
					</div>
				}) }
				<div className={`col-span-${firstDayOfMonth.getDate()} bg-zinc-900 bg-opacity-70 rounded-sm text-black flex items-center justify-center cursor-pointer h-12`}>
				</div>
				{ days.map(day => {
					return <div onClick={() => setSelectMode('hours')} key={day} className={`col-span-1 aspect-square backdrop-blur-3xl rounded-sm font-bold  ${ day % 3 === 0 ? 'bg-green-600 cursor-pointer text-white' : 'opacity-70 bg-red-800 cursor-not-allowed text-white'} flex items-center justify-center h-12 `}>
						{ day }
					</div>
				}) }
				<div className={`col-span-${Math.abs(leftDays) + 1} bg-zinc-900 bg-opacity-70 rounded-sm text-black flex items-center justify-center cursor-pointer h-12`}>
				</div>
			</m.div>
			}
			{
				selectMode === 'hours' && <m.div
					className="grid grid-cols-6 w-full flex-1 gap-1"
					key='calendar-hours'
					initial={{ transform: 'translateX(100%)' }}
					animate={{ transform: 'translateX(0%)' }}
					exit={{ transform: 'translateX(100%)' }}
				>
					<div onClick={() => setSelectMode('days')} className={'col-span-6 backdrop-blur-3xl rounded-sm font-bold cursor-pointer text-white flex items-center justify-start h-12 px-4'}>
						Back
					</div>
					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
						12:00
					</div>
					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
						13:00
					</div>
					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
						14:00
					</div>
					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
						15:00
					</div>
				</m.div>
			}
			
			
		</AnimatePresence>
		
	</div>
}