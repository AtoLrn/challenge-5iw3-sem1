import * as Avatar from '@radix-ui/react-avatar'
import { Message as MessageI } from '../../utils/types/message'
import { formatDate } from 'src/utils/date';
import { t } from 'i18next'

export interface MessagePreviewProps {
    picture: string;
    name: string;
    messages: MessageI[];
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({picture, name, messages}) => {
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
                    { messages?.length > 0 ?
                        <p>{messages[messages.length - 1]?.content}</p>
                        :
                        <p>{t('chat-empty-last-message')}</p>
                    }
				</div>
			</div>
			<div className="w-1/5 text-xs text-right flex flex-col">
				<div className="pb-2 text-gray-400">
                    { messages?.length > 0 ?
                        <p>{formatDate(messages[messages.length - 1]?.createdAt as string)}</p>
                        :
                        null
                    }
				</div>
			</div>
		</div>
	)
}
