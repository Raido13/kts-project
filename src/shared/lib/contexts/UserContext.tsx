import { createContext } from 'react';
import { User } from 'firebase/auth';

interface UserContextProps {
  user: User | null;
  recordUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextProps | null>(null);
