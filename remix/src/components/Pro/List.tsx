import { ListItemProps } from './ListItem'


export interface ListProps<T> {
    items: T[]
    ListItem: React.FC<ListItemProps<T>>
}

export const List = <TItem extends object>({ ListItem, items }: ListProps<TItem>) => {
	return <div className='w-full flex flex-col gap-2'>
		{ items.map((item) => {
			return <ListItem key={`${item}`} item={item} />
		})}
	</div>
}