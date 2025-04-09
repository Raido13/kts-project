import { ModalType } from '@shared/types/modal';
import { action, computed, makeObservable, observable } from 'mobx';

export class ModalStore {
  _modal: ModalType = null;

  constructor() {
    makeObservable<this, '_modal'>(this, {
      _modal: observable,
      modal: computed,
      openModal: action,
      closeModal: action,
    });
  }

  get modal() {
    return this._modal;
  }

  openModal = action((modal: ModalType) => {
    this._modal = modal;
  });

  closeModal = action(() => {
    this._modal = null;
  });
}
