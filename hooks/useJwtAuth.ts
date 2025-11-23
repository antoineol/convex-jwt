"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchToken } from "./details/fetchToken";

let tokenPromise: Promise<string> | null = null;

export function useJwtAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(!!tokenPromise);

    const fetchAccessToken = useCallback(
        async ({ forceRefreshToken = false } = {}) => {
            try {
                console.log('[fetchAccessToken] forceRefreshToken', forceRefreshToken);
                if (forceRefreshToken || !tokenPromise) {
                    setIsLoading(true);
                    tokenPromise = fetchToken();
                }

                const token = await tokenPromise;
                setIsAuthenticated(true);
                return token;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    console.log('[useJwtAuth] isLoading', isLoading, 'isAuthenticated', isAuthenticated);

    useEffect(() => {
        fetchAccessToken().catch((error) => {
            console.error('Error in getToken', error);
        });
    }, [fetchAccessToken]);

    return { isLoading, isAuthenticated, fetchAccessToken: fetchAccessToken };
}
