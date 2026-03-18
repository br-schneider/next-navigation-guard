"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterceptedPagesRouter = useInterceptedPagesRouter;
const router_context_shared_runtime_1 = require("next/dist/shared/lib/router-context.shared-runtime");
const react_1 = require("react");
function useInterceptedPagesRouter({ guardMapRef, }) {
    const origRouter = (0, react_1.useContext)(router_context_shared_runtime_1.RouterContext);
    return (0, react_1.useMemo)(() => {
        if (!origRouter)
            return null;
        const guarded = async (type, toUrl, accepted) => {
            var _a;
            const to = typeof toUrl === "string" ? toUrl : (_a = toUrl.href) !== null && _a !== void 0 ? _a : "";
            const defs = [...guardMapRef.current.values()];
            for (const { enabled, callback } of defs) {
                if (!enabled({ to, type }))
                    continue;
                const confirm = await callback({ to, type });
                if (!confirm)
                    return false;
            }
            return await accepted();
        };
        return {
            ...origRouter,
            push: (href, ...args) => {
                return guarded("push", href, () => origRouter.push(href, ...args));
            },
            replace: (href, ...args) => {
                return guarded("replace", href, () => origRouter.replace(href, ...args));
            },
            reload: (...args) => {
                guarded("refresh", location.href, async () => {
                    origRouter.reload(...args); // void
                    return true;
                });
            },
        };
    }, [origRouter]);
}
