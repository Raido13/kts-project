import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { City } from '../types/city';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@shared/lib/config/firebase';
import { CitiesContext } from './CitiesContext';

export const CitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [randomCity, setRandomCity] = useState<City | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, 'cities'));
      const citiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as City);

      const randomIdx = Math.floor(Math.random() * citiesData.length);
      const randomItem = citiesData[randomIdx];

      setCities(citiesData);
      setRandomCity(randomItem);
      setIsLoading(false);
    };

    fetchCities();
  }, []);

  return <CitiesContext.Provider value={{ cities, isLoading, randomCity }}>{children}</CitiesContext.Provider>;
};
