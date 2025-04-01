import { collection, getDocs } from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { City } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';

export const fetchCards = async (): Promise<City[] | string> => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));

    const cards: City[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as City[];

    return cards;
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'permission-denied': 'You do not have permission to view cities.',
        'unavailable': 'Firestore is temporarily unavailable. Please try again later.',
        'deadline-exceeded': 'Request timed out. Please try again.',
        'resource-exhausted': 'Quota exceeded. Please try again later.',
        'unauthenticated': 'You must be logged in to perform this action.',
      };
      return errorMessages[e.code] ?? 'Failed to fetch cards. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
