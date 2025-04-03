import { logout as signOut } from '@shared/services/auth/logout';
import { signIn } from '@shared/services/auth/signIn';
import { signUp } from '@shared/services/auth/signUp';
import { User } from 'firebase/auth';
import { makeAutoObservable } from 'mobx';

class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    const user = await signIn({ email, password });

    if (typeof user === 'string') {
      return user;
    }

    this.user = user;
  }

  async register(email: string, password: string) {
    const user = await signUp({ email, password });

    if (typeof user === 'string') {
      return user;
    }

    this.user = user;
  }

  async logout() {
    const isLoggedOut = await signOut();

    if (typeof isLoggedOut === 'string') {
      return isLoggedOut;
    }

    this.user = null;
  }
}

export const userStore = new UserStore();
