"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterceptLinkClicks = useInterceptLinkClicks;
const useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
const react_1 = require("react");
const debug_1 = require("../utils/debug");
const nextInternals_1 = require("../utils/nextInternals");
function useInterceptLinkClicks({ guardMapRef, }) {
    const isSetup = (0, react_1.useRef)(false);
    const appRouter = (0, react_1.useContext)(nextInternals_1.AppRouterContext !== null && nextInternals_1.AppRouterContext !== void 0 ? nextInternals_1.AppRouterContext : nextInternals_1.FallbackRouterContext);
    const appRouterRef = (0, react_1.useRef)(appRouter);
    appRouterRef.current = appRouter;
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(() => {
        if (typeof window === "undefined")
            return;
        // Reset on remount (React Strict Mode)
        if (isSetup.current)
            return;
        // If AppRouterContext doesn't exist, skip
        if (!nextInternals_1.AppRouterContext) {
            (0, debug_1.debug)("AppRouterContext not available, skipping link interceptor");
            return;
        }
        // Only use link interceptor if we're in App Router mode
        if (!appRouter) {
            (0, debug_1.debug)("Not in App Router context, skipping link interceptor");
            return;
        }
        // Mark as setup only after all checks pass
        isSetup.current = true;
        (0, debug_1.debug)("Setting up link click interceptor");
        const handleLinkClick = async (e) => {
            const target = e.target;
            const link = target.closest("a[href]");
            if (!link)
                return;
            // Skip if already being processed
            if (link.dataset.guardProcessing === "true")
                return;
            const href = link.getAttribute("href");
            if (!href)
                return;
            // Skip external links
            if (href.startsWith("http://") ||
                href.startsWith("https://") ||
                href.startsWith("//")) {
                return;
            }
            // Skip hash links
            if (href.startsWith("#"))
                return;
            // Skip non-HTTP protocol links (mailto:, tel:, blob:, data:, etc.)
            if (/^[a-z][a-z0-9+.-]*:/i.test(href))
                return;
            // Skip if it has a target attribute (opens in new window/tab)
            if (link.target && link.target !== "_self")
                return;
            // Skip if it's a download link
            if (link.hasAttribute("download"))
                return;
            // Check if modifier keys are pressed (Ctrl, Cmd, Shift, Alt)
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                return;
            // Check if it's a middle click (open in new tab)
            if (e.button !== 0)
                return;
            (0, debug_1.debug)(`Intercepted link click to: ${href}`);
            // Mark as processing to prevent double-handling
            link.dataset.guardProcessing = "true";
            // Get navigation type (default to push)
            const navigateType = link.dataset.replace === "true" ? "replace" : "push";
            // Check guards
            const defs = [...guardMapRef.current.values()];
            const enabledGuards = defs.filter(({ enabled }) => enabled({ to: href, type: navigateType }));
            if (enabledGuards.length === 0) {
                delete link.dataset.guardProcessing;
                (0, debug_1.debug)("No guards enabled, allowing navigation");
                return;
            }
            // We have guards to check — prevent default immediately for async handling
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            let shouldNavigate = true;
            for (const { callback } of enabledGuards) {
                (0, debug_1.debug)(`Calling guard callback for ${navigateType} to ${href}`);
                try {
                    const result = await callback({ to: href, type: navigateType });
                    (0, debug_1.debug)(`Guard callback returned: ${result}`);
                    if (!result) {
                        shouldNavigate = false;
                        break;
                    }
                }
                catch (error) {
                    (0, debug_1.debug)("Guard callback error:", error);
                    shouldNavigate = false;
                    break;
                }
            }
            delete link.dataset.guardProcessing;
            if (shouldNavigate) {
                (0, debug_1.debug)("All guards passed, navigating programmatically");
                // Use the App Router for client-side navigation (avoids full page reload)
                const router = appRouterRef.current;
                if (router) {
                    if (navigateType === "replace") {
                        router.replace(href);
                    }
                    else {
                        router.push(href);
                    }
                }
                else {
                    // Fallback to full navigation if router is unavailable
                    if (navigateType === "replace") {
                        location.replace(href);
                    }
                    else {
                        location.href = href;
                    }
                }
            }
            else {
                (0, debug_1.debug)("Navigation blocked by guard");
            }
        };
        // Add event listener in capture phase to intercept before React
        document.addEventListener("click", handleLinkClick, true);
        return () => {
            (0, debug_1.debug)("Cleaning up link click interceptor");
            document.removeEventListener("click", handleLinkClick, true);
            isSetup.current = false;
        };
    }, [guardMapRef, appRouter]);
}
