import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { City } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection } from 'firebase/firestore';

export const createCard = async (card: City): Promise<true | string> => {
  try {
    await addDoc(collection(db, COLLECTION), card);
    return true;
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'permission-denied': 'You do not have permission to create a card.',
        'unavailable': 'Firestore is temporarily unavailable. Please try again later.',
        'deadline-exceeded': 'Request timed out. Please try again.',
        'invalid-argument': 'Invalid data format. Please check your inputs.',
        'resource-exhausted': 'Quota exceeded. Please try again later.',
        'unauthenticated': 'You must be logged in to perform this action.',
      };

      return errorMessages[e.code] ?? 'Failed to create card. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
