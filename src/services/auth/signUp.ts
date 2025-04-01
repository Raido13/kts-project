import { auth } from '@shared/config/firebase';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';

interface SignUpProps {
  email: string;
  password: string;
}

export const signUp = async ({ email, password }: SignUpProps): Promise<User | string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email format',
        'auth/weak-password': 'Password should be at least 6 characters',
      };

      return errorMessages[e.code] ?? 'Registration failed. Please try again.';
    }
    return 'Unexpected error. Please try again.';
  }
};
