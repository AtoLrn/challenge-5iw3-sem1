import * as Tabs from '@radix-ui/react-tabs';
import { t } from 'i18next'
import {Title} from "../components/Title.tsx";
import { useState } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import {FiMapPin} from 'react-icons/fi';
import { LuCalendarClock } from "react-icons/lu";


export default function MainPage() {
    const [activeTab, setActiveTab] = useState('tabCurrentBookings');

    return (
        <main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

            <div className="container w-10/12 mx-auto">
                <Tabs.Root className="TabsRoot mt-32" defaultValue="tabCurrentBookings">
                    <Tabs.List className="TabsList flex mb-12 border-b-1 border-white" aria-label="Manage your account">
                        <Tabs.Trigger
                            className={`TabsTrigger py-2 px-8 ${activeTab === 'tabCurrentBookings' ? 'bg-white text-black' : ''}`}
                            value="tabCurrentBookings"
                            onClick={() => setActiveTab('tabCurrentBookings')}
                        >
                            <Title kind={'h3'} className={'font-title'}>
                                {t('upcoming-appointments')}
                            </Title>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className={`TabsTrigger py-2 px-8 ${activeTab === 'tabPastBookings' ? 'bg-white text-black' : ''}`}
                            value="tabPastBookings"
                            onClick={() => setActiveTab('tabPastBookings')}
                        >
                            <Title kind={'h3'} className={'font-title'}>
                                {t('past-appointments')}
                            </Title>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content className="TabsContent" value="tabCurrentBookings">
                        <div className="flex flex-row gap-8 mb-8">
                            <div className="w-2/12 text-center">
                                <Title kind={'h4'} className={'font-title'}>
                                    {t('artist')}
                                </Title>
                            </div>
                            <div className="w-3/12">
                                <Title kind={'h4'} className={'font-title'}>
                                    {t('date-time-location')}
                                </Title>
                            </div>
                            <div className="w-5/12">
                                <Title kind={'h4'} className={'font-title'}>
                                    {t('project-description')}
                                </Title>
                            </div>
                            <div className="w-2/12">
                                &nbsp;
                            </div>
                        </div>
                        <div className="flex flex-row gap-8 border-b-1 pb-8 mb-8">
                            <div className="w-2/12 flex flex-col gap-2">
                                <div className="mx-auto">
                                    <Avatar.Root className="AvatarRoot">
                                        <Avatar.Image
                                            className="AvatarImage rounded-full w-12 h-12 object-cover"
                                            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                                            alt="Colm Tuite"
                                        />
                                    </Avatar.Root>
                                </div>
                                <div className="font-title text-center text-lg">
                                    John Doe
                                </div>
                            </div>
                            <div className="w-3/12 flex flex-col gap-3">
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <LuCalendarClock size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <div>December 16, 2023</div>
                                        <div>11:30 AM</div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <FiMapPin size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm underline">
                                        <div>123 Main Street</div>
                                        <div>London</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-5/12">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A assumenda aut, cumque dignissimos dolor dolore dolorum eius eum harum, illum ipsum laudantium qui reiciendis repellendus rerum tempora temporibus totam ut.
                            </div>
                            <div className="w-2/12 flex flex-col gap-4">
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('reschedule')}
                                </button>
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row gap-8 border-b-1 pb-8 mb-8">
                            <div className="w-2/12 flex flex-col gap-2">
                                <div className="mx-auto">
                                    <Avatar.Root className="AvatarRoot">
                                        <Avatar.Image
                                            className="AvatarImage rounded-full w-12 h-12 object-cover"
                                            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                                            alt="Colm Tuite"
                                        />
                                    </Avatar.Root>
                                </div>
                                <div className="font-title text-center text-lg">
                                    John Doe
                                </div>
                            </div>
                            <div className="w-3/12 flex flex-col gap-3">
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <LuCalendarClock size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <div>December 16, 2023</div>
                                        <div>11:30 AM</div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <FiMapPin size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm underline">
                                        <div>123 Main Street</div>
                                        <div>London</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-5/12">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A assumenda aut, cumque dignissimos dolor dolore dolorum eius eum harum, illum ipsum laudantium qui reiciendis repellendus rerum tempora temporibus totam ut.
                            </div>
                            <div className="w-2/12 flex flex-col gap-4">
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('reschedule')}
                                </button>
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-row gap-8 border-b-1 pb-8 mb-8">
                            <div className="w-2/12 flex flex-col gap-2">
                                <div className="mx-auto">
                                    <Avatar.Root className="AvatarRoot">
                                        <Avatar.Image
                                            className="AvatarImage rounded-full w-12 h-12 object-cover"
                                            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                                            alt="Colm Tuite"
                                        />
                                    </Avatar.Root>
                                </div>
                                <div className="font-title text-center text-lg">
                                    John Doe
                                </div>
                            </div>
                            <div className="w-3/12 flex flex-col gap-3">
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <LuCalendarClock size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm">
                                        <div>December 16, 2023</div>
                                        <div>11:30 AM</div>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <FiMapPin size={20} />
                                    </div>
                                    <div className="flex flex-col text-sm underline">
                                        <div>123 Main Street</div>
                                        <div>London</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-5/12">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A assumenda aut, cumque dignissimos dolor dolore dolorum eius eum harum, illum ipsum laudantium qui reiciendis repellendus rerum tempora temporibus totam ut.
                            </div>
                            <div className="w-2/12 flex flex-col gap-4">
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('reschedule')}
                                </button>
                                <button className="bg-transparent hover:bg-white text-white hover:text-black border border-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline transition ease-in-out duration-300">
                                    {t('cancel')}
                                </button>
                            </div>
                        </div>
                    </Tabs.Content>
                    <Tabs.Content className="TabsContent" value="tabPastBookings">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consectetur dolorum excepturi nobis. Aspernatur at dolore eveniet expedita in itaque, libero magnam, mollitia officia pariatur quasi rerum sequi ullam, unde.
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </main>
    )
}

