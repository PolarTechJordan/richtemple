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
            content: '你是一位精通小六壬神算的大师，能够根据用户的愿望和数字进行准确的占卜。请用古典而神秘的语言回答，体现出中国传统文化的深厚底蕴。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.8
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
请根据小六壬神算法为以下愿望进行占卜：

用户愿望：${wish}
神选数字：${num1}、${num2}、${num3}

请按照以下格式回答：

【卦象解析】
根据数字${num1}、${num2}、${num3}，推算出的卦象和含义

【运势预测】
对用户愿望的实现可能性和时机进行预测

【神明指引】
给出具体的建议和指导

【吉凶判断】
总体运势评分（1-10分）

请用古典优雅的中文回答，体现出神算的神秘感和权威性。
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