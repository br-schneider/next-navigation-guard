import { createContext } from "react";

// Centralize all Next.js internal imports with graceful fallbacks.
// These paths are not part of Next.js's public API and may change between versions.

let _AppRouterContext: React.Context<any> | null = null;

try {
  _AppRouterContext =
    require("next/dist/shared/lib/app-router-context.shared-runtime").AppRouterContext;
} catch {
  // Import path changed or doesn't exist in this Next.js version
}

export const AppRouterContext = _AppRouterContext;

/**
 * Fallback context that always returns null. Used to satisfy React's
 * rules of hooks (useContext must be called unconditionally).
 */
export const FallbackRouterContext: React.Context<any> =
  createContext<any>(null);
