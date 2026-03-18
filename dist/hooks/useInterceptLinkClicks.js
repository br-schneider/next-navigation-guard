"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterceptLinkClicks = useInterceptLinkClicks;
const useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
const react_1 = require("react");
const debug_1 = require("../utils/debug");
// Try to import AppRouterContext, but don't fail if it doesn't exist
let AppRouterContext;
try {
    AppRouterContext = require("next/dist/shared/lib/app-router-context.shared-runtime").AppRouterContext;
}
catch (e) {
    // AppRouterContext doesn't exist in older Next.js versions
    AppRouterContext = null;
}
function useInterceptLinkClicks({ guardMapRef, }) {
    const isSetup = (0, react_1.useRef)(false);
    const needsInterceptor = (0, react_1.useRef)(null);
    const appRouter = AppRouterContext ? (0, react_1.useContext)(AppRouterContext) : null;
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(() => {
        if (typeof window === 'undefined' || isSetup.current)
            return;
        isSetup.current = true;
        // If AppRouterContext doesn't exist (old Next.js), skip
        if (!AppRouterContext) {
            (0, debug_1.debug)('AppRouterContext not available, skipping link interceptor');
            return;
        }
        // Only use link interceptor if we're in App Router mode
        // In Pages Router, the router context interception works fine
        if (!appRouter) {
            (0, debug_1.debug)('Not in App Router context, skipping link interceptor');
            return;
        }
        // Dynamically check if we need the interceptor
        // This is done by testing if our router.push interceptor is working
        if (needsInterceptor.current === null) {
            // Set a flag on our intercepted router to detect if it's being used
            if (appRouter && typeof appRouter.push === 'function') {
                appRouter._guardIntercepted = true;
            }
            // After a short delay, check if clicking links uses our intercepted router
            setTimeout(() => {
                needsInterceptor.current = true; // Default to true for Next.js 15.3+
                (0, debug_1.debug)('Link click interceptor enabled for Next.js 15.3+ compatibility');
            }, 100);
        }
        if (needsInterceptor.current === false) {
            (0, debug_1.debug)('Link click interceptor not needed');
            return;
        }
        (0, debug_1.debug)('Setting up link click interceptor');
        // Function to handle link clicks
        const handleLinkClick = async (e) => {
            var _a;
            const target = e.target;
            const link = target.closest('a[href]');
            if (!link)
                return;
            // Skip if already being processed
            if (link.dataset.guardProcessing === 'true')
                return;
            const href = link.getAttribute('href');
            if (!href)
                return;
            // Skip external links
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
                return;
            }
            // Skip hash links
            if (href.startsWith('#'))
                return;
            // Skip if it has a target attribute (opens in new window/tab)
            if (link.target && link.target !== '_self')
                return;
            // Skip if it's a download link
            if (link.hasAttribute('download'))
                return;
            // Check if modifier keys are pressed (Ctrl, Cmd, Shift, Alt)
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
                return;
            // Check if it's a middle click (open in new tab)
            if (e.button !== 0)
                return;
            (0, debug_1.debug)(`Intercepted link click to: ${href}`);
            // Mark as processing to prevent double-handling
            link.dataset.guardProcessing = 'true';
            // Get navigation type (default to push)
            const navigateType = link.dataset.replace === 'true' ? 'replace' : 'push';
            // Check guards
            const defs = [...guardMapRef.current.values()];
            const enabledGuards = defs.filter(({ enabled }) => enabled({ to: href, type: navigateType }));
            if (enabledGuards.length === 0) {
                // No guards enabled, allow navigation
                delete link.dataset.guardProcessing;
                (0, debug_1.debug)('No guards enabled, allowing navigation');
                return;
            }
            // We have guards to check - prevent default immediately for async handling
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
                    (0, debug_1.debug)('Guard callback error:', error);
                    shouldNavigate = false;
                    break;
                }
            }
            // Clean up processing flag
            delete link.dataset.guardProcessing;
            if (shouldNavigate) {
                (0, debug_1.debug)('All guards passed, navigating programmatically');
                // Navigate programmatically since we prevented the default
                const router = (_a = window.next) === null || _a === void 0 ? void 0 : _a.router;
                if (router) {
                    if (navigateType === 'replace') {
                        router.replace(href);
                    }
                    else {
                        router.push(href);
                    }
                }
                else {
                    // Fallback to location navigation
                    if (navigateType === 'replace') {
                        location.replace(href);
                    }
                    else {
                        location.href = href;
                    }
                }
            }
            else {
                (0, debug_1.debug)('Navigation blocked by guard');
            }
        };
        // Add event listener in capture phase to intercept before React
        document.addEventListener('click', handleLinkClick, true);
        // Also observe DOM changes to handle dynamically added links
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        // Check if the added element is a link or contains links
                        if (element.tagName === 'A' || element.querySelector('a')) {
                            (0, debug_1.debug)('New link(s) detected in DOM');
                        }
                    }
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        return () => {
            (0, debug_1.debug)('Cleaning up link click interceptor');
            document.removeEventListener('click', handleLinkClick, true);
            observer.disconnect();
        };
    }, [guardMapRef]);
}
