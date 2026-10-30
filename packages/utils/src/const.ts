import { isMobile } from "./env";

export const _toString = Object.prototype.toString;
export const _arrSlice = Array.prototype.slice;
export const _hasOwn = Object.prototype.hasOwnProperty;
export const eventType = isMobile ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];