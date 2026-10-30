#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取所有包的测试文件
function getTestFiles() {
  const packagesDir = path.join(__dirname, '../packages');
  const testFiles = [];
  
  const packages = fs.readdirSync(packagesDir);
  
  packages.forEach(pkg => {
    const testDir = path.join(packagesDir, pkg, 'test');
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        if (file.endsWith('.test.ts') || file.endsWith('.test.js')) {
          testFiles.push(path.join(testDir, file));
        }
      });
    }
  });
  
  return testFiles;
}

// 运行测试
function runTests() {
  console.log('🧪 开始运行单元测试...\n');
  
  const testFiles = getTestFiles();
  
  if (testFiles.length === 0) {
    console.log('❌ 未找到测试文件');
    return;
  }
  
  console.log(`📁 找到 ${testFiles.length} 个测试文件:\n`);
  testFiles.forEach(file => {
    console.log(`  - ${path.relative(process.cwd(), file)}`);
  });
  console.log('');
  
  try {
    // 运行 Vitest
    execSync('npx vitest run', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('\n✅ 所有测试通过！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行覆盖率测试
function runCoverage() {
  console.log('📊 开始运行覆盖率测试...\n');
  
  try {
    execSync('npx vitest run --coverage', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('\n✅ 覆盖率测试完成！');
  } catch (error) {
    console.error('\n❌ 覆盖率测试失败:', error.message);
    process.exit(1);
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--coverage')) {
    runCoverage();
  } else {
    runTests();
  }
}

// 检查是否为直接运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  runTests,
  runCoverage,
  getTestFiles
}; 