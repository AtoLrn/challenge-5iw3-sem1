export interface ProfileFormInterface {
  profile: ProfileInterface;
  isEditing: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ProfileInterface {
  avatar: string;
  username: string;
  email: string;
  isProfessional: boolean;
  instagramToken?: string;
}
