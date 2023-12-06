import { MetaFunction } from '@remix-run/react'
import { Title } from 'src/components/Title'
import { json } from '@remix-run/node'
import { t } from 'i18next'
import { ProfileInterface } from 'src/utils/types/profileForm'

type Clients = {
	profile: ProfileInterface,
	prestation: Prestation,
	date: string,
	duration: number,
	status: 'accepted' | 'pending' | 'refused'
}

type Prestation = {
	name: string,
	kind: 'tattoo' | 'jewelry' | 'barber',
	location: string,
	picture: string,
}

export const meta: MetaFunction = () => {
	return [
		{
			title: 'Booking'
		}
	]
}

export const loader = () => {
	return json({ accessToken: process.env.MAP_BOX_TOKEN })
}

export default function () {
	const clients: Clients[] = [
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
			date: '2021-08-12 14:30',
			duration: 60,
			status: 'accepted'
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
			date: '2023-12-06 14:30',
			duration: 60,
			status: 'pending'
		}
	]

	const createGoogleCalendarLink = (client: Clients) => {
		const title = encodeURIComponent(`${client.prestation.name} pour ${client.profile.username}`);
		const description = encodeURIComponent(`Rendez-vous avec ${client.profile.username}`);
		const location = encodeURIComponent(client.prestation.location);

		const startDate = new Date(client.date).toISOString().replace(/-|:|\.\d\d\d/g,"");
		const endDate = new Date(new Date(client.date).getTime() + client.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');

		const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`;

		return googleCalendarUrl;
	}

	const createOutlookCalendarLink = (client: Clients) => {
		const title = encodeURIComponent(`${client.prestation.name} pour ${client.profile.username}`);
		const description = encodeURIComponent(`Rendez-vous avec ${client.profile.username}`);
		const location = encodeURIComponent(client.prestation.location);

		const startDate = new Date(client.date).toISOString().replace(/-|:|\.\d\d\d/g,"");
		const endDate = new Date(new Date(client.date).getTime() + client.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');

		const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${startDate}&enddt=${endDate}`;

		return outlookCalendarUrl;
	}

	const exportToICS = (client: Clients) => {
		const start = new Date(client.date).toISOString().replace(/-|:|\.\d\d\d/g, '');
		const end = new Date(new Date(client.date).getTime() + client.duration * 60000).toISOString().replace(/-|:|\.\d\d\d/g, '');

		const icsData = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'BEGIN:VEVENT',
			`DTSTART:${start}`,
			`DTEND:${end}`,
			`SUMMARY:${client.prestation.name} pour ${client.profile.username}`,
			`DESCRIPTION:Rendez-vous avec ${client.profile.username}`,
			`LOCATION:${client.prestation.location}`,
			'END:VEVENT',
			'END:VCALENDAR'
		].join('\n');

		const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `Rendez-vous-${client.profile.username}.ics`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}	

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
		// Today's date with hours and minutes
		const today = new Date();
		link.setAttribute("download", today.toLocaleDateString() + '_appointements.csv');
		document.body.appendChild(link); // Required for FF

		link.click();
		document.body.removeChild(link);
	}

	return <div className="flex-1 p-8 flex flex-col gap-8 text-white">
		<Title kind="h2">{t('your-nexts-appointement')}</Title>
		<section className='flex flex-col gap-4 items-center bg-zinc-950 p-4 rounded-md'>
			<span className='font-bold'>{t('booking')}</span>
			{clients.map((client, index) => {
				return <div key={index} className='flex w-full p-2 border-b-1 border-gray-200 border-opacity-30 gap-2'>
					<img key={index} className={ 'rounded-full relative border-2 border-gray-900 object-cover w-8 h-8' } src={client.profile.avatar} alt="Client avatar" />
					<div className='flex flex-col'>
						<span>
							{client.profile.username}
						</span>
						<span>
							{client.prestation.name}
						</span>
						<span>
							{client.date}
						</span>
					</div>
					<div>
						<a className='px-4 py-2 bg-gray-700 rounded-lg text-white' href={createGoogleCalendarLink(client)}  target="_blank" rel="noopener noreferrer">
							{t('export-appointement-google-calendar')}
						</a>
						<a href={createOutlookCalendarLink(client)} className='px-4 py-2 bg-gray-700 rounded-lg text-white' target="_blank" rel="noopener noreferrer">
							{t('export-appointement-outlook-calendar')}
						</a>
						<button className='px-4 py-2 bg-gray-700 rounded-lg text-white' onClick={() => exportToICS(client)}>
							{t('export-appointement-ics')}
						</button>
					</div>
				</div> 
			})}
		</section>
		<button className='px-4 py-2 bg-gray-700 rounded-lg text-white' onClick={exportToCSV}>
			{t('export-appointements-csv')}
		</button>
	</div>
}
