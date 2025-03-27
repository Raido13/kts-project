import { PropsWithChildren, useEffect, useState } from 'react';
import { City } from '../types/city';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@shared/lib/config/firebase';
import { CitiesContext } from './CitiesContext';

export const CitiesContextProvider = ({ children }: PropsWithChildren) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, 'cities'));
      const citiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as City);

      setCities(citiesData);
      setIsLoading(false);
    };

    fetchCities();
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, setCities, isLoading, setIsLoading }}>{children}</CitiesContext.Provider>
  );
};
