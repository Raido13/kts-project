import { CitiesStore } from '@shared/stores/global/citiesStore';
import { ModalStore } from '@shared/stores/global/modalStore';
import { UserStore } from '@shared/stores/global/userStore';
import { makeObservable, observable } from 'mobx';

export class RootStore {
  readonly userStore = new UserStore();
  readonly citiesStore = new CitiesStore();
  readonly modalStore = new ModalStore();

  constructor() {
    this.userStore = new UserStore();
    this.modalStore = new ModalStore();
    this.citiesStore = new CitiesStore();

    makeObservable(this, {
      userStore: observable,
      modalStore: observable,
      citiesStore: observable,
    });
  }

  dispose = () => {
    this.citiesStore.dispose?.();
  };
}

export const store = new RootStore();
