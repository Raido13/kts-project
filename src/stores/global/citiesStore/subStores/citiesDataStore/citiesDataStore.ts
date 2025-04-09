import { CityType } from '@shared/types/city';
import { getMostLikedCity } from '@shared/utils/utils';
import { action, computed, makeObservable, observable } from 'mobx';

export class CitiesDataStore {
  private _cities: CityType[] = [];
  private _relatedCities: CityType[] = [];
  private _paginatedCities: CityType[] = [];
  private _currentCity: CityType | null = null;
  private _citiesLikes: Record<string, string[]> = {};

  constructor() {
    makeObservable<
      CitiesDataStore,
      '_cities' | '_relatedCities' | '_paginatedCities' | '_currentCity' | '_citiesLikes'
    >(this, {
      _cities: observable,
      _relatedCities: observable,
      _paginatedCities: observable,
      _currentCity: observable,
      _citiesLikes: observable,
      cities: computed,
      relatedCities: computed,
      paginatedCities: computed,
      mostLikedCity: computed,
      currentCity: computed,
      citiesLikes: computed,
      updateCities: action,
      updatePaginatedCities: action,
      updateRelatedCities: action,
      updateCurrentCity: action,
      updateCityLikes: action,
    });
  }

  get cities(): CityType[] {
    return this._cities;
  }

  get relatedCities(): CityType[] {
    return this._relatedCities;
  }

  get paginatedCities(): CityType[] {
    return this._paginatedCities;
  }

  get mostLikedCity(): CityType | null {
    return getMostLikedCity(this._cities);
  }

  get currentCity(): CityType | null {
    return this._currentCity;
  }

  get citiesLikes(): Record<string, string[]> {
    return this._citiesLikes;
  }

  updateCities = action((data: CityType[]): void => {
    this._cities = data;
    this._citiesLikes = Object.fromEntries(data.map((c) => [c.id, c.likes || []]));
  });

  updatePaginatedCities = action((cities: CityType[]): void => {
    this._paginatedCities = cities;
  });

  updateRelatedCities = action((cities: CityType[]): void => {
    this._relatedCities = cities;
  });

  updateCurrentCity = action((city: CityType): void => {
    this._currentCity = city;
  });

  updateCityLikes = action((cityId: string, likes: string[]): void => {
    this._citiesLikes = { ...this._citiesLikes, [cityId]: likes };
  });
}
