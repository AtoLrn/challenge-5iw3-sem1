import { FunctionWithArgs } from './types/function'
import { IntervalMs } from './types/intervals'

export const withDebounce = <T, X>(callback: FunctionWithArgs<T, X>, interval: IntervalMs) => {
	let timer:  NodeJS.Timeout | number | undefined = undefined
  
	return (args: T) => {
		clearTimeout(timer)
		return new Promise<X>((resolve) => {
			timer = setTimeout(
				() => resolve(callback(args)),
				interval,
			)
		})
	}
}