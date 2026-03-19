import { useCallback, useContext, useId, useRef, useState } from "react";
import { NavigationGuardProviderContext } from "../components/NavigationGuardProviderContext";
import { NavigationGuardCallback, NavigationGuardOptions } from "../types";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { debug } from "../utils/debug";

// Should memoize callback func
export function useNavigationGuard(options: NavigationGuardOptions) {
  const callbackId = useId();
  const guardMapRef = useContext(NavigationGuardProviderContext);
  if (!guardMapRef && !options.disableForTesting)
    throw new Error(
      "[next-nav-guard] useNavigationGuard must be used within <NavigationGuardProvider>.\n" +
        "Add it to your root layout (app/layout.tsx):\n\n" +
        '  import { NavigationGuardProvider } from "nextjs-nav-guard";\n\n' +
        "  export default function RootLayout({ children }) {\n" +
        "    return <NavigationGuardProvider>{children}</NavigationGuardProvider>;\n" +
        "  }"
    );

  const [pendingState, setPendingState] = useState<{
    resolve: (accepted: boolean) => void;
  } | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (options.disableForTesting) return;

    const callback: NavigationGuardCallback = (params) => {
      debug(`Guard callback called with:`, params);
      if (options.confirm) {
        debug(`Using sync confirm function`);
        return options.confirm(params);
      }

      debug(`Using async confirm, setting pending state`);
      return new Promise<boolean>((resolve) => {
        // Small delay to ensure state update propagates
        setTimeout(() => {
          setPendingState({ resolve });
        }, 0);
      });
    };

    const enabled = options.enabled;

    guardMapRef!.current.set(callbackId, {
      enabled: typeof enabled === "function" ? enabled : () => enabled ?? true,
      callback,
    });

    return () => {
      guardMapRef!.current.delete(callbackId);
    };
  }, [callbackId, guardMapRef, options.confirm, options.enabled, options.disableForTesting]);

  const active = options.disableForTesting ? false : pendingState !== null;

  const accept = useCallback(() => {
    if (!pendingState) return;
    pendingState.resolve(true);
    setPendingState(null);
  }, [pendingState]);

  const reject = useCallback(() => {
    if (!pendingState) return;
    pendingState.resolve(false);
    setPendingState(null);
  }, [pendingState]);

  return { active, accept, reject };
}
