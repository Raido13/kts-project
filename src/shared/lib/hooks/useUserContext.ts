import { useContext } from 'react';
import { UserContext } from '../contexts';

export const useUserContext = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('useUserContext must be used within UserContextProvider');
  }

  return userContext;
};
