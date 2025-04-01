import { signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@shared/config/firebase';
import { FirebaseError } from 'firebase/app';

interface signInProps {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: signInProps): Promise<User | string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'auth/invalid-email': 'Invalid email format',
        'auth/wrong-password': 'Incorrect email or password',
        'auth/user-not-found': 'Incorrect email or password',
      };

      return errorMessages[e.code] ?? 'Login failed. Please try again.';
    }
    return 'Unexpected error. Please try again.';
  }
};
