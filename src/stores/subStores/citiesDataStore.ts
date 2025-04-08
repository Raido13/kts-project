import { CityType } from '@shared/types/city';
import { getMostLikedCity } from '@shared/utils/utils';
import { makeAutoObservable } from 'mobx';

export class CitiesDataStore {
  cities: CityType[] = [];
  relatedCities: CityType[] = [];
  paginatedCities: CityType[] = [];
  mostLikedCity: CityType | null = null;
  currentCity: CityType | null = null;
  citiesLikes: Record<string, string[]> = {};

  constructor() {
    makeAutoObservable(this);
  }

  updateCities(data: CityType[]) {
    this.cities = data;
    this.mostLikedCity = getMostLikedCity(data);
    this.citiesLikes = Object.fromEntries(data.map((c) => [c.id, c.likes || []]));
  }

  updatePaginatedCities = (cities: CityType[]) => {
    this.paginatedCities = cities;
  };

  updateRelatedCities = (cities: CityType[]) => {
    this.relatedCities = cities;
  };

  updateCurrentCity = (city: CityType) => {
    this.currentCity = city;
  };

  updateCityLikes = (cityId: string, likes: string[]) => {
    this.citiesLikes = { ...this.citiesLikes, [cityId]: likes };
  };
}
