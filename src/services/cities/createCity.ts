import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { CityType } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, getCountFromServer } from 'firebase/firestore';

export const createCity = async (city: CityType): Promise<true | string> => {
  try {
    const collectionRef = collection(db, COLLECTION);
    const countSnapshot = await getCountFromServer(collectionRef);
    const index = countSnapshot.data().count ?? 0;

    await addDoc(collection(db, COLLECTION), { ...city, index });

    return true;
  } catch (e) {
    if (e instanceof FirebaseError) {
      const errorMessages: Record<string, string> = {
        'permission-denied': 'You do not have permission to create a city.',
        'unavailable': 'Firestore is temporarily unavailable. Please try again later.',
        'deadline-exceeded': 'Request timed out. Please try again.',
        'invalid-argument': 'Invalid data format. Please check your inputs.',
        'resource-exhausted': 'Quota exceeded. Please try again later.',
        'unauthenticated': 'You must be logged in to perform this action.',
      };

      return errorMessages[e.code] ?? 'Failed to create city. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
