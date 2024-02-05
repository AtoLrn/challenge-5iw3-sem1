import React from 'react'

export interface MessageProps {
    kind: 'sent' | 'received';
    picture: string | null;
    message: string;
    date: string;
}

export const Message: React.FC<MessageProps> = ({ kind, picture, message, date }) => {

	const messageBoxClasses = `
        py-3 px-4 mb-2 rounded-2xl max-w-[70%] flex flex-col
        ${kind === 'received' ? 'bg-zinc-800 text-white rounded-bl-sm items-start' : 'bg-white text-black rounded-br-sm items-end justify-end'}
    `

	const containerClasses = `
        flex flex-col
        ${kind === 'received' ? 'items-start' : 'items-end justify-end'}
    `

	const dateClasses = `
        text-gray-400 text-xs
        ${kind === 'received' ? 'text-left' : 'text-right'}
    `

	return (
		<div className={containerClasses}>
			<div className={messageBoxClasses}>
				{ picture ? <a href={picture} target='_blank'><img src={picture} alt={picture} /></a> : null}
				<p>{message}</p>
			</div>
			<div className={dateClasses}>
				{date}
			</div>
		</div>
	)
}
