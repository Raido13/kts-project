import { logout as signOut } from '@shared/services/auth/logout';
import { signIn } from '@shared/services/auth/signIn';
import { signUp } from '@shared/services/auth/signUp';
import { User } from 'firebase/auth';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';

export class UserStore {
  private _user: User | null = null;

  constructor() {
    makeObservable<UserStore, '_user'>(this, {
      _user: observable,
      user: computed,
      register: action,
      login: action,
      logout: action,
    });
  }

  get user(): User | null {
    return this._user;
  }

  register = action(async (email: string, password: string) => {
    const user = await signUp({ email, password });

    if (typeof user === 'string') {
      return user;
    }

    this._user = user;
  });

  login = action(async (email: string, password: string) => {
    const user = await signIn({ email, password });

    if (typeof user === 'string') {
      return user;
    }
    runInAction(() => {
      this._user = user;
    });
  });

  logout = action(async () => {
    const isLoggedOut = await signOut();

    if (typeof isLoggedOut === 'string') {
      return isLoggedOut;
    }

    this._user = null;
  });
}
