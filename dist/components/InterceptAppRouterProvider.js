"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptAppRouterProvider = InterceptAppRouterProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const useInterceptedAppRouter_1 = require("../hooks/useInterceptedAppRouter");
const nextInternals_1 = require("../utils/nextInternals");
let warnedMissingContext = false;
function InterceptAppRouterProvider({ guardMapRef, children, }) {
    const interceptedRouter = (0, useInterceptedAppRouter_1.useInterceptedAppRouter)({ guardMapRef });
    if (!nextInternals_1.AppRouterContext) {
        if (process.env.NODE_ENV === "development" && !warnedMissingContext) {
            warnedMissingContext = true;
            console.warn("[next-nav-guard] Could not access Next.js router context. " +
                "Router interception (push/replace) will not work. " +
                "Link click and browser navigation guards still function. " +
                "This may happen if your Next.js version changed internal APIs — please update next-nav-guard.");
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    if (!interceptedRouter) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return ((0, jsx_runtime_1.jsx)(nextInternals_1.AppRouterContext.Provider, { value: interceptedRouter, children: children }));
}
