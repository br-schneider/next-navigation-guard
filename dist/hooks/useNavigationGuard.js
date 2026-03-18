"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigationGuard = useNavigationGuard;
const react_1 = require("react");
const NavigationGuardProviderContext_1 = require("../components/NavigationGuardProviderContext");
const useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
const debug_1 = require("../utils/debug");
// Should memoize callback func
function useNavigationGuard(options) {
    const callbackId = (0, react_1.useId)();
    const guardMapRef = (0, react_1.useContext)(NavigationGuardProviderContext_1.NavigationGuardProviderContext);
    if (!guardMapRef && !options.disableForTesting)
        throw new Error("useNavigationGuard must be used within a NavigationGuardProvider");
    const [pendingState, setPendingState] = (0, react_1.useState)(null);
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(() => {
        if (options.disableForTesting)
            return;
        const callback = (params) => {
            (0, debug_1.debug)(`Guard callback called with:`, params);
            if (options.confirm) {
                (0, debug_1.debug)(`Using sync confirm function`);
                return options.confirm(params);
            }
            (0, debug_1.debug)(`Using async confirm, setting pending state`);
            return new Promise((resolve) => {
                // Small delay to ensure state update propagates
                setTimeout(() => {
                    setPendingState({ resolve });
                }, 0);
            });
        };
        const enabled = options.enabled;
        guardMapRef.current.set(callbackId, {
            enabled: typeof enabled === "function" ? enabled : () => enabled !== null && enabled !== void 0 ? enabled : true,
            callback,
        });
        return () => {
            guardMapRef.current.delete(callbackId);
        };
    }, [callbackId, guardMapRef, options.confirm, options.enabled, options.disableForTesting]);
    const active = options.disableForTesting ? false : pendingState !== null;
    const accept = (0, react_1.useCallback)(() => {
        if (!pendingState)
            return;
        pendingState.resolve(true);
        setPendingState(null);
    }, [pendingState]);
    const reject = (0, react_1.useCallback)(() => {
        if (!pendingState)
            return;
        pendingState.resolve(false);
        setPendingState(null);
    }, [pendingState]);
    return { active, accept, reject };
}
