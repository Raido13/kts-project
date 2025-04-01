import { auth } from '@shared/config/firebase';
import { FirebaseError } from 'firebase/app';
import { signOut } from 'firebase/auth';

export const logout = async (): Promise<true | string> => {
  try {
    await signOut(auth);
    return true;
  } catch (e) {
    return e instanceof FirebaseError ? 'Failed to log out. Please try again.' : 'Unexpected error. Please try again.';
  }
};
