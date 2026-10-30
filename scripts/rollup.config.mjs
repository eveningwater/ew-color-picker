// 各包通过 `rollup -c ../../scripts/rollup.config.mjs` 使用本配置
// 按当前工作目录（即包目录）识别要构建的包
import { createPackageConfigs } from './rollup.shared.mjs';

export default createPackageConfigs(process.cwd());
