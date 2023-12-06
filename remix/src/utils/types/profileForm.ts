export interface ProfileFormInterface {
  profile: ProfileInterface;
  isEditing: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ProfileInterface {
  username: string;
  email: string;
  isProfessional: boolean;
  instagramToken?: string;
}
