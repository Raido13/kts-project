import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { City } from '@shared/types/city';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { CitiesContext } from '@shared/contexts/CitiesContext';
import { COLLECTION } from '@shared/constants/constants';
import { fetchCards } from '@shared/services/cities/fetchCards';
import { useRequestError } from '@shared/hooks/useRequestError';

export const CitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [randomCity, setRandomCity] = useState<City | null>(null);
  const [citiesLikes, setCitiesLikes] = useState<Record<string, string[]>>({});
  const { requestError, setRequestError, clearError } = useRequestError();

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    const fetchWithRetry = async (retries = 3, delay = 2000) => {
      if (isCancelled) return;

      const res = await fetchCards();

      if (typeof res === 'string') {
        if (retries > 0) {
          setTimeout(() => fetchWithRetry(retries - 1, delay), delay);
        } else {
          setRequestError(res);
          setIsLoading(false);
        }
        return;
      }

      if (isCancelled) return;

      clearError();
      setCities(res);

      const randomIdx = Math.floor(Math.random() * res.length);
      const randomItem = res[randomIdx];
      setRandomCity(randomItem);

      const likesMap: Record<string, string[]> = {};
      res.forEach((city) => {
        likesMap[city.id] = city.likes || [];
      });
      setCitiesLikes(likesMap);

      setIsLoading(false);
    };

    fetchWithRetry();

    return () => {
      isCancelled = true;
    };
  }, [clearError, setRequestError]);

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
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        randomCity,
        citiesLikes,
        toggleLike,
        cardsRequestError: requestError,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
