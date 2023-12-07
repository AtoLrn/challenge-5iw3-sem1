import { ListItemProps } from './ListItem'


export interface ListProps<T> {
    items: T[]
    ListItem: React.FC<ListItemProps<T>>
		sort?: (a: T, b: T) => number
}

export const List = <TItem extends object>({ ListItem, items, sort }: ListProps<TItem>) => {
	if (sort) {
		items = items.sort(sort)
	}
	return <div className='w-full flex flex-col gap-2  h-screen overflow-y-scroll'>
		{ items.map((item) => {
			return <ListItem key={`${item}`} item={item} />
		})}
	</div>
}