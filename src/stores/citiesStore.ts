import { fetchCities } from '@shared/services/cities/fetchCities';
import { subscribeToCities } from '@shared/services/cities/subscribeToCity';
import { updateCity } from '@shared/services/cities/updateCity';
import { CityType } from '@shared/types/city';
import { makeAutoObservable, runInAction, reaction } from 'mobx';
import { Option } from '@shared/types/options';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Range } from '@shared/types/slider';
import { getMostLikedCity } from '@shared/utils/utils';

class CitiesStore {
  cities: CityType[] = [];
  totalCities: number = 0;

  relatedCities: CityType[] = [];
  paginatedCities: CityType[] = [];

  mostLikedCity: CityType | null = null;
  currentCity: CityType | null = null;
  citiesLikes: Record<string, string[]> = {};

  isLoading: boolean = true;
  requestError: string | null = null;

  dropdownOptions: Option[] = [];
  dropdownValue: Option[] = [];
  filters: string[] = [];
  lastDocs: QueryDocumentSnapshot<DocumentData, DocumentData>[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  viewPerPage: Range<3, 10> = 3;
  private unsubscribeFn: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => [
        this.dropdownValue.map(({ key }) => key).join(','),
        this.searchQuery,
        this.viewPerPage,
        this.targetCursor,
        this.currentPage,
        this.filters.join(','),
      ],
      () => {
        this.loadPaginatedCities();
      }
    );
  }

  init(query?: URLSearchParams) {
    if (query) {
      if (query) {
        this.setSearchQuery(query.get('query') ?? '');
        this.setCurrentPage(Number(query.get('page') ?? 1));
        this.setViewPerPage(Number(query.get('perPage') ?? 3) as Range<3, 10>);
        const filters = query.getAll('filter');
        const matchedOptions = this.dropdownOptions.filter((o) => filters.includes(o.value));
        this.setDropdownValue(matchedOptions);
      }
    }

    this.fetchAllWithRetry();
    this.subscribeToUpdates();
  }

  setError = (message: string | null) => {
    this.requestError = message;
  };

  fetchAllWithRetry = async (retries = 3, delay = 2000) => {
    runInAction(() => {
      this.isLoading = true;
    });
    const res = (await fetchCities({ mode: 'all' })) as CityType[];

    if (typeof res === 'string') {
      if (retries > 0) {
        setTimeout(() => this.fetchAllWithRetry(retries - 1, delay), delay);
      } else {
        runInAction(() => {
          this.setError(res);
          this.isLoading = false;
        });
      }
      return;
    }

    runInAction(() => {
      this.setError(null);
      this.cities = res;
      this.mostLikedCity = getMostLikedCity(res);
      this.citiesLikes = Object.fromEntries(res.map((c) => [c.id, c.likes || []]));
      this.isLoading = false;
    });
  };

  fetchRelated = async (citiesNumber: number) => {
    runInAction(() => {
      this.isLoading = true;
    });
    await fetchCities({ mode: 'related', relatedCities: citiesNumber })
      .then((res) => {
        if (Array.isArray(res)) {
          runInAction(() => {
            this.relatedCities = res as CityType[];
          });
        }
      })
      .finally(() =>
        runInAction(() => {
          this.isLoading = false;
        })
      );
  };

  fetchCurrent = async (currentCityId: string) => {
    runInAction(() => {
      this.isLoading = true;
    });
    await fetchCities({
      mode: 'single',
      currentCityId,
    })
      .then((res) => {
        if (typeof res !== 'string') {
          runInAction(() => {
            this.currentCity = res as CityType;
          });
        }
      })
      .finally(() =>
        runInAction(() => {
          this.isLoading = false;
        })
      );
  };

  subscribeToUpdates = () => {
    this.unsubscribeFn = subscribeToCities({
      mode: 'all',
      onUpdate: (data) => {
        runInAction(() => {
          this.isLoading = true;
        });
        if (typeof data === 'string') {
          this.setError(data);
          return;
        }
        runInAction(() => {
          this.cities = data as CityType[];
          this.isLoading = false;
        });
      },
    });
  };

  toggleLike = async (cityId: string, userId: string) => {
    const updatedLikes = await updateCity({ mode: 'like', userId });

    if (typeof updatedLikes === 'string') {
      this.setError(updatedLikes);
      return;
    }
    runInAction(() => {
      this.citiesLikes = { ...this.citiesLikes, [cityId]: updatedLikes };
    });
  };

  loadDropdownOptions = async () => {
    const res = await fetchCities({ mode: 'options' });
    if (Array.isArray(res)) {
      runInAction(() => {
        this.dropdownOptions = res as Option[];
      });
    }
  };

  setDropdownValue = (value: Option[]) => {
    this.dropdownValue = value;
    this.filters = value.map(({ value }) => value);
  };

  get getDropdownTitle() {
    if (!this.dropdownValue) return 'Choose Country';
    return this.dropdownValue.length === 0 ? 'Choose Country' : this.dropdownValue.map(({ value }) => value).join(', ');
  }

  get targetCursor() {
    return this.currentPage === 1 ? null : (this.lastDocs[this.currentPage - 2] ?? null);
  }

  setSearchQuery = (value: string) => {
    this.setCurrentPage(1);
    this.lastDocs = [];
    this.searchQuery = value;
  };

  setCurrentPage = (page: number) => {
    this.currentPage = page;
  };

  setViewPerPage = (viewPerPage: Range<3, 10>) => {
    this.lastDocs = [];
    this.setCurrentPage(1);
    this.viewPerPage = viewPerPage;
  };

  loadPaginatedCities = async () => {
    runInAction(() => {
      this.isLoading = true;
    });

    const res = await fetchCities({
      mode: 'paginate',
      perPage: this.viewPerPage,
      searchQuery: this.searchQuery,
      filters: this.filters,
      lastDoc: this.targetCursor,
    });

    if (typeof res !== 'string' && 'data' in res) {
      runInAction(() => {
        this.paginatedCities = res.data;
        this.totalCities = res.total;

        if (this.currentPage > this.lastDocs.length && res.lastDoc) {
          this.lastDocs.push(res.lastDoc);
        }
      });
    }
    runInAction(() => {
      this.isLoading = false;
    });
  };

  dispose() {
    this.unsubscribeFn?.();
  }
}

export const citiesStore = new CitiesStore();
