import { HOME, CITIES } from '@shared/constants/links';

export const routes = {
  home: HOME,
  cities: CITIES,
  city: (id: string) => `${CITIES}/${id}`,
};
