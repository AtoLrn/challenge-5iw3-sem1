type ProfileFormProps = {
  profile: {
      username: string;
      email: string;
      isProfessional: boolean;
      instagramToken?: string;
  };
  isEditing: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, isEditing, handleSubmit }) => {
	const formClasses = !profile.isProfessional ? 'lg:w-1/4 md:w-1/3 user-sidebar md:absolute md:top-0 md:left-[22.5rem]' : ''
	const animationClasses = isEditing ? (profile.isProfessional ? 'slide-in-top' : 'slide-in-left') : (profile.isProfessional ? 'slide-out-top' : 'slide-out-left')
	return (
		<form className={`bg-neutral-800 p-5 text-white shadow-lg w-full z-10 ${formClasses} ${animationClasses}`}
			onSubmit={handleSubmit}>
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
					<label htmlFor="avatar">Avatar</label>
					<input
						type="file"
						name="avatar"
						id="avatar"
						className="bg-transparent border-b border-white text-white"
					/>
				</div>
				{profile.isProfessional && (
					<div className="flex flex-col gap-2">
						<label htmlFor="instagram-token">Instagram Token</label>
						<input
							type="text"
							name="instagram-token"
							id="instagram-token"
							placeholder="Instagram Token"
							className="bg-transparent border-b border-white text-white"
							defaultValue={profile.instagramToken}
						/>
					</div>
				)}
			</div>
			<button
				type="submit"
				className="px-4 py-2 rounded-md shadow-md mt-4 bg-red-950 text-white hover:bg-red-900 edit-btn"
			>
  Save Changes
			</button>
		</form>
	)
}

export default ProfileForm
