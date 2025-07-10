#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始 Cloudflare Pages 构建优化...');

// 清理可能导致问题的缓存目录
const cleanupDirs = [
  '.next/cache',
  '.next/static/webpack',
  'node_modules/.cache',
  'cache'
];

cleanupDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🧹 清理目录: ${dir}`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } catch (error) {
      console.warn(`⚠️  清理 ${dir} 时出现警告:`, error.message);
    }
  }
});

// 设置环境变量以优化构建
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

console.log('📦 开始 Next.js 构建...');

try {
  // 执行构建
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ 构建完成！');

  // 检查输出目录大小
  const outputDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(outputDir)) {
    const stats = getDirectorySize(outputDir);
    console.log(`📊 输出目录大小: ${(stats / 1024 / 1024).toFixed(2)} MB`);
    
    // 检查是否有超大文件
    const largeFiles = findLargeFiles(outputDir, 25 * 1024 * 1024); // 25MB
    if (largeFiles.length > 0) {
      console.warn('⚠️  发现超大文件:');
      largeFiles.forEach(file => {
        console.warn(`   ${file.path}: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      });
    }
  }

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 辅助函数：计算目录大小
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const items = fs.readdirSync(itemPath);
      items.forEach(item => {
        calculateSize(path.join(itemPath, item));
      });
    }
  }
  
  try {
    calculateSize(dirPath);
  } catch (error) {
    console.warn('计算目录大小时出错:', error.message);
  }
  
  return totalSize;
}

// 辅助函数：查找大文件
function findLargeFiles(dirPath, sizeLimit) {
  const largeFiles = [];
  
  function searchFiles(itemPath) {
    try {
      const stats = fs.statSync(itemPath);
      if (stats.isFile() && stats.size > sizeLimit) {
        largeFiles.push({
          path: path.relative(process.cwd(), itemPath),
          size: stats.size
        });
      } else if (stats.isDirectory()) {
        const items = fs.readdirSync(itemPath);
        items.forEach(item => {
          searchFiles(path.join(itemPath, item));
        });
      }
    } catch (error) {
      // 忽略权限错误等
    }
  }
  
  searchFiles(dirPath);
  return largeFiles;
} 