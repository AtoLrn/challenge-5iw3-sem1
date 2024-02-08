export interface StatInfoProps {
    count: number,
    caption: string,
}

export const StatInfo: React.FC<StatInfoProps> = ({ count, caption }) => {
    return <div className='flex flex-col items-center'>
		<p className="text-6xl mb-4">{count}</p>
        <p>{caption}</p>
    </div>
}

