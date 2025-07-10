# DeepSeek API 集成方案讨论

## API 配置信息
- **API Key**: sk-b3ffcd0b8841461783dcc82759746fec
- **API URL**: https://api.deepseek.com/v1
- **模型**: deepseek-chat (推荐使用)

## 需要集成的两个功能

### 1. Result.js - 占卜结果生成

#### 功能描述
在 result.js 页面的占卜结果区域，根据用户输入的三个数字和一个愿望，调用 DeepSeek API 生成小六壬三宫五行占算结果。

#### 当前实现状态
- 页面已有占卜结果显示结构
- 使用 `deepseekService.performDivination()` 调用
- 有加载状态和错误处理
- 结果包含：卦象解析、运势预测、神明指引、运势评分

#### 需要的 Prompt 分析
用户提供的 prompt 非常详细，包含：
1. **核心角色定位**: AI术数分析师，专精三宫五行法
2. **输入格式**: 三个1-99数字 + 一个愿望
3. **计算规则**: 数字对6取余确定宫位
4. **知识库**: 六神宫位对应的五行属性和意象
5. **分析框架**: 人-事-应三宫五行生克关系
6. **输出结构**: 标准化的分析报告格式

#### 技术考虑
- API 调用可能耗时较长，需要良好的加载体验
- 需要处理 API 失败的备用方案
- 输出格式需要适配现有的 UI 结构

### 2. Merit.js - 每日运势生成

#### 功能描述
在 merit.js 页面的 fortune 部分，根据当前日期生成每日运势内容。

#### 当前实现状态
- 页面有 fortune section 切换逻辑
- 使用 `deepseekService.getDailyFortune()` 调用
- 有加载状态显示
- 结果显示在 floating-card 中

#### 需要的 Prompt 分析
用户提供的 prompt 包含：
1. **输入信息**: 当前日期、农历日期
2. **内容要求**: 基于传统民俗文化和五行理论
3. **输出内容**: 10个方面的运势分析
4. **格式要求**: 包含星级评价、具体建议等

#### 样本分析
从提供的样本可以看出需要：
- 日期信息（公历+农历）
- 星级评价系统
- 分类运势分析（财运、事业、感情、健康）
- 实用建议（宜做、忌做）
- 幸运元素（颜色、数字、方位、吉时）

## 需要讨论的技术问题

### 1. API 调用封装
**问题**: 如何在现有的 deepseekService 中最好地封装这两个功能？

**建议**:
- 创建专门的方法 `performDivination(wish, numbers)` 和 `getDailyFortune(date, lunarDate)`
- 统一错误处理和重试机制
- 添加请求缓存避免重复调用

### 2. 数据格式处理
**问题**: DeepSeek 返回的是文本，如何解析成结构化数据？

**对于占卜结果**:
- 当前代码期望返回对象包含 `divination`, `prediction`, `advice`, `luck` 字段
- 需要解析 DeepSeek 返回的文本，提取各个部分

**对于每日运势**:
- 当前代码期望返回 `{fortune: string}` 格式
- 可以直接使用 DeepSeek 返回的文本，或解析成更结构化的格式

### 3. 错误处理策略
**问题**: API 调用失败时如何处理？

**当前策略**:
- result.js 有默认占卜结果
- merit.js 有默认运势文本

**建议**:
- 保持现有的备用方案
- 添加更友好的错误提示
- 考虑离线缓存机制

### 4. 性能优化
**问题**: 如何优化 API 调用性能？

**建议**:
- 每日运势可以按日期缓存
- 占卜结果可以按愿望+数字组合缓存短时间
- 添加请求超时设置

### 5. UI/UX 考虑
**问题**: 如何提供更好的用户体验？

**建议**:
- 优化加载动画和提示文案
- 考虑流式输出（如果 DeepSeek 支持）
- 添加重新生成功能

## 下一步计划

1. **确认技术方案**: 讨论上述问题并确定最终实现方式
2. **实现 DeepSeek Service**: 创建或更新 deepseekService.js
3. **测试 API 集成**: 确保两个功能都能正常工作
4. **优化用户体验**: 完善加载状态和错误处理
5. **测试和调试**: 验证各种场景下的表现

## 现有代码分析

### DeepSeekService.js 当前状态
已经存在一个基础的 DeepSeekService 类，包含：

#### 现有功能
1. **基础配置**: 
   - 使用环境变量读取 API Key
   - 配置了正确的 API 端点
   - Axios 客户端初始化

2. **占卜功能**:
   - `performDivination(wish, numbers)` 方法已实现
   - 有简单的 prompt 构建逻辑
   - 文本解析功能（提取各个部分）
   - 完整的备用方案（基于六神卦象）

3. **每日运势功能**:
   - `getDailyFortune()` 方法已实现
   - 基础的 prompt 构建
   - 错误处理和备用方案

#### 需要改进的地方

1. **占卜功能的 Prompt**:
   - 当前的 prompt 太简单，不符合用户提供的详细三宫五行要求
   - 缺少具体的计算逻辑和五行生克分析
   - 输出格式与用户期望不匹配

2. **每日运势的 Prompt**:
   - 缺少农历日期获取
   - 不包含用户要求的10个方面分析
   - 没有星级评价系统
   - 缺少幸运元素（颜色、数字等）

3. **API 配置**:
   - API Key 目前从环境变量读取，但用户提供了具体的 key
   - 需要确认是否要硬编码或保持环境变量方式

4. **数据格式**:
   - 占卜结果解析可能不够robust
   - 每日运势返回格式需要更丰富

## 待讨论的具体问题

### 1. API Key 配置方式
**问题**: 是否要将用户提供的 API Key 硬编码到代码中，还是保持环境变量方式？

**选项**:
- **方案A**: 硬编码 `sk-b3ffcd0b8841461783dcc82759746fec`
- **方案B**: 保持环境变量，在 `.env` 文件中配置
- **方案C**: 同时支持两种方式，环境变量优先

**建议**: 选择方案B，避免在代码中暴露API Key

### 2. 占卜 Prompt 升级
**问题**: 如何最好地整合用户提供的详细三宫五行 prompt？

**需要考虑**:
- 用户的 prompt 非常详细（约2000字），可能超出单次请求限制
- 是否需要分步骤调用（先计算宫位，再分析五行）
- 如何确保输出格式的一致性

**建议**: 
- 完全替换现有的简单 prompt
- 添加输出格式约束，确保能正确解析
- 考虑添加 few-shot 示例

### 3. 每日运势增强
**问题**: 如何实现用户要求的丰富运势内容？

**需要添加**:
- 农历日期计算（可能需要第三方库）
- 10个方面的详细分析
- 星级评价系统
- 幸运元素（颜色、数字、方位、吉时）
- HTML 格式化输出

**建议**: 
- 研究现有的农历转换库
- 重写 prompt 以包含所有要求的元素
- 考虑返回结构化数据而非纯文本

### 4. 缓存策略
**问题**: 如何实现有效的缓存以节省 API 调用？

**方案**:
- **占卜结果**: 按 `wish + numbers` 组合缓存1小时
- **每日运势**: 按日期缓存24小时
- **存储方式**: localStorage (前端) 或 内存缓存 (后端)

### 5. 错误处理优化
**问题**: 如何提供更好的错误处理体验？

**改进点**:
- 更详细的错误分类（网络错误、API限额、格式错误等）
- 重试机制（指数退避）
- 更智能的备用方案

### 6. 性能和体验优化
**问题**: 如何优化API调用性能和用户体验？

**考虑**:
- 请求超时设置
- 加载状态优化
- 流式响应（如果支持）
- 预加载策略

### 7. 输出格式匹配
**问题**: 如何确保DeepSeek输出与现有UI完美匹配？

**占卜结果需要匹配**:
- `divination` (卦象解析)
- `prediction` (运势预测) 
- `advice` (神明指引)
- `luck` (数字评分)

**每日运势需要匹配**:
- 当前期望简单的 `fortune` 字符串
- 但用户样本显示需要更复杂的HTML格式

## 推荐的实施方案

### 阶段1: 基础功能完善
1. 配置API Key（环境变量方式）
2. 更新占卜 prompt 为用户提供的详细版本
3. 增强每日运势 prompt，添加农历和详细分析

### 阶段2: 格式化和解析
1. 改进文本解析逻辑，处理更复杂的输出
2. 添加农历日期库
3. 实现每日运势的HTML格式化

### 阶段3: 优化和缓存
1. 添加缓存机制
2. 改进错误处理
3. 性能优化

### 阶段4: 测试和调试
1. 全面测试各种场景
2. 优化输出质量
3. 用户体验调优

## 视频播放优化修复

### 修复内容
1. **1.mp4 循环播放**: 在 `pages/index.js` 中添加 `loop` 属性
2. **2.mp4 等待DeepSeek结果**: 在 `pages/calculate.js` 中修改逻辑，实际调用DeepSeek API并等待结果
3. **3.mp4 循环播放**: 在 `pages/payment-animation.js` 中添加 `loop` 属性

### 具体修改

#### 1. 首页视频循环 (pages/index.js)
```javascript
<ClientOnlyVideo
  src="/videos/1.mp4"
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay
  muted
  playsInline
  loop  // 添加循环播放
  onEnded={handleVideoEnd}
/>
```

#### 2. 算命页面等待API结果 (pages/calculate.js)
```javascript
const handleCalculate = async () => {
  // ... 验证逻辑
  
  setIsLoading(true)
  
  try {
    // 存储数字到localStorage
    localStorage.setItem('divinationNumbers', JSON.stringify(numbers.map(num => parseInt(num))))
    
    // 实际调用DeepSeek API并等待结果
    const deepseekService = (await import('../services/deepseekService')).default
    const result = await deepseekService.performDivination(
      wish, 
      numbers.map(num => parseInt(num))
    )
    
    // 存储占卜结果
    localStorage.setItem('divinationResult', JSON.stringify(result))
    
    // 跳转到结果页面
    router.push('/result')
    
  } catch (error) {
    console.error('算命失败:', error)
    // 即使失败也跳转，在result页面会使用默认结果
    router.push('/result')
  }
}

// 加载状态的全屏视频显示
if (isLoading) {
  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* 全屏播放 2.mp4 视频 */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
      >
        <source src="/videos/2.mp4" type="video/mp4" />
        您的浏览器不支持视频播放
      </video>
      
      {/* 加载提示覆盖层 */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white font-kai text-xl mb-4 drop-shadow-lg">
            神明正在计算您的运势...
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce drop-shadow-lg" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 3. 结果页面优化缓存 (pages/result.js)
```javascript
const initializePage = async () => {
  // 获取存储的数据
  const userWish = localStorage.getItem('userWish')
  const divinationNumbers = localStorage.getItem('divinationNumbers')
  const storedResult = localStorage.getItem('divinationResult')
  
  // ... 验证逻辑
  
  // 如果已有占卜结果，直接使用
  if (storedResult) {
    try {
      const result = JSON.parse(storedResult)
      setDivinationResult(result)
      setLoading(false)
      return
    } catch (error) {
      console.error('解析存储的结果失败:', error)
    }
  }
  
  // 如果没有存储的结果，调用DeepSeek API进行占卜
  // ... API调用逻辑
}
```

#### 4. 上香动画优化 (pages/payment-animation.js)
```javascript
// 智能控制视频循环和跳转时机
const verifyPayment = async () => {
  // 支付验证延迟调整为4秒，匹配视频时长
  await new Promise(resolve => setTimeout(resolve, 4000))
  
  setPaymentVerified(true)
  
  // 支付验证成功后，移除循环属性，让视频自然结束
  if (videoElement) {
    videoElement.loop = false
  }
}

const handleAnimationEnd = () => {
  // 只有在支付验证成功后才能结束动画
  if (paymentVerified) {
    setAnimationEnded(true)
    // 显示成功提示2秒后跳转
    setTimeout(() => {
      router.push('/merit')
    }, 2000)
  }
}

<video
  className="absolute inset-0 w-full h-full object-cover"
  autoPlay
  muted
  playsInline
  loop  // 初始循环播放
  onEnded={handleAnimationEnd}
  onLoadedData={handleVideoLoad}  // 获取视频元素引用
>
  <source src="/videos/3.mp4" type="video/mp4" />
  您的浏览器不支持视频播放
</video>
```

**优化说明**:
1. **智能时机控制**: 支付验证时间调整为4秒，与视频长度匹配
2. **动态循环控制**: 支付成功后移除loop属性，让视频自然结束
3. **优雅跳转**: 视频结束+成功提示显示2秒后跳转
4. **用户体验**: 避免突然跳转，提供完整的仪式感

### 优化效果
1. **更好的用户体验**: 视频循环播放避免黑屏
2. **真实API调用**: 2.mp4播放期间实际进行DeepSeek计算
3. **结果缓存**: 避免重复API调用
4. **流程优化**: 算命结果在加载页面就生成，结果页面直接显示

## ✅ 每日运势功能完成

### 新增功能
1. **农历日期支持**: 使用 `lunar-javascript` 库获取农历日期
2. **详细运势内容**: 实现用户要求的10个方面分析
3. **智能缓存机制**: 同一天的运势内容不重复调用API
4. **预加载优化**: 从result页面跳转到merit页面时自动预加载运势
5. **丰富的HTML格式化**: 星级评价、幸运元素、宜忌事项等

### 具体实现

#### 1. DeepSeek服务升级 (services/deepseekService.js)
```javascript
async getDailyFortune(date = null) {
  // 获取农历日期
  const { Lunar } = await import('lunar-javascript')
  const lunar = Lunar.fromDate(targetDate)
  const lunarDate = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
  
  // 详细的运势prompt，包含10个方面分析
  const prompt = `请基于传统的中华民俗文化和五行理论，生成今日运势报告...`
}
```

#### 2. Merit页面优化 (pages/merit.js)
```javascript
// 预先加载每日运势
const loadDailyFortune = async () => {
  // 检查今日缓存
  const cacheKey = getDailyFortuneCacheKey()
  const cachedFortune = localStorage.getItem(cacheKey)
  
  if (cachedFortune) {
    // 使用缓存数据
    const fortuneData = JSON.parse(cachedFortune)
    setDailyFortune(fortuneData.fortune)
    return
  }
  
  // 调用API并缓存结果
  const result = await deepseekService.getDailyFortune()
  localStorage.setItem(cacheKey, JSON.stringify(result))
}

// 格式化运势内容显示
const formatFortuneContent = (content) => {
  // 解析运势文本，生成漂亮的HTML布局
  // 包含：标题、星级评价、宜忌事项、幸运元素等
}
```

### 输出格式示例
```
黄道吉日
2025年01月XX日
农历XX月XX 吉
宜 祈福上香 拜访长辈 整理房间
忌 冲动购物 与人争执 过度饮食

财运★★★★★
财运较好，有小财进账的机会，但需要谨慎投资。

事业★★★★☆
工作运势平稳，适合完成既定任务，与同事关系和谐。

感情★★★★☆
感情运势良好，单身者有机会遇到心仪对象。

健康★★★★★
身体状况良好，注意休息和饮食平衡。

今日建议
多行善事，保持善念，诚心祈福，福运自然来临。

今日幸运
幸运颜色: 紫色
幸运数字: 86, 95, 45
幸运方位: 东南
吉时: 09:00-11:00
```

### 技术优化
1. **缓存策略**: 按日期缓存，避免同一天重复API调用
2. **预加载机制**: 页面加载时自动获取运势，用户点击时立即显示
3. **错误处理**: 完善的降级方案，确保始终有内容显示
4. **样式优化**: 星级显示、颜色渐变、边框装饰等视觉效果 