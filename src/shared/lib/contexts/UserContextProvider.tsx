import { FC, PropsWithChildren, useState } from 'react';
import { UserContext } from './UserContext';
import { User } from 'firebase/auth';

export const UserContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const recordUser = (user: User | null) => setUser(user);

  return <UserContext.Provider value={{ user, recordUser }}>{children}</UserContext.Provider>;
};
