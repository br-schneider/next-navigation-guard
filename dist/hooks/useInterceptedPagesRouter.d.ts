import { NextRouter } from "next/dist/client/router";
import { MutableRefObject } from "react";
import { GuardDef } from "../types";
export declare function useInterceptedPagesRouter({ guardMapRef, }: {
    guardMapRef: MutableRefObject<Map<string, GuardDef>>;
}): NextRouter | null;
//# sourceMappingURL=useInterceptedPagesRouter.d.ts.map