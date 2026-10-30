// 将已构建的 UMD 产物复制到文档站点的静态资源目录，供在线演示页使用。
// 文档构建前请先执行根目录的 `pnpm run build:all`。
import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoDir = resolve(docsDir, '..')
const assetsDir = resolve(docsDir, 'public/assets')

const assets = [
  {
    from: resolve(repoDir, 'packages/ew-color-picker/dist/index.min.js'),
    to: resolve(assetsDir, 'ew-color-picker.js'),
  },
  {
    from: resolve(repoDir, 'packages/style/dist/index.css'),
    to: resolve(assetsDir, 'index.css'),
  },
  {
    from: resolve(repoDir, 'packages/style/dist/input-number.css'),
    to: resolve(assetsDir, 'input-number.css'),
  },
]

await mkdir(assetsDir, { recursive: true })

let missing = 0
for (const asset of assets) {
  if (!existsSync(asset.from)) {
    console.warn(`[docs] 缺少构建产物：${asset.from}，请先运行 pnpm run build:all`)
    missing++
    continue
  }
  await copyFile(asset.from, asset.to)
}

if (missing === 0) {
  console.log('[docs] 在线演示资源已就绪')
}
