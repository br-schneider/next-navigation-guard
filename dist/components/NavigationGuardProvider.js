"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationGuardProvider = NavigationGuardProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useInterceptPageUnload_1 = require("../hooks/useInterceptPageUnload");
const useInterceptPopState_1 = require("../hooks/useInterceptPopState");
const useInterceptLinkClicks_1 = require("../hooks/useInterceptLinkClicks");
const InterceptAppRouterProvider_1 = require("./InterceptAppRouterProvider");
const NavigationGuardProviderContext_1 = require("./NavigationGuardProviderContext");
function NavigationGuardProvider({ children, }) {
    const guardMapRef = (0, react_1.useRef)(new Map());
    (0, useInterceptPopState_1.useInterceptPopState)({ guardMapRef });
    (0, useInterceptPageUnload_1.useInterceptPageUnload)({ guardMapRef });
    (0, useInterceptLinkClicks_1.useInterceptLinkClicks)({ guardMapRef });
    return ((0, jsx_runtime_1.jsx)(NavigationGuardProviderContext_1.NavigationGuardProviderContext.Provider, { value: guardMapRef, children: (0, jsx_runtime_1.jsx)(InterceptAppRouterProvider_1.InterceptAppRouterProvider, { guardMapRef: guardMapRef, children: children }) }));
}
