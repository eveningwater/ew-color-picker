import { off, on } from "./dom";

// 计算指针相对起点的进度（0~1），invert 为 true 时反向
export const getRatio = (
  current: number,
  start: number,
  size: number,
  invert = false
): number => {
  const ratio = size > 0 ? (current - start) / size : 0;
  const clamped = Math.max(0, Math.min(1, ratio));
  return invert ? 1 - clamped : clamped;
};

// 在 document 上绑定 mousemove/mouseup，返回解绑函数
export const bindMouseDrag = (
  move: (event: MouseEvent) => void,
  end?: () => void
): (() => void) => {
  const handleMove = (event: Event) => move(event as MouseEvent);
  const handleUp = () => {
    off(document, "mousemove", handleMove);
    off(document, "mouseup", handleUp);
    end?.();
  };
  on(document, "mousemove", handleMove);
  on(document, "mouseup", handleUp);
  return handleUp;
};

// 在 document 上绑定 touchmove/touchend，返回解绑函数
export const bindTouchDrag = (
  move: (event: TouchEvent) => void,
  end?: () => void
): (() => void) => {
  const handleMove = (event: Event) => move(event as TouchEvent);
  const handleEnd = () => {
    off(document, "touchmove", handleMove);
    off(document, "touchend", handleEnd);
    end?.();
  };
  on(document, "touchmove", handleMove, { passive: false });
  on(document, "touchend", handleEnd);
  return handleEnd;
};
