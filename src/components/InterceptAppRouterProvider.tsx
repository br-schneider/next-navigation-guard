"use client";

import { type MutableRefObject, type ReactNode } from "react";
import { useInterceptedAppRouter } from "../hooks/useInterceptedAppRouter";
import { GuardDef } from "../types";
import { AppRouterContext } from "../utils/nextInternals";

let warnedMissingContext = false;

export function InterceptAppRouterProvider({
  guardMapRef,
  children,
}: {
  guardMapRef: MutableRefObject<Map<string, GuardDef>>;
  children: ReactNode;
}) {
  const interceptedRouter = useInterceptedAppRouter({ guardMapRef });

  if (!AppRouterContext) {
    if (process.env.NODE_ENV === "development" && !warnedMissingContext) {
      warnedMissingContext = true;
      console.warn(
        "[next-nav-guard] Could not access Next.js router context. " +
          "Router interception (push/replace) will not work. " +
          "Link click and browser navigation guards still function. " +
          "This may happen if your Next.js version changed internal APIs — please update next-nav-guard."
      );
    }
    return <>{children}</>;
  }

  if (!interceptedRouter) {
    return <>{children}</>;
  }

  return (
    <AppRouterContext.Provider value={interceptedRouter}>
      {children}
    </AppRouterContext.Provider>
  );
}
