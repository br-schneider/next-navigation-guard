"use client";

import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { type MutableRefObject, type ReactNode } from "react";
import { useInterceptedPagesRouter } from "../hooks/useInterceptedPagesRouter";
import { GuardDef, NavigationGuardCallback } from "../types";

export function InterceptPagesRouterProvider({
  guardMapRef,
  children,
}: {
  guardMapRef: MutableRefObject<Map<string, GuardDef>>;
  children: ReactNode;
}) {
  const interceptedRouter = useInterceptedPagesRouter({ guardMapRef });
  if (!interceptedRouter) {
    return <>{children}</>;
  }

  return (
    <RouterContext.Provider value={interceptedRouter}>
      {children}
    </RouterContext.Provider>
  );
}
