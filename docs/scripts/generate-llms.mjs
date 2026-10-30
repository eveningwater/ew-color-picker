/**
 * 生成 AI 友好的文档索引：
 * - public/llms.txt      站点大纲 + 链接
 * - public/llms-full.txt 全部文档正文拼接
 *
 * 参考 https://llmstxt.org/ 的约定。
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DOCS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = join(DOCS_DIR, 'public')
const SITE = process.env.DOCS_SITE || 'https://eveningwater.github.io/ew-color-picker/'
const CLEAN = process.env.DOCS_CLEAN_URLS !== 'false'

const EXCLUDED_DIRS = new Set(['.vitepress', 'node_modules', 'public', 'scripts'])

async function collect(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue
      await collect(join(dir, entry.name), acc)
    } else if (entry.name.endsWith('.md')) {
      acc.push(join(dir, entry.name))
    }
  }
  return acc
}

function stripFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '')
}

function readMeta(content, fallbackTitle) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  const frontmatter = match ? match[1] : ''
  const title = frontmatter.match(/title:\s*(.+)/)?.[1]?.trim() || fallbackTitle
  const description = frontmatter.match(/description:\s*(.+)/)?.[1]?.trim() || ''
  return {
    title: title.replace(/^['"]|['"]$/g, ''),
    description: description.replace(/^['"]|['"]$/g, ''),
  }
}

function toUrl(relPath) {
  const normalized = relPath.split('\\').join('/')
  const withoutExt = normalized.replace(/\.md$/, '')
  const cleaned = withoutExt.replace(/(^|\/)index$/, '$1')
  const suffix = !CLEAN && cleaned && !cleaned.endsWith('/') ? '.html' : ''
  return `${SITE}${cleaned}${suffix}`.replace(/\/{2,}/g, '/').replace('https:/', 'https://')
}

const SECTIONS = [
  { title: '中文文档', match: (rel) => !rel.startsWith('en/') },
  { title: 'English Docs', match: (rel) => rel.startsWith('en/') },
]

const files = (await collect(DOCS_DIR)).sort()

let full = '# ew-color-picker 完整文档 / Full Documentation\n\n'
full += `> 事件驱动 + 插件化的现代颜色选择器。Event-driven, plugin-based color picker.\n\n`
full += `> 站点 / Site: ${SITE}\n\n`

let index = `# ew-color-picker\n\n`
index += `> 事件驱动 + 插件化的现代颜色选择器，支持 Hex / RGB / HSL、透明度、中英文文档。\n\n`
index += `Event-driven, plugin-based color picker with Hex / RGB / HSL support, alpha channel, and full plugin architecture.\n\n`
index += `- 官网 / Website: ${SITE}\n`
index += `- 仓库 / Repository: https://github.com/eveningwater/ew-color-picker\n`
index += `- npm: https://www.npmjs.com/package/@ew-color-picker/ew-color-picker\n\n`

for (const section of SECTIONS) {
  const list = files.filter((file) => section.match(relative(DOCS_DIR, file).split('\\').join('/')))
  if (!list.length) continue

  index += `## ${section.title}\n\n`
  full += `\n---\n\n# ${section.title}\n\n`

  for (const file of list) {
    const rel = relative(DOCS_DIR, file).split('\\').join('/')
    const raw = await readFile(file, 'utf-8')
    const { title, description } = readMeta(raw, rel.replace(/\.md$/, ''))
    const url = toUrl(rel)
    const body = stripFrontmatter(raw).trim()

    index += `- [${title}](${url})${description ? `: ${description}` : ''}\n`
    full += `\n## ${title}\n\nSource: ${url}\n\n${body}\n`
  }

  index += '\n'
}

await mkdir(PUBLIC_DIR, { recursive: true })
await writeFile(join(PUBLIC_DIR, 'llms.txt'), index, 'utf-8')
await writeFile(join(PUBLIC_DIR, 'llms-full.txt'), full, 'utf-8')

console.log(
  `[docs] llms.txt (${index.length} chars) and llms-full.txt (${full.length} chars) generated for ${files.length} pages`
)
