"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterceptPageUnload = useInterceptPageUnload;
const useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
function useInterceptPageUnload({ guardMapRef, }) {
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(() => {
        const handleBeforeUnload = (event) => {
            for (const def of guardMapRef.current.values()) {
                // We does not support confirm() on beforeunload as
                // we cannot wait for async Promise resolution on beforeunload.
                const enabled = def.enabled({ to: "", type: "beforeunload" });
                if (enabled) {
                    event.preventDefault();
                    // As MDN says, custom message has already been unsupported in majority of browsers.
                    // Chrome requires returnValue to be set.
                    event.returnValue = "";
                    return;
                }
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
}
