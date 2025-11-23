"use client";

import { useJwtAuth } from "@/hooks/useJwtAuth";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: true,
  verbose: true,
  logger: {
    logVerbose: (...args) => {
      console.log('[verbose]', ...args);
    },
    log: (...args) => {
      console.log('[log]', ...args);
    },
    warn: (...args) => {
      console.warn('[warn]', ...args);
    },
    error: (...args) => {
      console.error('[error]', ...args);
    },
  }
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useJwtAuth}>
      {children}
    </ ConvexProviderWithAuth>
  );
}