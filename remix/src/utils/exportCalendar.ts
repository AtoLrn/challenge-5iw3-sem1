import { Booking } from "./types/booking";

const prepareCalendarData = (booking: Booking) => {
  const title = encodeURIComponent(`${booking.prestation.name} pour ${booking.profile.username}`);
  const description = encodeURIComponent(`Rendez-vous avec ${booking.profile.username}`);
  const location = encodeURIComponent(booking.prestation.location);

  const startDate = new Date(booking.date).toISOString().replace(/-|:|\.\d\d\d/g,"");
  const endDate = new Date(new Date(booking.date).getTime() + booking.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');

  return { title, description, location, startDate, endDate };
};

const createGoogleCalendarLink = (booking: Booking) => {
  const { title, description, location, startDate, endDate } = prepareCalendarData(booking);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`;
};

const createOutlookCalendarLink = (booking: Booking) => {
  const { title, description, location, startDate, endDate } = prepareCalendarData(booking);

  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${startDate}&enddt=${endDate}`;
};

const exportToICS = (booking: Booking) => {
  const { title, description, location, startDate, endDate } = prepareCalendarData(booking);

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
  ].join('\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Rendez-vous-${booking.profile.username}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { createGoogleCalendarLink, createOutlookCalendarLink, exportToICS };
