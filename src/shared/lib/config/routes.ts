import { HOME, CITIES } from '../constants/links';

export const routes = {
  home: HOME,
  cities: CITIES,
  city: (id: string) => `${CITIES}/${id}`,
};
