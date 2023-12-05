export interface ProfileForm {
  profile: {
    username: string;
    email: string;
    isProfessional: boolean;
    instagramToken?: string;
  };
  isEditing: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
