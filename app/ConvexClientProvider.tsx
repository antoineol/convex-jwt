"use client";

import { useJwtConvexAuth } from "@/hooks/useJwtAuth";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useJwtConvexAuth}>
      {children}
    </ ConvexProviderWithAuth>
  );
}