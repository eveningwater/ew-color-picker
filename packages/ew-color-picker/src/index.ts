import Core from "@ew-color-picker/core";
import type { ewColorPickerConstructorOptions } from "@ew-color-picker/core";
import Box from "@ew-color-picker/box";
import Panel from "@ew-color-picker/panel";
import Hue from "@ew-color-picker/hue";
import Alpha from "@ew-color-picker/alpha";
import InputPlugin from "@ew-color-picker/input";
import { ewColorPickerInputNumberPlugin } from "@ew-color-picker/input-number";
import { ewColorPickerSelectPlugin } from "@ew-color-picker/select";
import { ewColorPickerCheckboxPlugin } from "@ew-color-picker/checkbox";
import ButtonPlugin from "@ew-color-picker/button";
import Predefine from "@ew-color-picker/predefine";
import { Console } from "@ew-color-picker/utils";
import ColorMode from "@ew-color-picker/color-mode";
import Eyedropper from "@ew-color-picker/eyedropper";
import CopyColor from "@ew-color-picker/copy-color";
import Gradient from "@ew-color-picker/gradient";

// 注册插件
Core.use(Console);
Core.use(Box);
Core.use(Panel);
Core.use(Hue);
Core.use(Alpha);
Core.use(InputPlugin);
Core.use(ewColorPickerInputNumberPlugin); // 注册 InputNumber 插件
Core.use(ewColorPickerSelectPlugin); // 注册 Select 插件
Core.use(ewColorPickerCheckboxPlugin); // 注册 Checkbox 插件
Core.use(ButtonPlugin);
Core.use(Predefine);
Core.use(ColorMode);
Core.use(Eyedropper);
Core.use(CopyColor);
Core.use(Gradient);

// 导出主构造函数
export { Core as ewColorPicker };

// 工厂函数：内部等价于 new ewColorPicker(options)
export function createEwColorPicker(
  options?: ewColorPickerConstructorOptions | string | HTMLElement
): Core {
  return new Core(options);
}

// 默认导出主构造函数
export default Core;

// 独立组件：不需要颜色选择器即可使用
export { Input } from "@ew-color-picker/input";
export type { InputComponentOptions } from "@ew-color-picker/input";
export { Button } from "@ew-color-picker/button";
export type {
  ButtonComponentOptions,
  ButtonType,
  ButtonSize,
} from "@ew-color-picker/button";
export { Checkbox } from "@ew-color-picker/checkbox";
export type { CheckboxOptions } from "@ew-color-picker/checkbox";
export { Select } from "@ew-color-picker/select";
export type { SelectOptions, SelectOption } from "@ew-color-picker/select";
export { InputNumber } from "@ew-color-picker/input-number";
export { Tooltip } from "@ew-color-picker/tooltip";
export type {
  TooltipOptions,
  TooltipPlacement,
  TooltipTrigger,
  TooltipEffect,
} from "@ew-color-picker/tooltip";

// 为UMD构建添加全局变量
declare global {
  interface Window {
    ewColorPicker: typeof Core;
  }
}
if (typeof window !== "undefined") {
  window.ewColorPicker = Core;
}
