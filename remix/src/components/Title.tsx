export interface TitleProps {
    children: React.ReactNode,
    kind: 'h1' | 'h2' | 'h3',
    className?: string
}

export const Title: React.FC<TitleProps> = ({ children, kind, className }) => {
	if ('h1' === kind) {
		return <h1 className={`text-6xl font-bold tracking-wide ${className}`}>{children}</h1>
	} else if ('h2' === kind) {
		return <h2 className={`text-4xl tracking-wide ${className}`}>{children}</h2>
	} else {
		return <h3 className={`text-3xl font-bold tracking-wide ${className}`}>{children}</h3>
	}

}