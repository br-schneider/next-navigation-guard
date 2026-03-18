"use client";

import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { type MutableRefObject, type ReactNode } from "react";
import { useInterceptedAppRouter } from "../hooks/useInterceptedAppRouter";
import { GuardDef } from "../types";

export function InterceptAppRouterProvider({
  guardMapRef,
  children,
}: {
  guardMapRef: MutableRefObject<Map<string, GuardDef>>;
  children: ReactNode;
}) {
  const interceptedRouter = useInterceptedAppRouter({ guardMapRef });
  if (!interceptedRouter) {
    return <>{children}</>;
  }

  return (
    <AppRouterContext.Provider value={interceptedRouter}>
      {children}
    </AppRouterContext.Provider>
  );
}
