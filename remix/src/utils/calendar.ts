import { GetBooking } from './types/booking'

const prepareCalendarData = (booking: GetBooking) => {
	const title = encodeURIComponent(`Prestation pour ${booking.requestingUser.username}`)
	const description = encodeURIComponent(`Rendez-vous avec ${booking.requestingUser.username}`)
	const location = encodeURIComponent(booking.studio?.location?.replace(/,/g, '') ?? '')

	const startDate: Date = booking.time ? new Date(booking.time) : new Date()
	let endDate
	if (booking.duration === '1h') {
		endDate = new Date(startDate.getTime() + 60 * 60000)
	} else if (booking.duration === '2h') {
		endDate = new Date(startDate.getTime() + 120 * 60000)
	} else if (booking.duration === '3h') {
		endDate = new Date(startDate.getTime() + 180 * 60000)
	} else if (booking.duration === '30m') {
		endDate = new Date(startDate.getTime() + 30 * 60000)
	} else {
		endDate = new Date(startDate.getTime() + 60 * 60000)
	}

	return { title, description, location, startDate, endDate }
}

const createGoogleCalendarLink = (booking: GetBooking) => {
	const { title, description, location, startDate, endDate } = prepareCalendarData(booking)

	return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`
}

const createOutlookCalendarLink = (booking: GetBooking) => {
	const { title, description, location, startDate, endDate } = prepareCalendarData(booking)

	return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${startDate}&enddt=${endDate}`
}

const exportToICS = (booking: GetBooking) => {
	const { title, description, location, startDate, endDate } = prepareCalendarData(booking)

	const icsData = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'BEGIN:VEVENT',
		`DTSTART:${startDate}`,
		`DTEND:${endDate}`,
		`SUMMARY:${title}`,
		`DESCRIPTION:${description}`,
		`LOCATION:${location}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\n')

	const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = `Rendez-vous-${booking.requestingUser.username}.ics`
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

export { createGoogleCalendarLink, createOutlookCalendarLink, exportToICS }
