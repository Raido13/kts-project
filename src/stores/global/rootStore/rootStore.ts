import { CitiesStore } from '@shared/stores/global/citiesStore';
import { ModalStore } from '@shared/stores/global/modalStore';
import { UserStore } from '@shared/stores/global/userStore';
import { ToastStore } from '@shared/stores/global/toastStore';
import { computed, makeObservable, observable } from 'mobx';
import { CitiesDataStore, FilterStore, PaginationStore, URLSyncStore } from '@shared/stores/local';

export class RootStore {
  readonly userStore = new UserStore();
  readonly modalStore = new ModalStore();
  readonly toastStore = new ToastStore();

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
    makeObservable(this, {
      userStore: observable,
      modalStore: observable,
      citiesStore: observable,
      toastStore: observable,
      isAppReady: computed,
    });
  }

  get isAppReady() {
    return this.citiesStore.isInit;
  }

  dispose = () => {
    this.citiesStore.dispose?.();
  };
}

export const store = new RootStore();
