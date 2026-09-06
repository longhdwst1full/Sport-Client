'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isCustomerAuthenticated,
  readCustomerAuthTokens,
  clearCustomerAuthTokens,
} from './auth-token.store';

export function useCustomerAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const checkAuth = useCallback(() => {
    setIsAuthenticated(isCustomerAuthenticated());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('dctd:auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('dctd:auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [checkAuth]);

  const logout = useCallback(() => {
    clearCustomerAuthTokens();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoaded,
    tokens: isAuthenticated ? readCustomerAuthTokens() : undefined,
    logout,
    checkAuth,
  };
}
