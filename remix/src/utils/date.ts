export const formatDate = (dateStr: string): string => {
	const formatUnit = (unit: number) => unit < 10 ? `0${unit}` : `${unit}`

	const date = new Date(dateStr)
	const day = formatUnit(date.getDate())
	const month = formatUnit(date.getMonth() + 1)
	const year = date.getFullYear()
	const hours = formatUnit(date.getUTCHours())
	const minutes = formatUnit(date.getMinutes())

	return `${day}/${month}/${year} - ${hours}:${minutes}`
}
