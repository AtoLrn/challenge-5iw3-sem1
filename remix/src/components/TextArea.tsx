export interface TextAreaProps {
    placeholder: string,
    name: string,
    className?: string
    height?: string
}

export const TextArea: React.FC<TextAreaProps> = ({ placeholder, name, className, height }) => {
	return (
		<textarea
			name={name}
			className={`w-full bg-transparent border border-white text-white p-2 placeholder:text-gray-200 ${className} ${height}`}
			placeholder={placeholder}
		/>
	)
}
