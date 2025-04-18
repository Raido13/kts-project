import { CityComment, CityDetailType, CityType } from '@shared/types/city';
import { getMostLikedCity } from '@shared/utils/utils';
import { action, computed, makeObservable, observable, toJS } from 'mobx';

export class CitiesDataStore {
  private _cities: CityType[] = [];
  private _relatedCities: CityType[] = [];
  private _paginatedCities: CityType[] = [];
  private _currentCity: CityDetailType | null = null;
  private _citiesLikes: Record<string, string[]> = {};
  private _citiesComments: Record<string, CityComment[]> = {};

  constructor() {
    makeObservable<
      CitiesDataStore,
      '_cities' | '_relatedCities' | '_paginatedCities' | '_currentCity' | '_citiesLikes' | '_citiesComments'
    >(this, {
      _cities: observable,
      _relatedCities: observable,
      _paginatedCities: observable,
      _currentCity: observable,
      _citiesLikes: observable,
      _citiesComments: observable.struct,
      cities: computed,
      relatedCities: computed,
      paginatedCities: computed,
      mostLikedCity: computed,
      currentCity: computed,
      citiesLikes: computed,
      citiesComments: computed,
      updateCities: action,
      updatePaginatedCities: action,
      updateRelatedCities: action,
      updateCurrentCity: action,
      updateCityLikes: action,
      updateCityComments: action,
    });
  }

  get cities(): CityType[] {
    return toJS(this._cities);
  }

  get relatedCities(): CityType[] {
    return toJS(this._relatedCities);
  }

  get paginatedCities(): CityType[] {
    return toJS(this._paginatedCities);
  }

  get mostLikedCity(): CityType | null {
    return getMostLikedCity(this._cities);
  }

  get currentCity(): CityDetailType | null {
    return this._currentCity;
  }

  get citiesLikes(): Record<string, string[]> {
    return this._citiesLikes;
  }

  get citiesComments(): Record<string, CityComment[]> {
    return this._citiesComments;
  }

  updateCities = action((cities: CityType[]): void => {
    this._cities = cities;
    this._citiesLikes = Object.fromEntries(this._cities.map((city) => [city.id, city.likes || []]));
    this._citiesComments = Object.fromEntries(this._cities.map((city) => [city.id, city.comments || []]));
  });

  updatePaginatedCities = action((cities: CityType[]): void => {
    this._paginatedCities = cities;
  });

  updateRelatedCities = action((cities: CityType[] | never[]): void => {
    this._relatedCities = cities;
  });

  updateCurrentCity = action((city: CityDetailType | null): void => {
    this._currentCity = city;
  });

  updateCityLikes = action((cityId: string, likes: string[]): void => {
    this._citiesLikes = { ...this._citiesLikes, [cityId]: likes };
  });

  updateCityComments = action((cityId: string, comments: CityComment[]): void => {
    this._citiesComments = { ...this._citiesComments, [cityId]: comments };
  });
}
