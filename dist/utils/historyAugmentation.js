"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newToken = newToken;
exports.setupHistoryAugmentationOnce = setupHistoryAugmentationOnce;
const debug_1 = require("./debug");
let setupDone = false;
let writeState = () => { };
function newToken() {
    return Math.random().toString(36).substring(2);
}
// Next.js also modifies history.pushState and history.replaceState in useEffect.
// And it's order seems to be not guaranteed.
// So we setup only once before Next.js does.
function setupHistoryAugmentationOnce({ renderedStateRef, }) {
    var _a;
    if (setupDone)
        return { writeState };
    if (debug_1.DEBUG)
        console.log("setupHistoryAugmentationOnce: setup");
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    if (debug_1.DEBUG) {
        window.__next_navigation_guard_debug_history_aug = {
            originalPushState,
            originalReplaceState,
        };
    }
    renderedStateRef.current.index =
        parseInt(window.history.state.__next_navigation_guard_stack_index) || 0;
    renderedStateRef.current.token =
        String((_a = window.history.state.__next_navigation_guard_token) !== null && _a !== void 0 ? _a : "") ||
            newToken();
    if (debug_1.DEBUG)
        console.log(`setupHistoryAugmentationOnce: initial currentIndex is ${renderedStateRef.current.index}, token is ${renderedStateRef.current.token}`);
    writeState = () => {
        if (debug_1.DEBUG)
            console.log(`setupHistoryAugmentationOnce: write state by replaceState(): currentIndex is ${renderedStateRef.current.index}, token is ${renderedStateRef.current.token}`);
        const modifiedState = {
            ...window.history.state,
            __next_navigation_guard_token: renderedStateRef.current.token,
            __next_navigation_guard_stack_index: renderedStateRef.current.index,
        };
        originalReplaceState.call(window.history, modifiedState, "", window.location.href);
    };
    if (window.history.state.__next_navigation_guard_stack_index == null ||
        window.history.state.__next_navigation_guard_token == null) {
        writeState();
    }
    window.history.pushState = function (state, unused, url) {
        // If current state is not managed by this library, reset the state.
        if (!renderedStateRef.current.token) {
            renderedStateRef.current.token = newToken();
            renderedStateRef.current.index = -1;
        }
        ++renderedStateRef.current.index;
        if (debug_1.DEBUG)
            console.log(`setupHistoryAugmentationOnce: push: currentIndex is ${renderedStateRef.current.index}, token is ${renderedStateRef.current.token}`);
        const modifiedState = {
            ...state,
            __next_navigation_guard_token: renderedStateRef.current.token,
            __next_navigation_guard_stack_index: renderedStateRef.current.index,
        };
        originalPushState.call(this, modifiedState, unused, url);
    };
    window.history.replaceState = function (state, unused, url) {
        // If current state is not managed by this library, reset the state.
        if (!renderedStateRef.current.token) {
            renderedStateRef.current.token = newToken();
            renderedStateRef.current.index = 0;
        }
        if (debug_1.DEBUG)
            console.log(`setupHistoryAugmentationOnce: replace: currentIndex is ${renderedStateRef.current.index}, token is ${renderedStateRef.current.token}`);
        const modifiedState = {
            ...state,
            __next_navigation_guard_token: renderedStateRef.current.token,
            __next_navigation_guard_stack_index: renderedStateRef.current.index,
        };
        originalReplaceState.call(this, modifiedState, unused, url);
    };
    setupDone = true;
    return { writeState };
}
