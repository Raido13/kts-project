import { db } from '@shared/config/firebase';
import { COLLECTION } from '@shared/constants/constants';
import { CityType } from '@shared/types/city';
import { FetchModeType } from '@shared/types/fetchMode';
import { Unsubscribe } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';

interface subscribeToCitiesProps {
  mode: Extract<FetchModeType, 'all' | 'single'>;
  currentCityId?: string;
  onUpdate: (data: CityType[] | CityType | string) => void;
}

export const subscribeToCities = ({ mode, currentCityId, onUpdate }: subscribeToCitiesProps): Unsubscribe => {
  const collectionRef = collection(db, COLLECTION);

  if (mode === 'all') {
    const q = query(collectionRef, orderBy('name'));

    return onSnapshot(q, (snapshot) => {
      const cities: CityType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CityType[];
      onUpdate(cities);
    });
  }

  if (mode === 'single') {
    const cityRef = doc(collectionRef, currentCityId);

    return onSnapshot(cityRef, (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate('City not found');
      } else {
        onUpdate({
          id: snapshot.id,
          ...snapshot.data(),
        } as CityType);
      }
    });
  }

  onUpdate('Unsupported subscription mode.');
  return () => {};
};
