"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterceptPagesRouterProvider = InterceptPagesRouterProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const router_context_shared_runtime_1 = require("next/dist/shared/lib/router-context.shared-runtime");
const useInterceptedPagesRouter_1 = require("../hooks/useInterceptedPagesRouter");
function InterceptPagesRouterProvider({ guardMapRef, children, }) {
    const interceptedRouter = (0, useInterceptedPagesRouter_1.useInterceptedPagesRouter)({ guardMapRef });
    if (!interceptedRouter) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    return ((0, jsx_runtime_1.jsx)(router_context_shared_runtime_1.RouterContext.Provider, { value: interceptedRouter, children: children }));
}
