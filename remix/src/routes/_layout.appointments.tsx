import * as Tabs from '@radix-ui/react-tabs'
import { t } from 'i18next'
import {Title} from '../components/Title.tsx'
import { useState } from 'react'
import {AppointmentRow} from '../components/AppointmentRow.tsx'

export function meta() {
	return [
		{
			title: 'Appointments | INKIT',
		},
	]
}

export default function MainPage() {
	const [activeTab, setActiveTab] = useState('tabCurrentAppointments')

	return (
		<main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

			<div className="container w-10/12 mx-auto">

				<Tabs.Root className="TabsRoot mt-32" defaultValue="tabCurrentAppointments">

					{/* ========= TABS ========== */}
					<Tabs.List className="TabsList flex mb-12 border-b-1 border-white" aria-label="Manage your appointments">
						<Tabs.Trigger
							className={`TabsTrigger py-2 px-8 ${activeTab === 'tabCurrentAppointments' ? 'bg-white text-black' : ''}`}
							value="tabCurrentAppointments"
							onClick={() => setActiveTab('tabCurrentAppointments')}
						>
							<Title kind={'h3'}>
								{t('upcoming-appointments')}
							</Title>
						</Tabs.Trigger>
						<Tabs.Trigger
							className={`TabsTrigger py-2 px-8 ${activeTab === 'tabPastAppointments' ? 'bg-white text-black' : ''}`}
							value="tabPastAppointments"
							onClick={() => setActiveTab('tabPastAppointments')}
						>
							<Title kind={'h3'}>
								{t('past-appointments')}
							</Title>
						</Tabs.Trigger>
					</Tabs.List>
					{/* ========= /TABS ========== */}
                    
					{/* ========= TAB CONTENT: Upcoming appointments ========== */}
					<Tabs.Content className="TabsContent" value="tabCurrentAppointments">

						{/* ========== Table header ========== */}
						<div className="flex flex-row gap-8 mb-8">
							<div className="w-4/12">
								<Title kind={'h4'}>
									{t('artist')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('date')} & {t('time')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('location')}
								</Title>
							</div>
							<div className="w-2/12">
                                &nbsp;
							</div>
						</div>
						{/* ========== /Table header ========== */}

						{/* ========== Table rows ========== */}
						<AppointmentRow kind={'current'}
							artistFirstName={'Jane'}
							artistLastName={'Doe'}
							appointmentDate={'December 16, 2023'}
							appointmentTime={'11:30 AM'}
							address={'123 Main Street'}
							city={'London'}
							projectDescription={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores blanditiis labore, numquam quos sed sint sunt..'}
						/>
						{/* ========== /Table rows ========== */}

					</Tabs.Content>
					{/* ========= /TAB CONTENT: Upcoming appointments ========== */}

					{/* ========= TAB CONTENT: Past appointments ========== */}
					<Tabs.Content className="TabsContent" value="tabPastAppointments">

						{/* ========== Table header ========== */}
						<div className="flex flex-row gap-8 mb-8">
							<div className="w-4/12">
								<Title kind={'h4'}>
									{t('artist')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('date')} & {t('time')}
								</Title>
							</div>
							<div className="w-3/12">
								<Title kind={'h4'}>
									{t('location')}
								</Title>
							</div>
							<div className="w-2/12">
                                &nbsp;
							</div>
						</div>
						{/* ========== /Table header ========== */}

						{/* ========== Table rows ========== */}
						<AppointmentRow kind={'past'}
							artistFirstName={'Jane'}
							artistLastName={'Doe'}
							appointmentDate={'December 16, 2023'}
							appointmentTime={'11:30 AM'}
							address={'123 Main Street'}
							city={'London'}
							projectDescription={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores blanditiis labore, numquam quos sed sint sunt..'}
						/>
						{/* ========== /Table rows ========== */}

					</Tabs.Content>
					{/* ========= /TAB CONTENT: Past appointments ========== */}
                    
				</Tabs.Root>

			</div>
		</main>
	)
}

