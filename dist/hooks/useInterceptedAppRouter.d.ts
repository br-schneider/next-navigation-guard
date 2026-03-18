import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MutableRefObject } from "react";
import { GuardDef } from "../types";
export declare function useInterceptedAppRouter({ guardMapRef, }: {
    guardMapRef: MutableRefObject<Map<string, GuardDef>>;
}): AppRouterInstance | null;
//# sourceMappingURL=useInterceptedAppRouter.d.ts.map