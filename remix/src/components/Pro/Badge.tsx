import { Validation } from 'src/utils/types/validation'

export interface BadgeProps {
    state: Validation
}

export const Badge: React.FC<BadgeProps> = ({ state }) => {
	return <span className={`text-xs px-2 py-1 rounded-md bg-opacity-30 border-1 ${state === Validation.REFUSED && 'bg-red-500 border-red-500 '}  ${state === Validation.ACCEPTED && 'bg-green-500 border-green-500 '} ${state === Validation.PENDING && 'bg-orange-500 border-orange-500 '}`}>{ state }</span>
}