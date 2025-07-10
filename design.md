# Rich Temple - 财神庙 Web3 祈福项目设计文档

## 项目概述
- **项目名称**: Rich Temple (财神庙)
- **项目类型**: Web3 祈福上香平台
- **主要功能**: 许愿、算命、上香支付、功德记录
- **目标用户**: Web3用户，传统文化爱好者

## 技术架构

### 前端技术栈
- **框架**: Next.js (React)
- **样式**: Tailwind CSS
- **字体**: 楷体 (KaiTi) - 正文和按钮
- **响应式**: 移动端自适应设计

### 后端技术栈
- **AI模型**: DeepSeek API
- **Web3钱包**: RainbowKit
- **支付币种**: ETH, USDT
- **服务文件**: deepseekService.js

### 项目结构
```
rich-temple/
├── pages/
│   ├── index.js (初始动画页面)
│   ├── wish.js (许愿页面)
│   ├── calculate.js (算命页面)
│   ├── result.js (结果页面)
│   ├── merit.js (功德页面)
│   └── store.js (商城页面)
├── components/
│   ├── FloatingSidebar.js
│   ├── WalletConnect.js
│   └── PaymentForm.js
├── services/
│   └── deepseekService.js
├── public/
│   ├── videos/
│   │   ├── 1.mp4 (初始动画)
│   │   ├── 2.mp4 (算命加载)
│   │   └── 3.mp4 (上香动画)
│   └── assets/
└── styles/
    └── globals.css
```

## 页面流程设计

### 1. 初始动画页面 (/)
- **功能**: 播放1.mp4进场动画(3秒)
- **交互**: 
  - 动画结束后显示涟漪悬停效果
  - "下一步"按钮进入许愿页面
- **路由**: `/` → `/wish`

### 2. 许愿页面 (/wish)
- **功能**: 用户输入许愿内容
- **布局**:
  - 右上角: "连接钱包"按钮
  - 中央: 文本输入框
  - 底部: "下一步"按钮
- **路由**: `/wish` → `/calculate`

### 3. 算命页面 (/calculate)
- **功能**: 小六壬神算
- **布局**:
  - 顶部: 显示用户愿望文本
  - 中部: 输入3个1-99的数字
  - 按钮: "开始算命", "修改愿望"
- **逻辑**: 调用DeepSeek API
- **路由**: 
  - `/calculate` → `/result` (开始算命)
  - `/calculate` → `/wish` (修改愿望)

### 4. 算命加载页面
- **功能**: 显示2.mp4加载动画(3秒)
- **后端**: 计算DeepSeek模型使用时长
- **路由**: 自动跳转到 `/result`

### 5. 结果页面 (/result)
- **功能**: 显示算命结果和支付界面
- **布局**:
  - 顶部: "六神已定，虔诚上香，神明护佑"
  - 中部: DeepSeek返回的算命结果
  - 底部: 香火支付表单 (数量 + 币种选择: ETH/USDT)
- **按钮**: "立即支付"
- **路由**: `/result` → 支付验证 → `/merit`

### 6. 上香动画页面
- **功能**: 播放3.mp4上香动画
- **后端**: 验证支付状态
- **路由**: 支付成功后跳转到 `/merit`

### 7. 功德页面 (/merit)
- **布局**: 左侧导航栏(1/5) + 右侧内容(4/5)
- **左侧导航栏** (FloatingSidebar组件):
  - 祈愿上香
  - 每日运势
  - 法物流通
  - 联系我们
- **右侧内容**:
  - 默认: "上香成功；您的愿望已传达至神明"
  - 按钮: "分享至Twitter", "再次祈愿上香"

### 8. 商城页面 (/store)
- **功能**: 法物流通商城
- **布局**: 带隐藏式FloatingSidebar的商品展示页面
- **商品类型**: 实体/虚拟物品

## 组件设计

### FloatingSidebar 组件
- **显示逻辑**: 
  - Merit页面: 默认显示
  - 其他页面: 默认隐藏，鼠标移至左侧显示
- **导航项目**:
  - 祈愿上香 → `/wish`
  - 每日运势 → 农历运势显示
  - 法物流通 → 商品概览 → `/store`
  - 联系我们 → 联系信息显示

### WalletConnect 组件
- **功能**: 使用RainbowKit连接Web3钱包
- **位置**: 右上角固定位置
- **支持钱包**: MetaMask, WalletConnect等

### PaymentForm 组件
- **功能**: 香火支付表单
- **字段**: 数量输入, 币种选择(ETH/USDT)
- **验证**: 支付状态验证

## 样式设计

### 设计风格
- **主题**: 新中式美学 (参考test.html)
- **颜色方案**:
  - 背景: 宣纸色 (#F2DEB0)
  - 文字: 墨色 (#2C2C2C)
  - 按钮: 渐变墨色效果
- **字体**: 楷体 (KaiTi) 为主
- **特效**: 水墨渐变、涟漪效果

### 响应式设计
- **移动端优先**: 
- **断点设置**: 
  - 手机: < 768px
  - 平板: 768px - 1024px  
  - 桌面: > 1024px
- **布局适配**: Flexbox + Grid布局

## API接口设计

### DeepSeek服务 (deepseekService.js)
```javascript
// 输入参数
{
  wish: "用户愿望",
  numbers: [num1, num2, num3] // 1-99的数字
}

// 输出结果
{
  prediction: "算命结果",
  advice: "建议",
  luck: "运势评分"
}
```

### 支付验证接口
```javascript
// 支付参数
{
  amount: "香火数量",
  currency: "ETH/USDT",
  walletAddress: "钱包地址"
}

// 验证结果
{
  success: boolean,
  transactionHash: "交易哈希",
  timestamp: "支付时间"
}
```

## 路由配置

### 页面路由
- `/` - 初始动画页面
- `/wish` - 许愿页面
- `/calculate` - 算命页面
- `/result` - 结果页面
- `/merit` - 功德页面
- `/store` - 商城页面

### 导航逻辑
- 线性流程: `/` → `/wish` → `/calculate` → `/result` → `/merit`
- 循环功能: Merit页面可返回任意页面
- 侧边栏: 在Merit和Store页面可用

## 开发计划

### 第一阶段: 基础框架
1. 创建Next.js项目
2. 配置Tailwind CSS和楷体字体
3. 创建基础页面结构
4. 实现页面路由

### 第二阶段: 核心功能
1. 视频播放和动画效果
2. 表单输入和验证
3. DeepSeek API集成
4. 基础样式实现

### 第三阶段: Web3集成
1. RainbowKit钱包连接
2. 支付功能实现
3. 交易验证逻辑
4. 用户状态管理

### 第四阶段: 优化完善
1. 移动端适配优化
2. 性能优化
3. 错误处理
4. 用户体验优化

## 注意事项

1. **Web3集成**: 需要处理钱包连接、网络切换、交易确认等Web3特有逻辑
2. **移动端适配**: 重点关注触屏交互和小屏幕布局
3. **视频优化**: 确保视频在移动端的加载和播放性能
4. **错误处理**: 网络错误、支付失败、API调用失败等场景
5. **用户体验**: 加载状态、进度提示、操作反馈等

## 文件清单

### 必需文件
- `.gitignore` - Git忽略文件
- `package.json` - 项目依赖
- `next.config.js` - Next.js配置
- `tailwind.config.js` - Tailwind配置
- `README.md` - 项目说明

### 媒体文件
- `public/videos/1.mp4` - 初始动画
- `public/videos/2.mp4` - 算命加载
- `public/videos/3.mp4` - 上香动画

这个设计文档涵盖了您提到的所有功能需求。您觉得有什么需要调整或补充的地方吗？ 