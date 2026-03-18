"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptAppRouterProvider = InterceptAppRouterProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const app_router_context_shared_runtime_1 = require("next/dist/shared/lib/app-router-context.shared-runtime");
const useInterceptedAppRouter_1 = require("../hooks/useInterceptedAppRouter");
function InterceptAppRouterProvider({ guardMapRef, children, }) {
    const interceptedRouter = (0, useInterceptedAppRouter_1.useInterceptedAppRouter)({ guardMapRef });
    if (!interceptedRouter) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return ((0, jsx_runtime_1.jsx)(app_router_context_shared_runtime_1.AppRouterContext.Provider, { value: interceptedRouter, children: children }));
}
