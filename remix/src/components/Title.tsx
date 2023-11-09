export interface TitleProps {
    children: React.ReactNode,
    kind: 'h1' | 'h2' | 'h3' | 'h4',
    className?: string
}

export const Title: React.FC<TitleProps> = ({ children, kind, className }) => {
	if (kind === 'h1') {
		return <h1 className={`text-6xl font-bold tracking-xl ${className} font-title line leading-snug`}>{children}</h1>
	} else if (kind === 'h2') {
		return <h2 className={`text-4xl font-bold tracking-wide ${className}`}>{children}</h2>
	} else if (kind === 'h3') {
		return <h3 className={`text-3xl font-bold tracking-wide ${className}`}>{children}</h3>
	} else {
		return <h4 className={`text-2xl font-bold tracking-wide ${className}`}>{children}</h4>
	}

}
