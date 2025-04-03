import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { CityType } from '@shared/types/city';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@shared/config/firebase';
import { CitiesContext } from '@shared/contexts/CitiesContext';
import { COLLECTION } from '@shared/constants/constants';
import { fetchCities } from '@shared/services/cities/fetchCities';
import { useRequestError } from '@shared/hooks/useRequestError';
import { subscribeToCities } from '@shared/services/cities/subscribeToCity';

export const CitiesContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [cities, setCities] = useState<CityType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [randomCity, setRandomCity] = useState<CityType | null>(null);
  const [citiesLikes, setCitiesLikes] = useState<Record<string, string[]>>({});
  const { requestError, setRequestError, clearError } = useRequestError();

  const fetchWithRetry = useCallback(
    async (retries = 3, delay = 2000) => {
      const res = (await fetchCities({ mode: 'all' })) as CityType[];

      if (typeof res === 'string') {
        if (retries > 0) {
          setTimeout(() => fetchWithRetry(retries - 1, delay), delay);
        } else {
          setRequestError(res);
          setIsLoading(false);
        }
        return;
      }

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
    },
    [clearError, setRequestError]
  );

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    if (!isCancelled) {
      fetchWithRetry();
    }

    return () => {
      isCancelled = true;
    };
  }, [fetchWithRetry]);

  useEffect(() => {
    const unsubscribe = subscribeToCities({
      mode: 'all',
      onUpdate: (data) => {
        if (typeof data !== 'string') {
          setCities(data as CityType[]);
        }
      },
    });

    return () => unsubscribe();
  }, []);

  const toggleLike = async (cityId: string, userId: string) => {
    const cityRef = doc(db, COLLECTION, cityId);
    const docSnap = await getDoc(cityRef);
    const cityData = docSnap.data();
    const likes: string[] = cityData?.likes || [];

    const updatedLikes = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];

    await updateDoc(cityRef, { likes: updatedLikes });

    if (typeof updatedLikes === 'string') {
      setRequestError(updatedLikes);
      return;
    }

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
        citiesRequestError: requestError,
        fetchWithRetry,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};
