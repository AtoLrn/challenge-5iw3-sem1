import {User} from './user'

export interface ProfileFormInterface {
  profile: User;
  isEditing: boolean;
  errors: (string | null)[]
  success: string | null
}
