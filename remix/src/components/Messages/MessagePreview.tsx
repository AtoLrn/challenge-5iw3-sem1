import * as Avatar from '@radix-ui/react-avatar'

export interface MessagePreviewProps {
    picture: string;
    name: string;
    message: string;
    date?: string;
    time: string;
    unreadMessages?: number;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({picture, name, message, date, time, unreadMessages}) => {
	return (
		<div className="flex items-center p-4 hover:cursor-pointer hover:bg-black hover:bg-opacity-50">
			<div className="w-1/5">
				<Avatar.Root className="AvatarRoot">
					<Avatar.Image
						className="AvatarImage rounded-full w-12 h-12 object-cover"
						src={picture}
						alt="Profile picture"
					/>
				</Avatar.Root>
			</div>
			<div className="w-3/5 flex flex-col">
				<div className="font-title pb-2">
					{name}
				</div>
				<div className="text-sm truncate text-gray-400">
					{message}
				</div>
			</div>
			<div className="w-1/5 text-xs text-right flex flex-col">
				<div className="pb-2 text-gray-400">
					{date && `${date} - `}
					{time}
				</div>
				{unreadMessages > 0 && (
					<div>
						<div className="font-bold bg-white text-black rounded-xl w-fit px-2 py-1 ml-auto">
							{unreadMessages}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
