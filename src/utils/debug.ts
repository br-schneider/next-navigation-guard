export const DEBUG = typeof process !== 'undefined' && process.env.DEBUG_NAVIGATION_GUARD === 'true';

export const debug = (...args: any[]) => {
  if (DEBUG) {
    console.log("[next-nav-guard]", ...args);
  }
};
