import React from 'react'

export interface MessageProps {
    kind: 'sent' | 'received';
    message: string;
    date: string;
    time: string;
}

export const Message: React.FC<MessageProps> = ({ kind, message, date, time }) => {

	const messageBoxClasses = `
        py-3 px-4 mb-2 rounded-2xl max-w-[70%]
        ${kind === 'sent' ? 'bg-zinc-800 text-white rounded-bl-sm' : 'bg-white text-black rounded-br-sm'}
    `

	const containerClasses = `
        flex flex-col
        ${kind === 'sent' ? 'items-start' : 'items-end justify-end'}
    `

	const textClasses = `
        text-gray-400 text-xs
        ${kind === 'sent' ? 'text-left' : 'text-right'}
    `

	return (
		<div className={containerClasses}>
			<div className={messageBoxClasses}>
				{message}
			</div>
			<div className={textClasses}>
				{date} - {time}
			</div>
		</div>
	)
}
