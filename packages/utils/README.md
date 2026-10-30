# @ew-color-picker/utils

ew-color-picker 的公共工具库：DOM、颜色转换、动画、断言与 `EventEmitter`。

## 安装

```bash
pnpm add @ew-color-picker/utils
```

## 使用

```ts
import { EventEmitter } from '@ew-color-picker/utils'

const emitter = new EventEmitter()
emitter.on('change', (color) => console.log(color))
```

## 相关链接

- 文档：https://eveningwater.github.io/ew-color-picker/guide/concepts
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
