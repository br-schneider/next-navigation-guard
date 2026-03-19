import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";
import { MutableRefObject, useContext, useRef } from "react";
import { GuardDef } from "../types";
import { debug } from "../utils/debug";
import {
  AppRouterContext,
  FallbackRouterContext,
} from "../utils/nextInternals";

export function useInterceptLinkClicks({
  guardMapRef,
}: {
  guardMapRef: MutableRefObject<Map<string, GuardDef>>;
}) {
  const isSetup = useRef(false);
  const appRouter = useContext(AppRouterContext ?? FallbackRouterContext);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Reset on remount (React Strict Mode)
    if (isSetup.current) return;
    isSetup.current = true;

    // If AppRouterContext doesn't exist, skip
    if (!AppRouterContext) {
      debug("AppRouterContext not available, skipping link interceptor");
      return;
    }

    // Only use link interceptor if we're in App Router mode
    if (!appRouter) {
      debug("Not in App Router context, skipping link interceptor");
      return;
    }

    debug("Setting up link click interceptor");

    const handleLinkClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[href]") as HTMLAnchorElement;

      if (!link) return;

      // Skip if already being processed
      if (link.dataset.guardProcessing === "true") return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Skip external links
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        return;
      }

      // Skip hash links
      if (href.startsWith("#")) return;

      // Skip if it has a target attribute (opens in new window/tab)
      if (link.target && link.target !== "_self") return;

      // Skip if it's a download link
      if (link.hasAttribute("download")) return;

      // Check if modifier keys are pressed (Ctrl, Cmd, Shift, Alt)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Check if it's a middle click (open in new tab)
      if (e.button !== 0) return;

      debug(`Intercepted link click to: ${href}`);

      // Mark as processing to prevent double-handling
      link.dataset.guardProcessing = "true";

      // Get navigation type (default to push)
      const navigateType =
        link.dataset.replace === "true" ? "replace" : "push";

      // Check guards
      const defs = [...guardMapRef.current.values()];
      const enabledGuards = defs.filter(({ enabled }) =>
        enabled({ to: href, type: navigateType })
      );

      if (enabledGuards.length === 0) {
        delete link.dataset.guardProcessing;
        debug("No guards enabled, allowing navigation");
        return;
      }

      // We have guards to check — prevent default immediately for async handling
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      let shouldNavigate = true;

      for (const { callback } of enabledGuards) {
        debug(`Calling guard callback for ${navigateType} to ${href}`);

        try {
          const result = await callback({ to: href, type: navigateType });
          debug(`Guard callback returned: ${result}`);

          if (!result) {
            shouldNavigate = false;
            break;
          }
        } catch (error) {
          debug("Guard callback error:", error);
          shouldNavigate = false;
          break;
        }
      }

      delete link.dataset.guardProcessing;

      if (shouldNavigate) {
        debug("All guards passed, navigating programmatically");
        const router = (window as any).next?.router;
        if (router) {
          if (navigateType === "replace") {
            router.replace(href);
          } else {
            router.push(href);
          }
        } else {
          if (navigateType === "replace") {
            location.replace(href);
          } else {
            location.href = href;
          }
        }
      } else {
        debug("Navigation blocked by guard");
      }
    };

    // Add event listener in capture phase to intercept before React
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      debug("Cleaning up link click interceptor");
      document.removeEventListener("click", handleLinkClick, true);
      isSetup.current = false;
    };
  }, [guardMapRef]);
}
