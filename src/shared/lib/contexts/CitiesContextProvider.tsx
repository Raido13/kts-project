import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { City } from '../types/city';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@shared/lib/config/firebase';
import { CitiesContext } from './CitiesContext';
import { COLLECTION } from '../constants/constants';

export const CitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [citiesLikes, setCitiesLikes] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, COLLECTION));
      const citiesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as City);

      const randomIdx = Math.floor(Math.random() * citiesData.length);
      const randomItem = citiesData[randomIdx];

      setCities(citiesData);

      const likesMap: Record<string, string[]> = {};

      citiesData.forEach((city) => {
        likesMap[city.id] = city.likes || [];
      });

      setCitiesLikes(likesMap);

      setRandomCity(randomItem);
      setIsLoading(false);
    };

    fetchCities();
  }, []);

  const toggleLike = async (cityId: string, userId: string) => {
    const cityRef = doc(db, COLLECTION, cityId);
    const docSnap = await getDoc(cityRef);
    const cityData = docSnap.data();
    const likes: string[] = cityData?.likes || [];

    const updatedLikes = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];

    await updateDoc(cityRef, { likes: updatedLikes });

    setCitiesLikes((prevState) => ({ ...prevState, [cityId]: updatedLikes }));
  };

  return (
    <CitiesContext.Provider value={{ cities, isLoading, randomCity, citiesLikes, toggleLike }}>
      {children}
    </CitiesContext.Provider>
  );
};
