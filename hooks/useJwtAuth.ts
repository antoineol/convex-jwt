"use client";

import { useState, useCallback } from "react";

let cachedToken: string | null = null;

export function useJwtAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cachedToken);

  const getToken = useCallback(
    async ({ ignoreCache = false }: { ignoreCache?: boolean } = {}) => {
      if (!ignoreCache && cachedToken) {
        return cachedToken;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/token");
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const { token } = await response.json();
        cachedToken = token;
        setIsAuthenticated(true);
        return token;
        // Catch block removable?
      } catch (error) {
        cachedToken = null;
        setIsAuthenticated(false);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, isAuthenticated, getToken };
}

