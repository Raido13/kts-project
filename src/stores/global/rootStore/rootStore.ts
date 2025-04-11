import { CitiesStore } from '@shared/stores/global/citiesStore';
import { ModalStore } from '@shared/stores/global/modalStore';
import { UserStore } from '@shared/stores/global/userStore';
import { makeObservable, observable } from 'mobx';
import { ToastStore } from '../toastStore';

export class RootStore {
  readonly userStore = new UserStore();
  readonly citiesStore = new CitiesStore();
  readonly modalStore = new ModalStore();
  readonly toastStore = new ToastStore();

  constructor() {
    this.userStore = new UserStore();
    this.modalStore = new ModalStore();
    this.citiesStore = new CitiesStore();
    this.toastStore = new ToastStore();

    makeObservable(this, {
      userStore: observable,
      modalStore: observable,
      citiesStore: observable,
      toastStore: observable,
    });
  }

  dispose = () => {
    this.citiesStore.dispose?.();
  };
}

export const store = new RootStore();
