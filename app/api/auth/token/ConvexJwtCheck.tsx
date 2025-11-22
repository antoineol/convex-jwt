"use client";

import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";

export function ConvexJwtCheck() {
    const { isLoading, isAuthenticated } = useConvexAuth();

    return (
        <div className="mb-4 p-4 border rounded">
            <h2 className="font-bold mb-2">Convex Auth check</h2>
            <p>{isLoading ? <span className="animate-pulse">Loading</span> : <span>Loaded</span>}</p>
            <p>{isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
            <Authenticated>
                {/* Never rendered */}
                You are authenticated for Convex.
            </Authenticated>
            <Unauthenticated>
                You are NOT authenticated for Convex.
            </Unauthenticated>
        </div>
    );
}