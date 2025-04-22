import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { CityComment } from '@shared/types/city';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface updateCityProps {
  mode: 'like' | 'comment';
  cityId?: string;
  userId?: string;
  message?: string;
}

export const updateCity = async ({
  mode,
  cityId,
  userId,
  message,
}: updateCityProps): Promise<string[] | CityComment[] | string> => {
  try {
    if (cityId && userId) {
      const cityRef = doc(db, COLLECTION, cityId);
      const docSnap = await getDoc(cityRef);
      const cityData = docSnap.data();

      if (mode === 'like') {
        const likes: string[] = cityData?.likes ?? [];

        const updatedLikes = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];

        await updateDoc(cityRef, { likes: updatedLikes });

        return updatedLikes;
      }

      if (mode === 'comment') {
        if (!message) return 'Comment message is required.';

        const comments: CityComment[] = cityData?.comments ?? [];

        const newComment = {
          date: new Date(),
          message,
          owner: userId,
        };

        const updatedComments = [...comments, newComment];

        await updateDoc(cityRef, { comments: updatedComments });

        return updatedComments;
      }
    }

    return 'Missing parameters.';
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
      return errorMessages[e.code] ?? 'Failed to update city. Please try again later.';
    }
    return 'Unexpected error. Please try again.';
  }
};
