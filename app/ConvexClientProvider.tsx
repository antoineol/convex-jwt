"use client";

import { fetchTokenCached, setDefaultJwt } from "@/lib/fetchToken";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PropsWithChildren } from "react";

export type ConvexClientProviderProps = PropsWithChildren<{
  defaultJwt: string;
}>;

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  expectAuth: true,
});

export function ConvexClientProvider({ defaultJwt, children }: ConvexClientProviderProps) {
  setDefaultJwt(defaultJwt);
  convex.setAuth(fetchTokenCached);

  return (
    <ConvexProvider client={convex}>{children}</ConvexProvider>
  );
}