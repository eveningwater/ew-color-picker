// scripts/bump-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = path.resolve(__dirname, '..');

// 解析版本号参数
const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(chalk.red('Usage: node scripts/bump-version.js <version>'));
  console.error(chalk.gray('Example: node scripts/bump-version.js 2.0.6'));
  process.exit(1);
}

const results = [];

// 1. 更新根目录 package.json
const rootPkgPath = path.join(root, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const oldRootVersion = rootPkg.version;
rootPkg.version = version;
fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
results.push({ name: 'root', old: oldRootVersion, new: version });

// 2. 更新所有 packages/*/package.json
const packagesDir = path.join(root, 'packages');
const dirs = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const dir of dirs) {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const oldVersion = pkg.version;
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  results.push({ name: pkg.name, old: oldVersion, new: version });
}

// 3. 更新 README.md
const readmePath = path.join(root, 'README.md');
if (fs.existsSync(readmePath)) {
  let content = fs.readFileSync(readmePath, 'utf8');
  const updated = content.replace(
    /Latest release: `[\d.]+`/,
    `Latest release: \`${version}\``
  );
  if (content !== updated) {
    fs.writeFileSync(readmePath, updated);
    results.push({ name: 'README.md', old: '-', new: version });
  }
}

// 4. 更新 README.zh-CN.md
const readmeZhPath = path.join(root, 'README.zh-CN.md');
if (fs.existsSync(readmeZhPath)) {
  let content = fs.readFileSync(readmeZhPath, 'utf8');
  const updated = content.replace(
    /最新版本：`[\d.]+`/,
    `最新版本：\`${version}\``
  );
  if (content !== updated) {
    fs.writeFileSync(readmeZhPath, updated);
    results.push({ name: 'README.zh-CN.md', old: '-', new: version });
  }
}

// 输出摘要
console.log(chalk.green(`\n✓ All versions bumped to ${version}\n`));
console.log(chalk.gray('Package'.padEnd(45)) + chalk.gray('Old'.padEnd(12)) + chalk.gray('New'));
console.log(chalk.gray('-'.repeat(70)));
for (const r of results) {
  console.log(
    chalk.white(r.name.padEnd(45)) +
    chalk.yellow((r.old || '-').padEnd(12)) +
    chalk.green(r.new)
  );
}
console.log(chalk.gray('-'.repeat(70)));
console.log(chalk.cyan(`\n${results.length} files updated.`));
