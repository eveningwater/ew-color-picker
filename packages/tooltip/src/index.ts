export { default } from "./tooltip";
export { default as Tooltip } from "./tooltip";
// 尺寸判断工具已下沉到 utils，这里保留导出以兼容既有用法
export { isTextTruncated } from "@ew-color-picker/utils";
export type {
  TooltipOptions,
  TooltipEffect,
  TooltipPlacement,
  TooltipTrigger,
  TooltipTriggerType,
  TooltipContent,
  TooltipEvent,
  TooltipVirtualElement,
  TooltipPopperOptions,
} from "./tooltip";
