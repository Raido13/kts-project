import { CityInfo } from '@shared/types/city';
import { getLocalTime } from '@shared/utils/utils';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchCityInfo = async (city: string): Promise<CityInfo | undefined> => {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en',
      },
    });

    const data = res.data;

    return {
      temp: Math.trunc(data.main.temp),
      localTime: getLocalTime(data.timezone),
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) {
      console.warn(`City not found: ${city}`);
      return undefined;
    }

    console.error('Error while getting city information', e);
    throw e;
  }
};
