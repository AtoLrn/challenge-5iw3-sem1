export const formatDate = (dateStr: string, utc = true): string => {
	const formatUnit = (unit: number) => unit < 10 ? `0${unit}` : `${unit}`

	const date = new Date(dateStr)
	const day = formatUnit(date.getDate())
	const month = formatUnit(date.getMonth() + 1)
	const year = date.getFullYear()
	const hours = formatUnit(utc ? date.getUTCHours() : date.getHours())
	const minutes = formatUnit(date.getMinutes())

	return `${day}/${month}/${year} - ${hours}:${minutes}`
}
