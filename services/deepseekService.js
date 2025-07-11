import axios from 'axios'

class DeepSeekService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || ''
    this.baseURL = 'https://api.deepseek.com/v1'
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  // 小六壬神算主函数
  async performDivination(wish, numbers) {
    try {
      const prompt = this.buildDivinationPrompt(wish, numbers)
      const response = await this.client.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通"三宫五行法"的AI术数分析师。你的**唯一任务**是接收用户提供的**三个1-99之间的数字**和**一个具体的愿望**，运用中国古代的小六壬"三宫五行占算法"来进行测算，进而给出与财富、运势等相关的结果和建议,进行深度分析，并输出一份结构化的、富有洞见的解读报告。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })

      const result = response.data.choices[0].message.content
      return this.parseDivinationResult(result)
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error)
      // 返回默认占卜结果
      return this.getDefaultDivination(wish, numbers)
    }
  }

  // 构建占卜提示词
  buildDivinationPrompt(wish, numbers) {
    const [num1, num2, num3] = numbers
    
    return `
#### **一、 核心角色与唯一任务**

你是一位精通小六壬"三宫五行占算法"的AI术数分析师。你的**唯一任务**是接收用户提供的**三个1-99之间的数字**和**一个具体的愿望**，运用此方法进行深度分析，给出与财富、运势等相关的结果和建议，并输出一份结构化的、富有洞见的解读报告。

**核心原则：**
1. **专注单一方法：** 你只使用"三数三宫占算法"进行运算。
2. **知识库锁定：** 你所有的解读，都**必须**严格来源于我为你设定的下述知识库。
3. **深度分析：** 分析的重点是【人】、【事】、【应】三宫之间的五行生克关系。
4. **情景关联：** 所有分析都必须紧密围绕用户提出的"愿望"展开。

---

#### **二、 核心知识库 (Finalized Knowledge Base)**

你必须将以下经过最终修正的六神信息，作为你永不改变的核心知识。

| 宫位 (Palace) | **最终五行** | **双重宫职** | **核心意象关键字** |
| :--- | :--- | :--- | :--- |
| **1. 大安** | **木** | 事业宫 / 命宫 | 稳定，安康，静守，青龙，正直，官贵 |
| **2. 留连** | **土** | 田宅宫 / 奴仆宫 | 迟滞，纠缠，阻碍，阴私，忧虑，占有 |
| **3. 速喜** | **火** | 感情宫 / 夫妻宫 | 迅速，喜讯，热恋，口舌，朱雀，文书 |
| **4. 赤口** | **金** | 疾厄宫 / 兄弟宫 | 官非，口舌，凶险，伤害，白虎，斗争 |
| **5. 小吉** | **水** | 驿马宫 / 子女宫 | 吉利，合作，财源，出行，六合，智慧 |
| **6. 空亡** | **土** | 福德宫 / 父母宫 | 落空，徒劳，无果，阴德，勾陈，玄奥 |

**五行生克关系：**
* **相生:** 木生火, 火生土, 土生金, 金生水, 水生木 (促进, 帮助)
* **相克:** 木克土, 土克水, 水克火, 火克金, 金克木 (克服, 压力)
* **比和:** 同五行 (和谐, 顺畅)

---

#### **三、 运算与分析框架**

##### **Step 1: 输入处理与定宫**
1. **获取输入：** 用户提供三个1-99的数字（数字A, B, C）和一个愿望。
2. **计算定宫：** 分别用每个数字对6取余数，来确定三个宫位。
   * 宫位A = 数字A % 6
   * 宫位B = 数字B % 6
   * 宫位C = 数字C % 6
   * **（重要规则：若余数为0，则计为第6宫【空亡】）**
3. **分配三宫：**
   * **【人宫】(用户本人):** 来自数字A，对应宫位A。
   * **【事宫】(事情本身):** 来自数字B，对应宫位B。
   * **【应宫】(最终结果):** 来自数字C，对应宫位C。

##### **Step 2: 五行生克分析**
1. **分析【人宫】与【事宫】的关系 (我与事):**
   * 人"生"事 (付出), 事"生"人 (得利), 人"克"事 (掌控), 事"克"人 (受阻), 人事"比和" (顺畅)。
2. **分析【人宫】与【应宫】的关系 (我与结果):**
   * 人"生"应 (耗费), 应"生"人 (圆满), 人"克"应 (可控), 应"克"人 (不利), 人应"比和" (如愿)。
3. **分析【事宫】与【应宫】的关系 (事与结果):**
   * 事"生"应 (事成), 应"生"事 (助缘), 事"克"应 (难成), 应"克"事 (受限), 事应"比和" (一致)。

---

#### **四、 标准化输出结构**

请按照以下格式回答：

【卦象解析】
1. **您与事情的关系 (人 vs 事):** [人宫五行]与[事宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。
2. **您与结果的关系 (人 vs 应):** [人宫五行]与[应宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。
3. **事情与结果的关系 (事 vs 应):** [事宫五行]与[应宫五行]为**[生/克/比和]**关系，这代表：[进行情景化解释]。

【运势预测】
[根据三宫五行分析，给出详细的运势判断和建议]

【神明指引】
[针对用户愿望和卦象结果，给出具体可行的建议]

【吉凶判断】
总体运势评分（1-10分）


**说明：**
1. 请严格按照三宫五行占算法进行分析
2. 分析需要紧密结合用户的具体愿望
3. 给出的建议要实用且有针对性
4. 保持传统文化的严肃性和神秘感

用户愿望：${wish}
三个数字：${numbers.join(', ')}

请根据以上要求进行三宫五行占算分析，并给出完整的解读结果。
请不要返回JSON格式，直接按照上述结构化格式返回文本内容。

    `
  }

  // 解析占卜结果
  parseDivinationResult(result) {
    try {
      // 提取各个部分
      const sections = {
        divination: this.extractSection(result, '【卦象解析】'),
        prediction: this.extractSection(result, '【运势预测】'),
        advice: this.extractSection(result, '【神明指引】'),
        luck: this.extractLuckScore(result)
      }

      return {
        success: true,
        ...sections,
        fullText: result
      }
    } catch (error) {
      console.error('解析占卜结果失败:', error)
      return {
        success: false,
        error: '解析结果失败'
      }
    }
  }

  // 提取文本段落
  extractSection(text, sectionTitle) {
    const regex = new RegExp(`${sectionTitle}([\\s\\S]*?)(?=【|$)`)
    const match = text.match(regex)
    return match ? match[1].trim() : ''
  }

  // 提取运势评分
  extractLuckScore(text) {
    const scoreRegex = /(\d+)分/
    const match = text.match(scoreRegex)
    return match ? parseInt(match[1]) : 7 // 默认7分
  }

  // 获取默认占卜结果（当API失败时使用）
  getDefaultDivination(wish, numbers) {
    const [num1, num2, num3] = numbers
    const sum = num1 + num2 + num3
    const remainder = sum % 6
    
    const hexagrams = [
      { name: '大安', meaning: '事事如意，心想事成', luck: 9 },
      { name: '留连', meaning: '需要耐心等待，时机未到', luck: 6 },
      { name: '速喜', meaning: '好事将至，喜事临门', luck: 8 },
      { name: '赤口', meaning: '需要谨慎言行，避免冲突', luck: 4 },
      { name: '小吉', meaning: '小有收获，稳中求进', luck: 7 },
      { name: '空亡', meaning: '暂时困顿，需要调整方向', luck: 3 }
    ]

    const hexagram = hexagrams[remainder]
    
    return {
      success: true,
      divination: `根据您选择的数字 ${num1}、${num2}、${num3}，推算得出「${hexagram.name}」卦象。此卦象预示着${hexagram.meaning}。`,
      prediction: `您的愿望「${wish}」在当前时运下，${this.generatePrediction(hexagram.luck)}`,
      advice: `神明指引：${this.generateAdvice(hexagram.luck)}`,
      luck: hexagram.luck,
      fullText: `【卦象解析】\n根据您选择的数字 ${num1}、${num2}、${num3}，推算得出「${hexagram.name}」卦象。\n\n【运势预测】\n您的愿望在当前时运下，${this.generatePrediction(hexagram.luck)}\n\n【神明指引】\n${this.generateAdvice(hexagram.luck)}\n\n【吉凶判断】\n总体运势评分：${hexagram.luck}/10分`
    }
  }

  // 生成预测文本
  generatePrediction(luck) {
    if (luck >= 8) return '实现的可能性很高，时机已经成熟，可以积极行动。'
    if (luck >= 6) return '有一定的实现可能，需要耐心等待合适的时机。'
    if (luck >= 4) return '面临一些挑战，需要谨慎处理，调整策略。'
    return '当前阻力较大，建议暂缓行动，寻求其他途径。'
  }

  // 生成建议文本
  generateAdvice(luck) {
    if (luck >= 8) return '诚心祈福，保持善念，您的愿望将会实现。建议多行善事，积累福德。'
    if (luck >= 6) return '保持耐心，坚持努力，时机成熟时自然水到渠成。建议多烧香祈福。'
    if (luck >= 4) return '需要调整心态，化解阻碍，可通过上香祈福来改善运势。'
    return '当前运势低迷，建议多行善事，上香祈福，等待时机转变。'
  }

  // 获取每日运势
  async getDailyFortune(date = null) {
    try {
      // 使用传入的日期或当前日期
      const targetDate = date ? new Date(date) : new Date()
      const dateString = targetDate.toLocaleDateString('zh-CN')
      
      // 获取农历日期
      const { Lunar } = await import('lunar-javascript')
      const lunar = Lunar.fromDate(targetDate)
      const lunarDate = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
      
      const prompt = `请根据今天的日期生成当日的运势情况。今天是${dateString}，农历${lunarDate}。

请基于传统的中华民俗文化和五行理论，生成今日运势报告，包含以下方面：
1. 总体运势评级（1-5星）
2. 财运分析
3. 事业运势
4. 感情运势
5. 健康运势
6. 今日建议
7. 幸运数字
8. 幸运颜色
9. 宜做的事情
10. 忌做的事情

请严格按照以下格式输出：

黄道吉日
${dateString}
${lunarDate} [吉/平/凶]
宜 [具体事项，用空格分隔]
忌 [具体事项，用空格分隔]

财运★★★★★
[财运分析内容]

事业★★★★☆
[事业运势内容]

感情★★★★☆
[感情运势内容]

健康★★★★★
[健康运势内容]

今日建议
[具体建议内容]

今日幸运
幸运颜色: [颜色]
幸运数字: [数字1], [数字2], [数字3]
幸运方位: [方位]
吉时: [时间段]

请用传统的中式语言风格，保持庄重和神秘感。`

      const response = await this.client.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通中国传统命理学的大师，擅长根据日期和农历信息提供详细的运势分析。请严格按照用户要求的格式输出，保持传统文化的庄重感。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      })

      return {
        success: true,
        fortune: response.data.choices[0].message.content,
        date: dateString,
        lunarDate: lunarDate
      }
    } catch (error) {
      console.error('获取每日运势失败:', error)
      
      // 默认运势内容
      const targetDate = date ? new Date(date) : new Date()
      const dateString = targetDate.toLocaleDateString('zh-CN')
      const defaultFortune = `黄道吉日
${dateString}
农历吉日 吉
宜 祈福上香 拜访长辈 整理房间
忌 冲动购物 与人争执 过度饮食

财运★★★★☆
财运平稳，有小额收入机会，宜谨慎理财。

事业★★★★☆
工作运势良好，适合推进重要项目，与同事关系和谐。

感情★★★★☆
感情运势平稳，单身者宜多参加社交活动。

健康★★★★★
身体状况良好，注意作息规律和饮食平衡。

今日建议
多行善事，保持善念，诚心祈福，福运自然来临。

今日幸运
幸运颜色: 金色
幸运数字: 8, 18, 28
幸运方位: 东南
吉时: 09:00-11:00`

      return {
        success: false,
        fortune: defaultFortune,
        date: dateString,
        lunarDate: '农历吉日'
      }
    }
  }

  // 生成缓存键
  getDailyFortuneCacheKey(date = null) {
    const targetDate = date ? new Date(date) : new Date()
    return `dailyFortune_${targetDate.getFullYear()}_${targetDate.getMonth() + 1}_${targetDate.getDate()}`
  }
}

// 创建单例实例
const deepseekService = new DeepSeekService()

export default deepseekService 