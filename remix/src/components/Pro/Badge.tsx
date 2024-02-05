import { Kind } from 'src/utils/types/kind'
import { Validation } from 'src/utils/types/validation'

export interface BadgeProps {
    state: Validation | Kind
}

type StateValue = Validation | Kind;

export const Badge: React.FC<BadgeProps> = ({ state }) => {
	let classNames = 'text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 '

	const stateAsString: StateValue = state.toString() as StateValue

	if (Object.values(Validation).includes(state as Validation)) {
		switch (state) {
		case Validation.REFUSED:
			classNames += 'bg-red-500 border-red-500'
			break
		case Validation.ACCEPTED:
			classNames += 'bg-green-500 border-green-500'
			break
		case Validation.PENDING:
			classNames += 'bg-orange-500 border-orange-500'
			break
		}
	} else if (Object.values(Kind).includes(state as Kind)) {
		switch (state) {
		case Kind.TATTOO:
			classNames += 'bg-blue-500 border-blue-500'
			break
		case Kind.JEWELERY:
			classNames += 'bg-purple-500 border-purple-500'
			break
		case Kind.BARBER:
			classNames += 'bg-yellow-500 border-yellow-500'
			break
		}
	}

	return <span className={classNames}>{stateAsString}</span>
}
