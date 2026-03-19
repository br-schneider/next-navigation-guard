"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterceptPopState = useInterceptPopState;
const debug_1 = require("../utils/debug");
const historyAugmentation_1 = require("../utils/historyAugmentation");
const useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
// Based on https://github.com/vercel/next.js/discussions/47020#discussioncomment-7826121
const renderedStateRef = {
    current: { index: -1, token: "" },
};
function useInterceptPopState({ guardMapRef, }) {
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(() => {
        // NOTE: Called before Next.js router setup which is useEffect().
        const { writeState } = (0, historyAugmentation_1.setupHistoryAugmentationOnce)({ renderedStateRef });
        const handlePopState = createHandlePopState(guardMapRef, writeState);
        const onPopState = (event) => {
            if (!handlePopState(event.state)) {
                event.stopImmediatePropagation();
            }
        };
        // NOTE: Called before Next.js router setup which is useEffect().
        // NOTE: capture on popstate listener is not working on Chrome.
        window.addEventListener("popstate", onPopState);
        return () => {
            window.removeEventListener("popstate", onPopState);
        };
    }, []);
}
function createHandlePopState(guardMapRef, writeState) {
    let dispatchedState;
    return (nextState = {}) => {
        const token = nextState === null || nextState === void 0 ? void 0 : nextState.__next_navigation_guard_token;
        const nextIndex = Number(nextState === null || nextState === void 0 ? void 0 : nextState.__next_navigation_guard_stack_index) || 0;
        if (!token || token !== renderedStateRef.current.token) {
            if (debug_1.DEBUG)
                console.log(`useInterceptPopState(): token mismatch, skip handling (current: ${renderedStateRef.current.token}, next: ${token})`);
            renderedStateRef.current.token = token || (0, historyAugmentation_1.newToken)();
            renderedStateRef.current.index = token ? nextIndex : 0;
            writeState();
            return true;
        }
        const delta = nextIndex - renderedStateRef.current.index;
        // When go(-delta) is called, delta should be zero.
        if (delta === 0) {
            if (debug_1.DEBUG)
                console.log(`useInterceptPopState(): discard popstate event: delta is 0`);
            return false;
        }
        if (debug_1.DEBUG)
            console.log(`useInterceptPopState(): __next_navigation_guard_stack_index is ${nextState.__next_navigation_guard_stack_index}`);
        const to = location.pathname + location.search;
        const defs = [...guardMapRef.current.values()];
        if (nextState === dispatchedState || defs.length === 0) {
            if (debug_1.DEBUG)
                console.log(`useInterceptPopState(): Accept popstate event, index: ${nextIndex}`);
            dispatchedState = null;
            renderedStateRef.current.index = nextIndex;
            return true;
        }
        if (debug_1.DEBUG)
            console.log(`useInterceptPopState(): Suspend popstate event, index: ${nextIndex}`);
        // Wait for all callbacks to be resolved
        (async () => {
            let i = -1;
            for (const def of defs) {
                i++;
                if (!def.enabled({ to, type: "popstate" }))
                    continue;
                if (debug_1.DEBUG) {
                    console.log(`useInterceptPopState(): confirmation for listener index ${i}`);
                }
                const confirm = await def.callback({ to, type: "popstate" });
                if (!confirm) {
                    if (debug_1.DEBUG) {
                        console.log(`useInterceptPopState(): Cancel popstate event, go(): ${renderedStateRef.current.index} - ${nextIndex} = ${-delta}`);
                    }
                    if (delta !== 0) {
                        window.history.go(-delta);
                    }
                    return;
                }
            }
            if (debug_1.DEBUG) {
                console.log(`useInterceptPopState(): Accept popstate event, ${nextIndex}`);
            }
            // accept
            dispatchedState = nextState;
            window.dispatchEvent(new PopStateEvent("popstate", { state: nextState }));
        })();
        // Return false to call stopImmediatePropagation()
        return false;
    };
}
