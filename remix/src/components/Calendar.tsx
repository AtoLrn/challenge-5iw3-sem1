import * as Popover from '@radix-ui/react-popover'
import { useEffect, useState } from 'react'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'


export enum TimePickerKind {
	DAY,
	RANGE,
	SLOT
}
export type TimePickerProps = ({
	kind: TimePickerKind.DAY
	defaultSelectedDay?: Date
	availables?: Date[]
	maxDate?: Date,
	minDate?: Date
} | {
	kind: TimePickerKind.SLOT,
	defaultSelectedSlot?: Date
	slots: Date[]
}) & {
	name?: string
	onChange?: (date: Date) => unknown
}

const getDaysInMonth = (year: number, month: number): number => {
	return new Date(year, month, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
	return new Date(year, month, 1).getDay()
}

const generateDaysOfMonth = (days: number): number[] => {
	return [... Array(days)].map((_, index) => index + 1)
}

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]

export interface CalendarProps {
	defaultValue?: Date
	availableDays?: Date[]
	onChange?: (event: Date) => unknown
	maxSelectableDay?: Date
	minSelectableDay?: Date
	viewingDate: Date 
}

const isDayAvailable = (date: Date, available?: Date[], max?: Date, min?: Date) => {
	if (available) {
		return available.some((availableDate) => {
			return availableDate.getDate() === date.getDate() 
			&& availableDate.getMonth() === date.getMonth() 
			&& availableDate.getFullYear() === date.getFullYear() 
		})
	}

	if (min && date.getTime() <  min.getTime()) {
		return false
	}

	if (max && date.getTime() > max.getTime()) {
		return false
	}

	return true


}

const Calendar: React.FC<CalendarProps> = ({ onChange, defaultValue, maxSelectableDay, minSelectableDay, viewingDate, availableDays }) => {
	const [ selectedDate, setSelectedDay ] = useState<Date>(defaultValue ?? new Date())

	const [ selectedMonth, setSelectedMonth ] = useState<number>(viewingDate.getMonth())
	const [ selectedYear, setSelectedYear ] = useState<number>(viewingDate.getFullYear())

	useEffect(() => {
		setSelectedMonth(selectedDate.getMonth())
		setSelectedYear(selectedDate.getFullYear())

		onChange?.(selectedDate)
	}, [selectedDate])

	useEffect(() => {
		setSelectedMonth(viewingDate.getMonth())
		setSelectedYear(viewingDate.getFullYear())

	}, [viewingDate])

	

	useEffect(() => {
		if (defaultValue) {
			setSelectedMonth(defaultValue.getMonth())
			setSelectedYear(defaultValue.getFullYear())
		}

	}, [defaultValue])



	const daysInMonth = getDaysInMonth(selectedYear, selectedMonth)

	const firstDayPosition =  getFirstDayOfMonth(selectedYear, selectedMonth)

	const days = generateDaysOfMonth(daysInMonth)

	return <div className='grid grid-cols-7 gap-1 text-sm'>
		{[ 'Mo', 'Tu', 'We', 'Th', 'Fr', 'St', 'Su'].map((day) => {
			return <div key={day} className="col-span-1 aspect-square backdrop-blur-3xl rounded-sm text-white font-bold flex items-center justify-center h-6">
				{day}
			</div>
		})}
		{firstDayPosition !== 1 && <div className={`col-span-${firstDayPosition - 1} bg-opacity-70 aspect-square backdrop-blur-3xl rounded-sm text-slate-300 font-bold flex items-center justify-center h-6`}>
	
		</div> }

		{days.map((day) => {
			const dayDate = new Date(selectedYear, selectedMonth, day)
			const isAvailable = isDayAvailable(dayDate, availableDays, maxSelectableDay, minSelectableDay)

			return <div 
				onClick={isAvailable ? () => setSelectedDay(dayDate) : undefined}
				key={day} 
				className={`${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40' } col-span-1 aspect-square backdrop-blur-3xl text-white font-bold flex items-center justify-center h-8 ${selectedDate.getDate() === day && selectedDate.getMonth() === selectedMonth && selectedDate.getFullYear() === selectedYear  ? 'bg-slate-700' : 'hover:bg-slate-700' } hover:bg-opacity-70 rounded-full`}>
				{ day }
			</div>
		})}

	</div>
}

const getDaysForSlots = (slots: Date[]): Date[] => {
	return slots.reduce<Date[]>((acc, val) => {
		const exist = acc.some((existingDate) => {
			return existingDate.getDate() === val.getDate() 
			&& existingDate.getMonth() === val.getMonth() 
			&& existingDate.getFullYear() === val.getFullYear() 
		})
		if (!exist) {
			return [...acc, val]
		}

		return acc
	}, [])
}

const getSlotsForDays = (day: Date, slots: Date[]) => {
	return slots.filter((slot) => day.getDate() === slot.getDate()
	&& day.getMonth() === slot.getMonth()
	&& day.getFullYear() === slot.getFullYear())
}

export const TimePicker: React.FC<TimePickerProps> = (props) => {
	const [ selectedDate, setSelectedDay ] = useState<Date>(new Date)
	const [ viewingDate, setViewingDay ] = useState<Date>(selectedDate)

	const [ selectedMonth, setSelectedMonth ] = useState<number>(selectedDate.getMonth())
	const [ selectedYear, setSelectedYear ] = useState<number>(selectedDate.getFullYear())

	const [ selectedSlot, setSelectedSlot ] = useState<Date | undefined>(undefined)

	useEffect(() => {
		setSelectedMonth(selectedDate.getMonth())
		setSelectedYear(selectedDate.getFullYear())
	}, [selectedDate])


	useEffect(() => {
		setViewingDay(new Date(selectedYear, selectedMonth, 1))
	}, [selectedYear, selectedMonth])


	return  <>
		<input type="hidden" name={props.name} value={`${ selectedDate.getDate().toString().padStart(2, '0') }-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`} />
		<Popover.Root>

			<Popover.Trigger asChild>
				<span className='flex items-center gap-4 cursor-pointer outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-700 hover:border-red-400 duration-300'>
					{ props.kind === TimePickerKind.DAY && <span>{ selectedDate.getDate().toString().padStart(2, '0') }-{(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-{selectedDate.getFullYear()}</span>}
					{ props.kind === TimePickerKind.SLOT && (selectedSlot 
						? <><span>{ selectedSlot.getDate() }-{selectedSlot.getMonth()}-{selectedSlot.getFullYear()}</span><span>{ selectedSlot.getHours().toString().padStart(2, '0') }h{selectedSlot.getMinutes().toString().padStart(2, '0') }</span></>
						: <span>Please select a slot</span>) }
				</span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content 
					align='start'
					className="text-white top-0 left-0 outline-none z-30 flex flex-col justify-center p-4 px-4 gap-4 backdrop-blur-lg rounded-md border border-gray-700 bg-black bg-opacity-70" sideOffset={5}>
				
					<span className='flex w-full items-center justify-between'>
						<span className='cursor-pointer' onClick={() => setSelectedMonth(month => {
							if (month == 0) {
								setSelectedYear(year => year - 1)
								return 11
							} 
							return month - 1
						})}><IoIosArrowBack /></span>
						<span>{ months[selectedMonth] } {selectedYear}</span>
						<span className='cursor-pointer' onClick={() => setSelectedMonth(month => {
							if (month == 11) {
								setSelectedYear(year => year + 1)
								return 0
							} 
							return month + 1
						})}><IoIosArrowForward /></span>
					</span>
					<div className='flex items-center gap-2'>
						<span className='outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-700 hover:border-red-400 duration-300 flex-1'>
							{ months[selectedDate.getMonth()] } { selectedDate.getDate() }, { selectedDate.getFullYear() }
						</span>
						<span 
							onClick={() => setSelectedDay(new Date())}
							className='cursor-pointer outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-700 hover:border-red-400 duration-300'>
						Today
						</span>
					</div>

					<div className='flex items-start gap-2'>
						{ props.kind === TimePickerKind.DAY && <Calendar 
						
							maxSelectableDay={props.maxDate}
							minSelectableDay={props.minDate}
							onChange={setSelectedDay} defaultValue={props.defaultSelectedDay ?? selectedDate} viewingDate={viewingDate} availableDays={props.availables} /> }
						{ props.kind === TimePickerKind.SLOT && <Calendar onChange={setSelectedDay} defaultValue={selectedDate} viewingDate={viewingDate} availableDays={getDaysForSlots(props.slots)} /> }
					
						{/* defaultStartDate?: Date,
	defaultEndDate?: Date,
	maxDate?: Date,
	minDate?: Date */}
						{ props.kind === TimePickerKind.SLOT && <div className='flex flex-col items-stretch gap-2 h-52 overflow-auto'>
							{ getSlotsForDays(selectedDate, props.slots).map((slot) => {
								return <div 
									onClick={() => setSelectedSlot(slot)}
									key={slot.getTime()} className='cursor-pointer outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-600 hover:border-red-400 duration-300'>
									{ slot.getHours().toString().padStart(2, '0')}
								h
									{ slot.getMinutes().toString().padStart(2, '0') }
								</div>
							}) }
						</div> }
					
					</div>
				
					<hr className='w-full opacity-30' />
					<div className='w-full flex items-center gap-1'>
						<Popover.Close  
							className='flex-1 cursor-pointer outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-700 hover:border-red-400 duration-300'>
						Cancel
						</Popover.Close >
						<Popover.Close
							onClick={() => {
								props.onChange?.(selectedDate)
							}}
							className='flex-1 cursor-pointer outline-none bg-opacity-30 backdrop-blur-lg bg-black px-2 py-1 text-base rounded-md border border-gray-600 hover:border-red-400 duration-300'>
						Confirm
						</Popover.Close >
					</div>
				
					{/* <Popover.Close className="PopoverClose" aria-label="Close">
					</Popover.Close> */}
					{/* <Popover.Arrow className="PopoverArrow" /> */}
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</>
}


// export const Calendar: React.FC<CalendarProps> = ({ selectedDate }) => {
// 	const [ selectMode, setSelectMode ] = useState<'days' | 'hours'>('days')
// 	const today = selectedDate ?? new Date()
// 	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2)
// 	const numberOfDaysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
// 	const leftDays = (firstDayOfMonth.getDate() - numberOfDaysInMonth) % 7

// 	const days = getDaysArray(numberOfDaysInMonth)

// 	return <div className="flex w-96 h-80 relative items-start align-middle overflow-hidden gap-1 p-2 border-1 border-zinc-600 bg-zinc-700 bg-opacity-10 rounded-md flex-wrap">
// 		<AnimatePresence mode='wait'>
// 			{ selectMode === 'days' &&
// 			<m.div 
// 				key='calendar-days'
// 				initial={{ transform: 'translateX(-100%)' }}
// 				animate={{ transform: 'translateX(0%)' }}
// 				exit={{ transform: 'translateX(-100%)' }}
				
// 				className="grid grid-cols-7 w-full gap-1 flex-1">
// 				{ wekkDays.map(day => {
// 					return <div key={day} className="col-span-1 aspect-square backdrop-blur-3xl rounded-sm text-white font-bold flex items-center justify-center h-12">
// 						{ day }
// 					</div>
// 				}) }
// 				<div className={`col-span-${firstDayOfMonth.getDate()} bg-zinc-900 bg-opacity-70 rounded-sm text-black flex items-center justify-center cursor-pointer h-12`}>
// 				</div>
// 				{ days.map(day => {
// 					return <div onClick={() => setSelectMode('hours')} key={day} className={`col-span-1 aspect-square backdrop-blur-3xl rounded-sm font-bold  ${ day % 3 === 0 ? 'bg-green-600 cursor-pointer text-white' : 'opacity-70 bg-red-800 cursor-not-allowed text-white'} flex items-center justify-center h-12 `}>
// 						{ day }
// 					</div>
// 				}) }
// 				<div className={`col-span-${Math.abs(leftDays) + 1} bg-zinc-900 bg-opacity-70 rounded-sm text-black flex items-center justify-center cursor-pointer h-12`}>
// 				</div>
// 			</m.div>
// 			}
// 			{
// 				selectMode === 'hours' && <m.div
// 					className="grid grid-cols-6 w-full flex-1 gap-1"
// 					key='calendar-hours'
// 					initial={{ transform: 'translateX(100%)' }}
// 					animate={{ transform: 'translateX(0%)' }}
// 					exit={{ transform: 'translateX(100%)' }}
// 				>
// 					<div onClick={() => setSelectMode('days')} className={'col-span-6 backdrop-blur-3xl rounded-sm font-bold cursor-pointer text-white flex items-center justify-start h-12 px-4'}>
// 						Back
// 					</div>
// 					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
// 						12:00
// 					</div>
// 					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
// 						13:00
// 					</div>
// 					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
// 						14:00
// 					</div>
// 					<div onClick={() => setSelectMode('days')} className={'col-span-2 backdrop-blur-3xl rounded-sm font-bold bg-green-600 cursor-pointer text-white opacity-70  flex items-center justify-center h-12 '}>
// 						15:00
// 					</div>
// 				</m.div>
// 			}
			
			
// 		</AnimatePresence>
		
// 	</div>
// }
