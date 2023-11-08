import { motion as m } from "framer-motion";
import { FaInstagram, FaPen } from "react-icons/fa";
import { Title } from "src/components/Title";
import { LinksFunction } from "@remix-run/node";
import stylesheet from "../style/profile.css";
import React, { useState, useEffect } from 'react';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheet }];
};

type ProfileData = {
  username: string;
  avatarUrl: string;
  email: string;
  isProfessional: boolean;
  isAdmin: boolean;
  instagramToken: string;
  workingDays: {
    day: string;
    start: string;
    end: string;
  }[];
};

export function meta() {
  return [
    {
      title: "User Profile | INKIT",
      description: "User profile page",
    },
  ];
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  /**
   * @TODO: Fetch user data from the database
   */
  const profile: ProfileData = {
    username: "John Doe",
    avatarUrl: "https://a.pinatafarm.com/407x407/6087855680/laughing-kid.jpg",
    isProfessional: false,
    isAdmin: false,
    instagramToken: "123456789",
    email: "test@test.com",
    workingDays: [
      {
        day: "Monday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Tuesday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Wednesday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Thursday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Friday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Saturday",
        start: "08:00",
        end: "18:00",
      },
      {
        day: "Sunday",
        start: "08:00",
        end: "18:00",
      },
    ],
  };

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1 },
    }),
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data);
    setIsEditing(false);
  };

  return (
    <main className="bg-neutral-900 min-h-screen pt-28">
      <div className="container mx-auto flex flex-col md:flex-row gap-10">
        {/* Profile card with glass effect - make this a sidebar on desktop */}
        <m.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={cardVariants}
        >
          <div className="flex md:flex-col items-end md:items-center justify-between bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full lg:w-1/4 md:w-1/3 user-sidebar">
            <div className="flex md:flex-col items-center md:space-y-4 md:space-x-0 space-x-4 w-full">
              <img
                src={profile.avatarUrl}
                alt="Profile avatar"
                className="w-20 h-20 md:w-full md:h-full rounded-full md:rounded-md object-cover max-w-xs"
              />
              <div className="md:flex md:flex-col md:items-center">
                <Title kind="h1" className="text-xl font-bold text-white">
                  {profile.username}
                </Title>
                <p className="md:text-center">
                  {profile.isAdmin
                    ? "Unlimited Power"
                    : profile.isProfessional
                    ? "Professional Artist"
                    : "Tattoo Lover"}
                </p>
                {profile.isProfessional && (
                  <a
                    href={"https://instagram.com/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Go to Instagram"
                    className="instagram-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md md:mt-4 flex items-center mt-4 gap-2"
                  >
                    <FaInstagram className="text-2xl lg:text-md" />
                    <span className="items-center gap-2">Instagram</span>
                  </a>
                )}
              </div>
            </div>
            <a
              href={"#"}
              title="Edit Profile"
              className="edit-btn bg-red-950 text-white px-3 md:px-4 py-3 md:py-2 rounded-md shadow-md flex items-center gap-2 hover:bg-red-900 justify-center"
              onClick={toggleEdit}
            >
              <FaPen className="text-md" />
              <span className="hidden md:block">Edit Profile</span>
            </a>
          </div>
          {isEditing && (
          <form className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg w-full lg:w-1/4 md:w-1/3 user-sidebar" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="John Doe"
                className="bg-transparent border-b border-white text-white"
                defaultValue={profile.username}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="test@test.com"
                className="bg-transparent border-b border-white text-white"
                defaultValue={profile.email}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                className="bg-transparent border-b border-white text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="********"
                className="bg-transparent border-b border-white text-white"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="instagram">Instagram</label>
              <input
                type="text"
                name="instagram"
                id="instagram"
                placeholder="john_doe"
                className="bg-transparent border-b border-white text-white"
                defaultValue={profile.instagramToken}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="avatar">Avatar</label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                className="bg-transparent border-b border-white text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-md shadow-md mt-4"
          >
            Save Changes
          </button>
        </form>
        )}
        </m.section>

        <section className="flex-grow">
          {/* Working Days */}
          {profile.isProfessional ? (
            <div>
              <Title kind="h2" className="text-xl font-bold text-white mb-4">
                Working Days
              </Title>
              <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                variants={cardVariants}
                className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg"
              >
                <ul>
                  {profile.workingDays.map((workingDay, index) => (
                    <li key={index} className="flex justify-between py-1">
                      <span>{workingDay.day}</span>
                      <span>
                        {workingDay.start} - {workingDay.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </m.div>
            </div>
          ) : (
            <div>
              <Title kind="h2" className="text-xl font-bold text-white mb-4">
                My Latests appointments
              </Title>
              <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                variants={cardVariants}
                className="bg-opacity-20 bg-neutral-700 backdrop-filter backdrop-blur-lg p-5 text-white shadow-lg"
              >
                <p>You don't have any appointments yet.</p>
              </m.div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
