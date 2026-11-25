# ew-color-picker

ew-color-picker v2 的聚合入口包，兼容 v1 的包名。

```bash
npm i ew-color-picker
```

内部等价于安装 `@ew-color-picker/ew-color-picker` 与 `@ew-color-picker/style`。

```ts
import ewColorPicker from "ew-color-picker"
import "@ew-color-picker/style/dist/index.css"
import "@ew-color-picker/style/dist/input-number.css"
```

## UMD 全量引入

包内提供 UMD 全量包，已内置全部插件，可直接通过 script 标签或 CDN 引入：

```html
<link rel="stylesheet" href="https://unpkg.com/@ew-color-picker/style/dist/index.css" />
<script src="https://unpkg.com/ew-color-picker/dist/index.min.js"></script>
<script>
  const picker = new ewColorPicker({
    el: "#app",
    defaultColor: "#4096efff",
  });
</script>
```

也可以从 `node_modules/ew-color-picker/dist/index.min.js` 直接引用本地文件。

文档：https://eveningwater.github.io/ew-color-picker/
