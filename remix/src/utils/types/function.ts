export interface FunctionWithArgs<TArgs, TReturn> {
	(args: TArgs):TReturn
}