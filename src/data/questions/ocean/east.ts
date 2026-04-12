import type { Question } from '../../../game/types'

// East Ocean Question Bank
// 3 subjects: math, chinese, english
// Difficulty: D1(grade 1-3), D2(grade 4-5), D3(grade 6-7), D4(grade 8), D5(grade 9)

// Local interface for the bank (avoid circular import with ocean/index.ts)
interface OceanQuestionBank {
  oceanId: string
  questions: Question[]
  getQuestions(options: {
    category?: string
    difficulty?: number
    grade?: number
    excludeIds?: string[]
  }): Question[]
  getTotalCount(): number
}

// Local copy of createOceanQuestionBank to avoid circular dependency
function createEastOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
  return {
    oceanId,
    questions,

    getQuestions(options: {
      category?: string
      difficulty?: number
      grade?: number
      excludeIds?: string[]
    }) {
      let result = [...this.questions]

      if (options.category) {
        result = result.filter((q) => q.category === options.category)
      }

      if (options.difficulty !== undefined) {
        result = result.filter((q) => q.difficulty === options.difficulty)
      }

      if (options.grade !== undefined) {
        result = result.filter((q) => q.grade === undefined || q.grade === options.grade)
      }

      if (options.excludeIds && options.excludeIds.length > 0) {
        result = result.filter((q) => !options.excludeIds!.includes(q.id))
      }

      return result
    },

    getTotalCount() {
      return this.questions.length
    },
  }
}

// === MATH D1 (40题, grade 1-3) - Sample 8题 ===
const mathD1Questions: Question[] = [
  { id: 'east_math_1_001', content: '1 + 1 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'east_math_1_002', content: '2 + 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_003', content: '5 - 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'east_math_1_004', content: '4 + 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_005', content: '9 - 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_006', content: '3 × 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_007', content: '12 + 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'15',isCorrect:false},{text:'16',isCorrect:false},{text:'17',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'east_math_1_008', content: '15 - 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D2 (30题, grade 4-5) - Sample 8题 ===
const mathD2Questions: Question[] = [
  { id: 'east_math_2_001', content: '25 + 37 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'52',isCorrect:false},{text:'62',isCorrect:true},{text:'72',isCorrect:false},{text:'42',isCorrect:false}] },
  { id: 'east_math_2_002', content: '84 - 29 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'45',isCorrect:false},{text:'55',isCorrect:true},{text:'65',isCorrect:false},{text:'35',isCorrect:false}] },
  { id: 'east_math_2_003', content: '7 × 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'54',isCorrect:false},{text:'56',isCorrect:true},{text:'58',isCorrect:false},{text:'48',isCorrect:false}] },
  { id: 'east_math_2_004', content: '63 ÷ 9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'east_math_2_005', content: '234 + 156 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'380',isCorrect:false},{text:'390',isCorrect:true},{text:'400',isCorrect:false},{text:'410',isCorrect:false}] },
  { id: 'east_math_2_006', content: '500 - 178 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'312',isCorrect:false},{text:'322',isCorrect:true},{text:'332',isCorrect:false},{text:'342',isCorrect:false}] },
  { id: 'east_math_2_007', content: '12 × 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'160',isCorrect:false},{text:'170',isCorrect:false},{text:'180',isCorrect:true},{text:'190',isCorrect:false}] },
  { id: 'east_math_2_008', content: '144 ÷ 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
]

// === MATH D3 (20题, grade 6-7) - Sample 8题 ===
const mathD3Questions: Question[] = [
  { id: 'east_math_3_001', content: '3.14 × 10 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'31.4',isCorrect:true},{text:'314',isCorrect:false},{text:'3.14',isCorrect:false},{text:'0.314',isCorrect:false}] },
  { id: 'east_math_3_002', content: '(3 + 5) × 2 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'13',isCorrect:false},{text:'16',isCorrect:true},{text:'18',isCorrect:false},{text:'20',isCorrect:false}] },
  { id: 'east_math_3_003', content: '48 ÷ (12 ÷ 3) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'4',isCorrect:false},{text:'8',isCorrect:false},{text:'12',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'east_math_3_004', content: '2³ = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'6',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false},{text:'16',isCorrect:false}] },
  { id: 'east_math_3_005', content: '√144 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'14',isCorrect:false}] },
  { id: 'east_math_3_006', content: '-5 + 8 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'-13',isCorrect:false},{text:'3',isCorrect:true},{text:'13',isCorrect:false},{text:'-3',isCorrect:false}] },
  { id: 'east_math_3_007', content: '3x + 5 = 20, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'east_math_3_008', content: '25% of 80 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'15',isCorrect:false},{text:'20',isCorrect:true},{text:'25',isCorrect:false},{text:'30',isCorrect:false}] },
]

// === MATH D4 (8题, grade 8) - Sample 6题 ===
const mathD4Questions: Question[] = [
  { id: 'east_math_4_001', content: 'x² - 9 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'±2',isCorrect:false},{text:'±3',isCorrect:true},{text:'±4',isCorrect:false},{text:'±5',isCorrect:false}] },
  { id: 'east_math_4_002', content: '2x + y = 10, x - y = 2, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false}] },
  { id: 'east_math_4_003', content: 'sin(90°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'√2/2',isCorrect:false}] },
  { id: 'east_math_4_004', content: 'a³ × a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a⁵',isCorrect:true},{text:'a⁶',isCorrect:false},{text:'a⁹',isCorrect:false},{text:'2a⁵',isCorrect:false}] },
  { id: 'east_math_4_005', content: '(x+2)(x-2) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-4',isCorrect:true},{text:'x²+4',isCorrect:false},{text:'x²-2x+4',isCorrect:false},{text:'x²+2x-4',isCorrect:false}] },
  { id: 'east_math_4_006', content: '√50 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5√2',isCorrect:true},{text:'2√5',isCorrect:false},{text:'25',isCorrect:false},{text:'10√5',isCorrect:false}] },
]

// === MATH D5 (2题, grade 9) - Sample 2题 ===
const mathD5Questions: Question[] = [
  { id: 'east_math_5_001', content: '∫2x dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'x² + C',isCorrect:true},{text:'2x² + C',isCorrect:false},{text:'x + C',isCorrect:false},{text:'2 + C',isCorrect:false}] },
  { id: 'east_math_5_002', content: 'lim(x→0) sin(x)/x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'∞',isCorrect:false},{text:'不存在',isCorrect:false}] },
]

// === CHINESE D1 (40题, grade 1-3) - Sample 8题 ===
const chineseD1Questions: Question[] = [
  { id: 'east_chinese_1_001', content: '"大"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_002', content: '"日"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'月亮',isCorrect:false},{text:'太阳',isCorrect:true},{text:'星星',isCorrect:false},{text:'云彩',isCorrect:false}] },
  { id: 'east_chinese_1_003', content: '下列哪个是水果？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'白菜',isCorrect:false},{text:'苹果',isCorrect:true},{text:'萝卜',isCorrect:false},{text:'青菜',isCorrect:false}] },
  { id: 'east_chinese_1_004', content: '"上"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'左',isCorrect:false},{text:'下',isCorrect:true},{text:'前',isCorrect:false},{text:'高',isCorrect:false}] },
  { id: 'east_chinese_1_005', content: '一年有几个季节？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:false},{text:'4个',isCorrect:true},{text:'5个',isCorrect:false}] },
  { id: 'east_chinese_1_006', content: '“天”字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'east_chinese_1_007', content: '哪个字是动词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'美丽',isCorrect:false},{text:'跑步',isCorrect:true},{text:'高兴',isCorrect:false},{text:'红色',isCorrect:false}] },
  { id: 'east_chinese_1_008', content: '“鸟”可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'鲜花',isCorrect:false},{text:'小鸟',isCorrect:true},{text:'大树',isCorrect:false},{text:'小河',isCorrect:false}] },
]

// === CHINESE D2 (30题, grade 4-5) - Sample 8题 ===
const chineseD2Questions: Question[] = [
  { id: 'east_chinese_2_001', content: '《静夜思》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:false},{text:'李白',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'east_chinese_2_002', content: '“望梅止渴”说的是谁的故事？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'刘备',isCorrect:false},{text:'曹操',isCorrect:true},{text:'关羽',isCorrect:false},{text:'张飞',isCorrect:false}] },
  { id: 'east_chinese_2_003', content: '下列哪个是贬义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'勇敢',isCorrect:false},{text:'善良',isCorrect:false},{text:'狡猾',isCorrect:true},{text:'勤奋',isCorrect:false}] },
  { id: 'east_chinese_2_004', content: '“学而不思则罔”的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'思而不学则殆',isCorrect:true},{text:'敏而好学',isCorrect:false},{text:'温故知新',isCorrect:false},{text:'学而时习',isCorrect:false}] },
  { id: 'east_chinese_2_005', content: '《西游记》中唐僧的徒弟有几个？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:true},{text:'4个',isCorrect:false},{text:'5个',isCorrect:false}] },
  { id: 'east_chinese_2_006', content: '“鼎”字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'10画',isCorrect:false},{text:'11画',isCorrect:false},{text:'12画',isCorrect:true},{text:'13画',isCorrect:false}] },
  { id: 'east_chinese_2_007', content: '下列哪个不是四大名著？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'红楼梦',isCorrect:false},{text:'三国演义',isCorrect:false},{text:'儒林外史',isCorrect:true},{text:'水浒传',isCorrect:false}] },
  { id: 'east_chinese_2_008', content: '“揠苗助长”属于哪种修辞手法？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
]

// === CHINESE D3 (20题, grade 6-7) - Sample 8题 ===
const chineseD3Questions: Question[] = [
  { id: 'east_chinese_3_001', content: '《满江红》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'岳飞',isCorrect:true},{text:'辛弃疾',isCorrect:false},{text:'苏轼',isCorrect:false},{text:'陆游',isCorrect:false}] },
  { id: 'east_chinese_3_002', content: '“出淤泥而不染”赞美的是哪种花？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'菊花',isCorrect:false},{text:'梅花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'牡丹',isCorrect:false}] },
  { id: 'east_chinese_3_003', content: '下列哪个是宋词？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'登鹳雀楼',isCorrect:false},{text:'春晓',isCorrect:false},{text:'水调歌头',isCorrect:true},{text:'静夜思',isCorrect:false}] },
  { id: 'east_chinese_3_004', content: '“苟利国家生死以”的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'岂因祸福避趋之',isCorrect:true},{text:'留取丹心照汗青',isCorrect:false},{text:'天下兴亡匹夫有责',isCorrect:false},{text:'人生自古谁无死',isCorrect:false}] },
  { id: 'east_chinese_3_005', content: '《背影》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'east_chinese_3_006', content: '“逝者如斯夫”出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'east_chinese_3_007', content: '下列哪个是鲁迅的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'骆驼祥子',isCorrect:false},{text:'朝花夕拾',isCorrect:true},{text:'茶馆',isCorrect:false},{text:'四世同堂',isCorrect:false}] },
  { id: 'east_chinese_3_008', content: '“不以物喜，不以己悲”出自哪篇文章？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《醉翁亭记》',isCorrect:false},{text:'《岳阳楼记》',isCorrect:true},{text:'《滕王阁序》',isCorrect:false},{text:'《赤壁赋》',isCorrect:false}] },
]

// === CHINESE D4 (8题, grade 8) - Sample 6题 ===
const chineseD4Questions: Question[] = [
  { id: 'east_chinese_4_001', content: '《红楼梦》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:true},{text:'吴承恩',isCorrect:false},{text:'施耐庵',isCorrect:false},{text:'罗贯中',isCorrect:false}] },
  { id: 'east_chinese_4_002', content: '“青，取之于蓝而青于蓝”出自？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《论语》',isCorrect:false},{text:'《庄子》',isCorrect:false},{text:'《荀子》',isCorrect:true},{text:'《老子》',isCorrect:false}] },
  { id: 'east_chinese_4_003', content: '下列哪个是明代小说？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《三国演义》',isCorrect:true},{text:'《聊斋志异》',isCorrect:false},{text:'《儒林外史》',isCorrect:false},{text:'《红楼梦》',isCorrect:false}] },
  { id: 'east_chinese_4_004', content: '“己所不欲，勿施于人”体现哪种思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:false},{text:'儒家',isCorrect:true},{text:'法家',isCorrect:false},{text:'墨家',isCorrect:false}] },
  { id: 'east_chinese_4_005', content: '《诗经》分为哪三部分？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'风、雅、颂',isCorrect:true},{text:'赋、比、兴',isCorrect:false},{text:'经、史、子',isCorrect:false},{text:'礼、乐、诗',isCorrect:false}] },
  { id: 'east_chinese_4_006', content: '“茕茕孑立”形容的是什么状态？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'快步走',isCorrect:false},{text:'独自站立',isCorrect:false},{text:'孤独无依',isCorrect:true},{text:'勤奋努力',isCorrect:false}] },
]

// === CHINESE D5 (2题, grade 9) - Sample 2题 ===
const chineseD5Questions: Question[] = [
  { id: 'east_chinese_5_001', content: '“问渠那得清如许”的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'为有源头活水来',isCorrect:true},{text:'一片冰心在玉壶',isCorrect:false},{text:'映日荷花别样红',isCorrect:false},{text:'总把新桃换旧符',isCorrect:false}] },
  { id: 'east_chinese_5_002', content: '《天工开物》的作者是谁？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'徐光启',isCorrect:false},{text:'宋应星',isCorrect:true},{text:'李时珍',isCorrect:false},{text:'徐霞客',isCorrect:false}] },
]

// === ENGLISH D1 (40题, grade 1-3) - Sample 8题 ===
const englishD1Questions: Question[] = [
  { id: 'east_english_1_001', content: 'What is the English for "苹果"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Banana',isCorrect:false},{text:'Apple',isCorrect:true},{text:'Orange',isCorrect:false},{text:'Grape',isCorrect:false}] },
  { id: 'east_english_1_002', content: 'How do you spell "dog"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'d-o-g',isCorrect:true},{text:'d-u-g',isCorrect:false},{text:'d-a-g',isCorrect:false},{text:'d-i-g',isCorrect:false}] },
  { id: 'east_english_1_003', content: '"红色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Red',isCorrect:true}] },
  { id: 'east_english_1_004', content: 'What number is "5"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Three',isCorrect:false},{text:'Four',isCorrect:false},{text:'Five',isCorrect:true},{text:'Six',isCorrect:false}] },
  { id: 'east_english_1_005', content: 'What is "猫"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'east_english_1_006', content: 'Hello! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:true},{text:'Command',isCorrect:false},{text:'Exclamation',isCorrect:false}] },
  { id: 'east_english_1_007', content: 'What color is the sky?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:true},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false}] },
  { id: 'east_english_1_008', content: '"太阳" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Moon',isCorrect:false},{text:'Star',isCorrect:false},{text:'Sun',isCorrect:true},{text:'Cloud',isCorrect:false}] },
]

// === ENGLISH D2 (30题, grade 4-5) - Sample 8题 ===
const englishD2Questions: Question[] = [
  { id: 'east_english_2_001', content: 'What is the past tense of "go"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Goed',isCorrect:false},{text:'Gone',isCorrect:false},{text:'Went',isCorrect:true},{text:'Going',isCorrect:false}] },
  { id: 'east_english_2_002', content: 'She ___ to school every day.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'go',isCorrect:false},{text:'goes',isCorrect:true},{text:'going',isCorrect:false},{text:'went',isCorrect:false}] },
  { id: 'east_english_2_003', content: 'What is the plural of "child"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Childs',isCorrect:false},{text:'Children',isCorrect:true},{text:'Childes',isCorrect:false},{text:'Child',isCorrect:false}] },
  { id: 'east_english_2_004', content: 'I have ___ apple.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:true},{text:'an',isCorrect:false},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'east_english_2_005', content: 'What time is it? 3:00', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Three o clock',isCorrect:true},{text:'Three',isCorrect:false},{text:'Three hours',isCorrect:false},{text:'Three clock',isCorrect:false}] },
  { id: 'east_english_2_006', content: 'My mother ___ cooking.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'likes',isCorrect:true},{text:'like',isCorrect:false},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
  { id: 'east_english_2_007', content: 'There ___ many books on the desk.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:false},{text:'are',isCorrect:true},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'east_english_2_008', content: 'The opposite of "hot" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'warm',isCorrect:false},{text:'cold',isCorrect:true},{text:'cool',isCorrect:false},{text:'wet',isCorrect:false}] },
]

// === ENGLISH D3 (20题, grade 6-7) - Sample 8题 ===
const englishD3Questions: Question[] = [
  { id: 'east_english_3_001', content: 'If I ___ you, I would study harder.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_002', content: 'She has ___ finished her homework.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'east_english_3_003', content: 'The book ___ by Tom.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'wrote',isCorrect:false},{text:'is written',isCorrect:true},{text:'writes',isCorrect:false},{text:'writing',isCorrect:false}] },
  { id: 'east_english_3_004', content: 'Neither you nor I ___ right.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_005', content: 'I have been learning English ___ three years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:false},{text:'for',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'east_english_3_006', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He don t know',isCorrect:false},{text:'He doesn t knows',isCorrect:false},{text:'He doesn t know',isCorrect:true},{text:'He don t knows',isCorrect:false}] },
  { id: 'east_english_3_007', content: 'The teacher asked us ___ the exercise.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'complete',isCorrect:false},{text:'to complete',isCorrect:true},{text:'completing',isCorrect:false},{text:'completed',isCorrect:false}] },
  { id: 'east_english_3_008', content: 'By the time I arrived, they ___ all the cake.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'ate',isCorrect:false},{text:'had eaten',isCorrect:true},{text:'have eaten',isCorrect:false},{text:'were eating',isCorrect:false}] },
]

// === ENGLISH D4 (8题, grade 8) - Sample 6题 ===
const englishD4Questions: Question[] = [
  { id: 'east_english_4_001', content: 'The passive voice of "They are building a house" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'A house is being built',isCorrect:true},{text:'A house is building',isCorrect:false},{text:'A house was built',isCorrect:false},{text:'A house is built',isCorrect:false}] },
  { id: 'east_english_4_002', content: 'I suggest that he ___ the doctor.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'see',isCorrect:false},{text:'to see',isCorrect:false},{text:'seeing',isCorrect:false},{text:'saw',isCorrect:false}] },
  { id: 'east_english_4_003', content: 'Which word is an adverb?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Beautiful',isCorrect:false},{text:'Quickly',isCorrect:true},{text:'Happy',isCorrect:false},{text:' Tall',isCorrect:false}] },
  { id: 'east_english_4_004', content: '___ the rain, we stayed home.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Because of',isCorrect:true},{text:'Since',isCorrect:false},{text:'As result of',isCorrect:false}] },
  { id: 'east_english_4_005', content: 'He acted ___ he had seen a ghost.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'east_english_4_006', content: 'The word "immediately" is a/an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'adjective',isCorrect:false},{text:'verb',isCorrect:false},{text:'adverb',isCorrect:true},{text:'conjunction',isCorrect:false}] },
]

// === ENGLISH D5 (2题, grade 9) - Sample 2题 ===
const englishD5Questions: Question[] = [
  { id: 'east_english_5_001', content: 'Had I known you were coming, I ___ you at the airport.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'would meet',isCorrect:false},{text:'would have met',isCorrect:true},{text:'will meet',isCorrect:false},{text:'met',isCorrect:false}] },
  { id: 'east_english_5_002', content: 'Not only ___ the award, but she also gave a speech.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'she won',isCorrect:false},{text:'did she win',isCorrect:true},{text:'won she',isCorrect:false},{text:'she did win',isCorrect:false}] },
]

// Combine all questions
export const eastQuestions: Question[] = [
  ...mathD1Questions,
  ...mathD2Questions,
  ...mathD3Questions,
  ...mathD4Questions,
  ...mathD5Questions,
  ...chineseD1Questions,
  ...chineseD2Questions,
  ...chineseD3Questions,
  ...chineseD4Questions,
  ...chineseD5Questions,
  ...englishD1Questions,
  ...englishD2Questions,
  ...englishD3Questions,
  ...englishD4Questions,
  ...englishD5Questions,
]

export const eastQuestionBank = createEastOceanQuestionBank('east', eastQuestions)