"use client";

import { useState, useCallback, useMemo } from "react";

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

export function useJwtConvexAuth() {
    const { isLoading, isAuthenticated, getToken } = useJwtAuth();
    const fetchAccessToken = useCallback(
        async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
            console.log("Convex fetches token"); // Never logged

            // Here you can do whatever transformation to get the ID Token
            // or null
            // Make sure to fetch a new token when `forceRefreshToken` is true
            return await getToken({ ignoreCache: forceRefreshToken });
        },
        // If `getToken` isn't correctly memoized
        // remove it from this dependency array
        [getToken],
    );
    return useMemo(
        () => ({
            // Whether the auth provider is in a loading state
            isLoading: isLoading,
            // Whether the auth provider has the user signed in
            isAuthenticated: isAuthenticated ?? false,
            // The async function to fetch the ID token
            fetchAccessToken,
        }),
        [isLoading, isAuthenticated, fetchAccessToken],
    );
}