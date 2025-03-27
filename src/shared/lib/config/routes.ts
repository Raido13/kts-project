import { HOME, CITIES } from '../constants/links';

export const routes = {
  home: HOME,
  cities: CITIES,
  city: (id: number | string) => `${CITIES}/${id}`,
};
