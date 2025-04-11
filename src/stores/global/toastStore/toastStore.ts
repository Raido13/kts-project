import { ToastAnimationType, ToastType, ToastVariant } from '@shared/types/toast';
import { action, computed, makeObservable, observable } from 'mobx';

export class ToastStore {
  private _toasts: ToastType[] = [];
  private _counter: number = 0;

  constructor() {
    makeObservable<ToastStore, '_toasts' | '_counter' | '_clearToasts'>(this, {
      _toasts: observable,
      _counter: observable,
      toasts: computed,
      showToast: action,
      hideToast: action,
      _clearToasts: action,
    });
  }

  get toasts() {
    return this._toasts;
  }

  showToast = action(
    (
      message: string,
      variant: ToastVariant,
      onClose?: () => void,
      duration?: number,
      showAnimation?: ToastAnimationType,
      className?: string
    ) => {
      this._clearToasts();
      const id = this._counter++;

      const handleClose = () => {
        onClose?.();
        this.hideToast(id);
      };

      this._toasts.push({ id, message, variant, onClose: handleClose, duration, showAnimation, className });
    }
  );

  hideToast = action((id: number) => {
    this._toasts = this._toasts.filter((toast) => toast.id !== id);
  });

  private _clearToasts = action(() => {
    this._toasts = [];
  });
}
