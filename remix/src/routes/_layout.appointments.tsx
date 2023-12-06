import * as Tabs from '@radix-ui/react-tabs';
import { t } from 'i18next'
import {Title} from "../components/Title.tsx";
import { useState } from 'react';

export default function MainPage() {
    const [activeTab, setActiveTab] = useState('tabCurrentBookings');

    return (
        <main className='min-h-screen min-w-full gradient-bg text-white flex flex-col gap-4'>

            <div className="container w-10/12 mx-auto">
                <Tabs.Root className="TabsRoot mt-32" defaultValue="tabCurrentBookings">
                    <Tabs.List className="TabsList flex mb-4 border-b-1 border-white" aria-label="Manage your account">
                        <Tabs.Trigger
                            className={`TabsTrigger py-2 px-8 ${activeTab === 'tabCurrentBookings' ? 'bg-white text-black' : ''}`}
                            value="tabCurrentBookings"
                            onClick={() => setActiveTab('tabCurrentBookings')}
                        >
                            <Title kind={'h4'} className={'font-title'}>
                                {t('upcoming-appointments')}
                            </Title>
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            className={`TabsTrigger py-2 px-8 ${activeTab === 'tabPastBookings' ? 'bg-white text-black' : ''}`}
                            value="tabPastBookings"
                            onClick={() => setActiveTab('tabPastBookings')}
                        >
                            <Title kind={'h4'} className={'font-title'}>
                                {t('past-appointments')}
                            </Title>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content className="TabsContent" value="tabCurrentBookings">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi consequatur dignissimos dolore doloribus eos error et incidunt ipsa iure neque nulla numquam odit qui reprehenderit sint tenetur, velit voluptate! Eum.
                    </Tabs.Content>
                    <Tabs.Content className="TabsContent" value="tabPastBookings">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consectetur dolorum excepturi nobis. Aspernatur at dolore eveniet expedita in itaque, libero magnam, mollitia officia pariatur quasi rerum sequi ullam, unde.
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </main>
    )
}

