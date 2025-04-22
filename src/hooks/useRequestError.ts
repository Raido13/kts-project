import { useCallback, useState } from 'react';

export const useRequestError = () => {
  const [requestError, setRequestErrorState] = useState<string | null>(null);

  const setRequestError = useCallback((e: string) => setRequestErrorState(e), []);
  const clearError = useCallback(() => setRequestErrorState(null), []);

  return { requestError, setRequestError, clearError };
};
