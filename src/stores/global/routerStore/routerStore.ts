import { action, makeObservable, observable } from 'mobx';

export class RouterStore {
  pathname: string = '';
  search: string = '';

  constructor() {
    makeObservable(this, {
      pathname: observable,
      search: observable,
      setLocation: action,
    });
  }

  setLocation(pathname: string, search: string) {
    this.pathname = pathname;
    this.search = search;
  }
}
