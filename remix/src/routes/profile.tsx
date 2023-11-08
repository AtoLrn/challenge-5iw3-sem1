import { motion as m } from 'framer-motion'
import { FaInstagram } from 'react-icons/fa'
import { Meta } from '@remix-run/react';

// Type pour les données chargées, modifiez selon vos données de profil réelles
type ProfileData = {
  username: string;
  avatarUrl: string;
  isProfessional: boolean;
  isAdmin: boolean;
  instagramToken: string;
  prestations: {
    name: string;
    kind: string;
    location: string;
    picture: string;
  }[];
  workingDays: {
    day: string;
    start: string;
    end: string;
  }[];
};

export default function ProfilePage() {
  // Create false data for the profile
  const profile: ProfileData = {
    username: 'John Doe',
    // tattoo artist avatar
    avatarUrl: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
    isProfessional: true,
    isAdmin: false,
    instagramToken: '123456789',
    prestations: [
      {
        name: 'Tattoo',
        kind: 'Tattoo',
        location: 'Paris',
        picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
      },
      {
        name: 'Piercing',
        kind: 'Jewelry',
        location: 'Paris',
        picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
      },
      {
        name: 'Barber',
        kind: 'Barber',
        location: 'Paris',
        picture: 'https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg',
      },
    ],
    workingDays: [
      {
        day: 'Monday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Tuesday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Wednesday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Thursday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Friday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Saturday',
        start: '08:00',
        end: '18:00',
      },
      {
        day: 'Sunday',
        start: '08:00',
        end: '18:00',
      },
    ],
  };

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 }
    }),
  };

  return (
    <main className="bg-neutral-900 min-h-screen p-5 pt-28">
      <div className="container mx-auto flex flex-col md:flex-row gap-10">
        {/* Profile card with glass effect - make this a sidebar on desktop */}
        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={cardVariants}
          className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg rounded-lg p-5 text-white shadow-lg w-full lg:w-1/4 md:w-1/3"
        >
          <div className="flex md:flex-col items-center md:space-y-4 md:space-x-0 space-x-4 w-full">
            <img
              src={profile.avatarUrl}
              alt="Profile avatar"
              className="w-20 h-20 md:w-full md:h-full rounded-full md:rounded-md object-cover max-w-xs"
            />
            <div className='md:flex md:flex-col md:items-center'>
              <h2 className='text-xl font-bold'>{profile.username}</h2>
              <p className='md:text-center'>{profile.isProfessional ? 'Professional Artist' : 'Tattoo Lover'}</p>
              {profile.isProfessional && (
                <a
                  href={`#`}
                  className="instagram-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md transition duration-300 ease-in-out md:mt-4 flex items-center mt-4 gap-2"
                >
                  <FaInstagram className="text-2xl lg:text-md" />
                  <span className="items-center gap-2">
                    Instagram
                  </span>
                </a>
              )}
            </div>
          </div>
        </m.div>

        <div className="flex-grow">
          {/* Services offered */}
          <div className="md:mt-0 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.prestations.map((prestation, index) => (
              <m.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                variants={cardVariants}
                className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg rounded-lg p-5 text-white shadow-lg"
              >
                <img
                  src={prestation.picture}
                  alt={prestation.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="pt-4 pb-2">
                  <h3 className="text-xl font-bold">{prestation.name}</h3>
                  <p className="text-gray-400">{prestation.location}</p>
                </div>
              </m.div>
            ))}
          </div>

          {/* Working Days */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Working Days</h2>
            <m.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={cardVariants}
              className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg rounded-lg p-5 text-white shadow-lg"
            >
              <ul>
                {profile.workingDays.map((workingDay, index) => (
                  <li key={index} className="flex justify-between py-1">
                    <span>{workingDay.day}</span>
                    <span>{workingDay.start} - {workingDay.end}</span>
                  </li>
                ))}
              </ul>
            </m.div>
          </div>
        </div>
      </div>
    </main>
  );
}
