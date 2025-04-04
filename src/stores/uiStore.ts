import { ModalType } from '@shared/types/modal';
import { makeAutoObservable } from 'mobx';

class UiStore {
  modal: ModalType = null;

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (modal: ModalType) => {
    this.modal = modal;
  };

  closeModal = () => {
    this.modal = null;
  };
}

export const uiStore = new UiStore();
