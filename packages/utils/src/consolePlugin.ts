import type ewColorPicker from "@ew-color-picker/core";
import type { ewColorPickerMergeOptionsData } from "@ew-color-picker/core";
import { extend, isFunction } from "./base";
import { log } from "./assert";

// 版本号由构建脚本从 package.json 注入，避免源码手写导致不同步
declare const __EW_VERSION__: string;
const version = typeof __EW_VERSION__ === "string" ? __EW_VERSION__ : "0.0.0";

export const tips = [
  `%c ew-color-picker@${version}%c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `,
  "background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
  "background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
  "background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
  "background:transparent",
];

// 同一页面内只输出一次版本信息，避免多实例重复打印
let hasPrintedTips = false;

export default class ewColorPickerConsolePlugin {
  static pluginName = "ewColorPickerConsole";
  options: ewColorPickerConsolePluginOptions &
    Omit<ewColorPickerMergeOptionsData, "el"> = {};
  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();
    this.run();
  }
  handleOptions() {
    if (this.ewColorPicker && this.ewColorPicker.options) {
    this.options = extend(this.options, this.ewColorPicker.options);
    }
  }
  run() {
    if (hasPrintedTips) return;
    hasPrintedTips = true;
    log(...tips);
  }
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions();

    // 注册事件监听器
    if (core.on && isFunction(core.on)) {
      core.on('change', (color: string) => {
        // 控制台插件可以在这里处理颜色变化事件
      });
    }

    this.run?.();
  }
}

export type ewColorPickerConsolePluginOptions = {};

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerConsolePlugin?: ewColorPickerConsolePluginOptions;
  }
}
