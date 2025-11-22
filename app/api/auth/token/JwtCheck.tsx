"use client";

import { useJwtAuth } from "@/hooks/useJwtAuth";
import { useState } from "react";

export function JwtCheck() {
    const { isLoading, isAuthenticated, getToken } = useJwtAuth();
    const [token, setToken] = useState<string | null>(null);

    const handleGetToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const forceRefresh = e.currentTarget.forceRefresh.checked;
        try {
            setToken(await getToken({ ignoreCache: forceRefresh }));
        } catch (error) {
            console.error("Failed to get token:", error);
        }
    };

    return (
        <div className="mb-4 p-4 border rounded">
            <h2 className="font-bold mb-2">JWT Auth Hook check</h2>
            <p>{isLoading ? <span className="animate-pulse">Loading</span> : <span>Loaded</span>}</p>
            <p>{isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
            <form onSubmit={handleGetToken}>
                <label className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        name="forceRefresh"
                    />
                    Force refresh token
                </label>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    {isLoading ? "Loading..." : "Get Token"}
                </button>
            </form>
            {token && (
                <p className="mt-2 text-xs break-all whitespace-pre-wrap">Token: {token}</p>
            )}
        </div>
    );
}