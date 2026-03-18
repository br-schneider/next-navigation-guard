export interface NavigationGuardOptions {
    /** @default true */
    enabled?: boolean | ((params: NavigationGuardParams) => boolean);
    confirm?: NavigationGuardCallback;
    /**
     * When true, the hook becomes a complete no-op: no guard is registered,
     * NavigationGuardProvider context is not required, and `active` is always false.
     * Intended for test and storybook environments.
     * @default false
     */
    disableForTesting?: boolean;
}
export interface NavigationGuardParams {
    to: string;
    type: "push" | "replace" | "refresh" | "popstate" | "beforeunload";
}
/**
 * true will allow the navigation, false will prevent it.
 * When beforeunload event is fired, and returned Promise is async (not immediately resolved),
 * it will be treated as if it's resolved with false.
 */
export type NavigationGuardCallback = (params: NavigationGuardParams) => boolean | Promise<boolean>;
export interface GuardDef {
    enabled: (params: NavigationGuardParams) => boolean;
    callback: NavigationGuardCallback;
}
export interface RenderedState {
    index: number;
    token: string | null;
}
//# sourceMappingURL=types.d.ts.map