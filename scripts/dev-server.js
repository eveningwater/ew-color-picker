// scripts/dev-server.js
import { createServer } from 'vite';
import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 包依赖关系映射
const packageDependencies = {
  'utils': [],
  'core': ['utils'],
  'alpha': ['core', 'utils'],
  'hue': ['core', 'utils'],
  'panel': ['core', 'utils'],
  'input': ['core', 'utils'],
  'button': ['core', 'utils'],
  'predefine': ['core', 'utils'],
  'color-mode': ['core', 'utils'],
  'box': ['core', 'utils'],
  'input-number': ['utils'],
  'style': [],
  'ew-color-picker': ['alpha', 'hue', 'panel', 'input', 'button', 'predefine', 'color-mode', 'box', 'input-number', 'style', 'core', 'utils']
};

// 包名到 npm 包名的映射
const packageNameMap = {
  'utils': '@ew-color-picker/utils',
  'core': '@ew-color-picker/core',
  'alpha': '@ew-color-picker/alpha',
  'hue': '@ew-color-picker/hue',
  'panel': '@ew-color-picker/panel',
  'input': '@ew-color-picker/input',
  'button': '@ew-color-picker/button',
  'predefine': '@ew-color-picker/predefine',
  'color-mode': '@ew-color-picker/color-mode',
  'box': '@ew-color-picker/box',
  'input-number': '@ew-color-picker/input-number',
  'style': '@ew-color-picker/style',
  'ew-color-picker': '@ew-color-picker/ew-color-picker'
};

// 获取需要构建的包（包括依赖它的包）
function getPackagesToBuild(changedPackage) {
  const toBuild = new Set([changedPackage]);
  
  // 找出所有依赖这个包的包
  for (const [pkg, deps] of Object.entries(packageDependencies)) {
    if (deps.includes(changedPackage)) {
      toBuild.add(pkg);
      // 递归添加依赖这个包的包
      const moreDeps = getPackagesToBuild(pkg);
      moreDeps.forEach(dep => toBuild.add(dep));
    }
  }
  
  return Array.from(toBuild);
}

// 构建包的顺序（按依赖关系排序）
function sortPackagesByDependency(packages) {
  const sorted = [];
  const visited = new Set();
  
  function visit(pkg) {
    if (visited.has(pkg)) return;
    visited.add(pkg);
    
    const deps = packageDependencies[pkg] || [];
    deps.forEach(dep => {
      if (packages.includes(dep)) {
        visit(dep);
      }
    });
    
    if (packages.includes(pkg)) {
      sorted.push(pkg);
    }
  }
  
  packages.forEach(pkg => visit(pkg));
  return sorted;
}

let isBuilding = false;
let buildQueue = new Set();

async function buildPackages(packages) {
  if (isBuilding) {
    packages.forEach(pkg => buildQueue.add(pkg));
    return;
  }
  
  isBuilding = true;
  
  try {
    const sortedPackages = sortPackagesByDependency(packages);
    console.log(chalk.blue(`\n🔨 开始构建: ${sortedPackages.join(', ')}`));
    
    for (const pkg of sortedPackages) {
      const npmPkgName = packageNameMap[pkg] || pkg;
      const buildCmd = `pnpm --filter ${npmPkgName} build`;
      console.log(chalk.gray(`   构建 ${pkg}...`));
      
      try {
        await execAsync(buildCmd, { 
          cwd: path.resolve(__dirname, '..'),
          maxBuffer: 1024 * 1024 * 10 
        });
        console.log(chalk.green(`   ✓ ${pkg} 构建成功`));
      } catch (error) {
        console.error(chalk.red(`   ✗ ${pkg} 构建失败:`), error.message);
      }
    }
    
    console.log(chalk.green('✨ 构建完成！\n'));
  } finally {
    isBuilding = false;
    
    // 处理队列中的构建任务
    if (buildQueue.size > 0) {
      const queuedPackages = Array.from(buildQueue);
      buildQueue.clear();
      await buildPackages(queuedPackages);
    }
  }
}

async function startDevServer() {
  console.log(chalk.cyan('🚀 启动开发服务器...\n'));
  
  // 首次构建所有包
  console.log(chalk.blue('📦 初始构建所有包...'));
  try {
    await execAsync('pnpm build:all', { 
      cwd: path.resolve(__dirname, '..'),
      maxBuffer: 1024 * 1024 * 10 
    });
    console.log(chalk.green('✓ 初始构建完成\n'));
  } catch (error) {
    console.error(chalk.red('初始构建失败:'), error.message);
  }
  
  // 创建 Vite 服务器
  const server = await createServer({
    root: path.resolve(__dirname, '..'),
    server: {
      port: 3000,
      open: '/examples/color.html'
    },
    plugins: [
      {
        name: 'reload-on-build',
        handleHotUpdate({ server }) {
          server.ws.send({
            type: 'full-reload'
          });
        }
      }
    ]
  });
  
  await server.listen();
  
  console.log(chalk.green('✓ Vite 开发服务器已启动'));
  console.log(chalk.cyan(`\n  ➜  本地访问: http://localhost:3000/examples/color.html\n`));
  
  // 监听 packages 目录的文件变化
  const watchPath = path.resolve(__dirname, '../packages/*/src/**/*');
  console.log(chalk.gray(`📂 监听路径: ${watchPath}`));
  
  const watcher = chokidar.watch('packages/*/src/**/*', {
    ignored: /(^|[\/\\])\../, // 忽略点文件
    persistent: true,
    ignoreInitial: true,
    cwd: path.resolve(__dirname, '..'),
    usePolling: true,  // 启用轮询模式，确保在所有系统上都能可靠工作
    interval: 1000,    // 轮询间隔 1 秒
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 100
    }
  });
  
  let debounceTimer = null;
  
  watcher.on('ready', () => {
    console.log(chalk.blue('👀 文件监听器已就绪，正在监听文件变化...\n'));
  });
  
  watcher.on('all', (event, filePath) => {
    console.log(chalk.gray(`[DEBUG] 事件: ${event}, 文件: ${filePath}`));
    
    if (!['add', 'change', 'unlink'].includes(event)) return;
    
    // 提取包名
    const match = filePath.match(/^packages\/([^\/]+)\//);
    if (!match) {
      console.log(chalk.red(`[DEBUG] 无法匹配包名: ${filePath}`));
      return;
    }
    
    const packageName = match[1];
    console.log(chalk.yellow(`\n📝 检测到文件变化: ${filePath}`));
    console.log(chalk.gray(`   包名: ${packageName}`));
    
    // 防抖处理
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const packagesToBuild = getPackagesToBuild(packageName);
      await buildPackages(packagesToBuild);
      
      // 触发浏览器刷新
      server.ws.send({
        type: 'full-reload',
        path: '*'
      });
    }, 300);
  });
  
  watcher.on('error', error => {
    console.error(chalk.red('文件监听错误:'), error);
  });
  
  // 处理退出
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n\n正在关闭服务器...'));
    await watcher.close();
    await server.close();
    process.exit(0);
  });
}

startDevServer().catch(err => {
  console.error(chalk.red('启动失败:'), err);
  process.exit(1);
});
