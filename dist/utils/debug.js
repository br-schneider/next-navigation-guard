"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = exports.DEBUG = void 0;
exports.DEBUG = typeof process !== 'undefined' && process.env.DEBUG_NAVIGATION_GUARD === 'true';
const debug = (...args) => {
    if (exports.DEBUG) {
        console.log("[next-navigation-guard]", ...args);
    }
};
exports.debug = debug;
