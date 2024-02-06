import { Title } from 'src/components/Title'
import {Channel} from 'src/utils/types/channel'
import { t } from 'i18next'
import {Link} from '@remix-run/react'
import { MessagePreview } from 'src/components/Messages/MessagePreview'

export interface ResultCardProps {
    channels: Channel[];
}


export const MessageSide: React.FC<ResultCardProps> = ({channels}) => {
	return (
		<div className="w-1/3 flex flex-col h-full">
			<div className="sticky top-0 px-4 py-6 border-b">
				<Title kind={'h3'}>
					{t('conversations')}
				</Title>
			</div>

			<div className="h-full overflow-y-scroll">

				{channels.map((channel: Channel) => {
					return <Link key={channel.id} to={`/messages/${channel.id}`}>
						<MessagePreview 
							picture={channel.tattooArtist.picture}
							name={channel.tattooArtist.username}
							messages={channel.messages}
						/>
					</Link>
				})}
			</div>

		</div>
	)
}
