"use client";

import { fetchTokenCached } from "@/lib/fetchToken";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: true,
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  convex.setAuth(fetchTokenCached);

  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  );
}