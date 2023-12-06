import { MetaFunction } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { t } from 'i18next'
import { FaGoogle, FaMicrosoft, FaCalendarDay, FaDownload } from 'react-icons/fa6'
import { createGoogleCalendarLink, createOutlookCalendarLink, exportToICS } from 'src/utils/exportCalendar'
import { Booking } from 'src/utils/types/booking'
import { Link } from '@remix-run/react'
import { Validation } from 'src/utils/types/validation'
import { motion as m } from 'framer-motion'
import { formatDistanceToNow, parseISO, format, isPast } from 'date-fns'

export const meta: MetaFunction = () => {
	return [
		{
			title: t('booking-title'),
			description: t('booking-page')
		}
	]
}

export default function () {
	const clients: Booking[] = [
		{
			profile: {
				username: 'Sam',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg'
			},
			date: '2023-12-12 14:30',
			duration: 60,
			status: Validation.ACCEPTED
		},
		{
			profile: {
				username: 'Antoine',
				avatar: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
				email: 'test@test.com',
				isProfessional: false,
			},
			prestation: {
				name: 'Tatouage',
				kind: 'tattoo',
				location: '32 rue de Cambrai, 75019 Paris, France',
				picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg'
			},
			date: '2023-12-06 17:30',
			duration: 60,
			status: Validation.PENDING
		}
	]

	const getAppointmentTime = (client: Booking) => {
		const appointmentDate = parseISO(client.date);
		const timeUntilAppointment = formatDistanceToNow(appointmentDate, { addSuffix: true });

		if (isPast(appointmentDate)) {
			return t('appointment-passed');
		}

		let message;
		if (appointmentDate.getTime() - new Date().getTime() < 3600000) {
			message = `${timeUntilAppointment}`;
		} else if (appointmentDate.getTime() - new Date().getTime() < 86400000) {
			message = `${timeUntilAppointment}`;
		} else if (appointmentDate.getTime() - new Date().getTime() < 604800000) {
			message = `${timeUntilAppointment}`;
		} else {
			message = format(appointmentDate, 'dd/MM/yyyy à HH:mm');
		}

		return message;
	};

	const exportToCSV = () => {
		let csvContent = "data:text/csv;charset=utf-8,"

		const headers = 'Username, Avatar, Email, Is Professional, Prestation, Date, Duration, Status\n';
		csvContent += headers;

		clients.forEach(client => {
			const row = [
				client.profile.username,
				client.profile.avatar,
				client.profile.email,
				client.profile.isProfessional,
				client.prestation,
				client.date,
				client.duration,
				client.status
			].join(',');
			csvContent += row + "\n";
		});

		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		const today = new Date();
		link.setAttribute("download", today.toLocaleDateString() + '_appointements.csv');
		document.body.appendChild(link); // Required for FF

		link.click();
		document.body.removeChild(link);
	}

	return <div className="flex-1 p-8 flex flex-col gap-8 text-white">
		<Title kind="h2">{t('your-nexts-appointement')}</Title>
		<section className='flex flex-col gap-4 items-center bg-zinc-950 p-4 rounded-md'>
			<span className='font-bold'>{t('booking-title')}</span>
			{clients.map((client, index) => {
				return <div key={index} className='flex flex-col md:flex-row w-full p-2 border-b border-gray-200 border-opacity-30 gap-4 items-center'>
				<img className='rounded-full border-2 border-gray-900 object-cover w-12 h-12 mx-auto md:mx-0' src={client.profile.avatar} alt={t('client-avatar-alt')} />

				<div className='flex-grow text-center md:text-left'>
					<div className='text-lg font-bold'>{client.profile.username}</div>
					<div>{client.prestation.name} - <Link to={'https://www.google.com/maps/search/?api=1&query=' + client.prestation.location} target="_blank" rel="noopener noreferrer" className='underline'>{client.prestation.location}</Link></div>
					<div>{getAppointmentTime(client)} ({format(parseISO(client.date), 'dd/MM/yyyy à HH:mm')})</div>
					<div>{client.duration} {t('minutes')}</div>
					<div className={`text-sm ${client.status === Validation.ACCEPTED ? ' text-green-500' : client.status === Validation.PENDING ? ' text-yellow-500' : ' text-red-500'}`}>
						{client.status === Validation.ACCEPTED ? t('accepted') : client.status === Validation.PENDING ? t('pending') : t('rejected')}
					</div>
				</div>

				<div className='flex gap-2 justify-center md:justify-start'>
					<a className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' href={createGoogleCalendarLink(client)} target="_blank" rel="noopener noreferrer" title={t('add-google-calendar')}>
						<FaGoogle />
					</a>
					<a className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' href={createOutlookCalendarLink(client)} target="_blank" rel="noopener noreferrer" title={t('add-outlook-calendar')}>
						<FaMicrosoft />
					</a>
					<button className='p-2 bg-gray-700 hover:bg-gray-800 rounded-lg text-white' onClick={() => exportToICS(client)} title={t('download-as-ics')}>
						<FaCalendarDay />
					</button>
				</div>

				<Link to={`/booking/${client.profile.username}`} className='p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white'>
					{t('see')}
				</Link>
			</div>			
			})}
		</section>
		<m.button
			whileHover={{ scale: 1.025 }}
			className='flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg text-white'
			onClick={exportToCSV}
		>
			{t('export-appointements-csv')} 
			<FaDownload className="ml-2" />
		</m.button>

	</div>
}
