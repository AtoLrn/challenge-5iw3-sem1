import {useTranslation} from 'react-i18next'
import { Kind } from 'src/utils/types/kind'
import { Validation } from 'src/utils/types/validation'

export interface BadgeProps {
    state: Validation | Kind
}

export const Badge: React.FC<BadgeProps> = ({ state }) => {
	const { t } = useTranslation()

	let classNames = 'text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 '

	let translatedState

	if (Object.values(Validation).includes(state as Validation)) {
		switch (state) {
		case Validation.REFUSED:
			classNames += 'bg-red-500 border-red-500'
			translatedState = t('refused')
			break
		case Validation.ACCEPTED:
			classNames += 'bg-green-500 border-green-500'
			translatedState = t('accepted')
			break
		case Validation.PENDING:
			classNames += 'bg-orange-500 border-orange-500'
			translatedState = t('pending')
			break
		}
	} else if (Object.values(Kind).includes(state as Kind)) {
		switch (state) {
		case Kind.TATTOO:
			classNames += 'bg-blue-500 border-blue-500'
			translatedState = t('tattoo')
			break
		case Kind.JEWELERY:
			classNames += 'bg-purple-500 border-purple-500'
			translatedState = t('jewelry')
			break
		case Kind.BARBER:
			classNames += 'bg-yellow-500 border-yellow-500'
			translatedState = t('barber')
			break
		}
	}

	return <span className={classNames}>{translatedState}</span>
}
