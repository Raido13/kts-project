import { CitiesStore } from '@shared/stores/global/citiesStore';
import { ModalStore } from '@shared/stores/global/modalStore';
import { UserStore } from '@shared/stores/global/userStore';
import { ToastStore } from '@shared/stores/global/toastStore';
import { RouterStore } from '@shared/stores/global/routerStore';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { CitiesDataStore, FilterStore, PaginationStore, URLSyncStore } from '@shared/stores/local';
import { CITIES } from '@shared/constants/links';

export class RootStore {
  readonly userStore = new UserStore();
  readonly modalStore = new ModalStore();
  readonly toastStore = new ToastStore();
  readonly routerStore = new RouterStore();

  readonly citiesDataStore = new CitiesDataStore();
  readonly paginationStore = new PaginationStore();
  readonly filterStore = new FilterStore(this.paginationStore);
  readonly urlSyncStore = new URLSyncStore(this.filterStore, this.paginationStore);

  readonly citiesStore = new CitiesStore(
    this.urlSyncStore,
    this.citiesDataStore,
    this.paginationStore,
    this.filterStore
  );

  constructor() {
    makeObservable<RootStore, '_navigate'>(this, {
      userStore: observable,
      modalStore: observable,
      citiesStore: observable,
      toastStore: observable,
      isAppReady: computed,
      setNavigate: action,
      _navigate: observable,
    });

    reaction(
      () => ({
        pathname: this.routerStore.pathname,
        search: this.routerStore.search,
      }),
      async ({ pathname, search }) => {
        this.citiesStore.init();
        if (pathname === CITIES) {
          if (!this.citiesStore.isInitFromUrl) {
            this.citiesStore.initUrlSync(this._navigate, pathname);
          }
          await this.citiesStore.initFromUrl(search);
        }
      }
    );
  }

  private _navigate: (path: string) => void = () => {};

  setNavigate = (navigate: (path: string) => void) => {
    this._navigate = navigate;
  };

  get isAppReady() {
    return this.citiesStore.isInit;
  }

  dispose = () => {
    this.citiesStore.dispose?.();
  };
}

export const store = new RootStore();
