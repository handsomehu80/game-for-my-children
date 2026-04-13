import type { Question } from '../../../game/types'

// Local interface for the bank
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

function createWestOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
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

// === MATH D1 (30题, grade 1-3) - Sample 8题 ===
const mathD1Questions: Question[] = [
  { id: 'west_math_1_001', content: '10 + 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'west_math_1_002', content: '8 - 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_1_003', content: '2 × 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_004', content: '16 ÷ 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_005', content: '25 + 14 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'37',isCorrect:false},{text:'38',isCorrect:false},{text:'39',isCorrect:true},{text:'40',isCorrect:false}] },
  { id: 'west_math_1_006', content: '50 - 23 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'25',isCorrect:false},{text:'26',isCorrect:false},{text:'27',isCorrect:true},{text:'28',isCorrect:false}] },
  { id: 'west_math_1_007', content: '3 × 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'18',isCorrect:false},{text:'20',isCorrect:false},{text:'21',isCorrect:true},{text:'24',isCorrect:false}] },
  { id: 'west_math_1_008', content: '42 ÷ 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
]

// === MATH D2 (28题, grade 4-5) - Sample 8题 ===
const mathD2Questions: Question[] = [
  { id: 'west_math_2_001', content: '156 + 278 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'424',isCorrect:false},{text:'434',isCorrect:true},{text:'444',isCorrect:false},{text:'454',isCorrect:false}] },
  { id: 'west_math_2_002', content: '800 - 347 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'443',isCorrect:false},{text:'453',isCorrect:true},{text:'463',isCorrect:false},{text:'473',isCorrect:false}] },
  { id: 'west_math_2_003', content: '24 × 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'340',isCorrect:false},{text:'350',isCorrect:false},{text:'360',isCorrect:true},{text:'370',isCorrect:false}] },
  { id: 'west_math_2_004', content: '432 ÷ 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'52',isCorrect:false},{text:'53',isCorrect:false},{text:'54',isCorrect:true},{text:'55',isCorrect:false}] },
  { id: 'west_math_2_005', content: '3.5 + 2.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'5.3',isCorrect:false},{text:'6.2',isCorrect:false},{text:'6.3',isCorrect:true},{text:'7.2',isCorrect:false}] },
  { id: 'west_math_2_006', content: '7.6 - 3.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3.6',isCorrect:false},{text:'3.7',isCorrect:true},{text:'4.6',isCorrect:false},{text:'4.7',isCorrect:false}] },
  { id: 'west_math_2_007', content: '0.5 × 1.6 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'0.8',isCorrect:true},{text:'0.7',isCorrect:false},{text:'0.9',isCorrect:false},{text:'1.0',isCorrect:false}] },
  { id: 'west_math_2_008', content: '2.4 ÷ 0.6 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false},{text:'6',isCorrect:false}] },
]

// === MATH D3 (25题, grade 6-7) - Sample 8题 ===
const mathD3Questions: Question[] = [
  { id: 'west_math_3_001', content: '-12 + 5 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-17',isCorrect:false},{text:'-7',isCorrect:true},{text:'7',isCorrect:false},{text:'17',isCorrect:false}] },
  { id: 'west_math_3_002', content: '(-3) × (-4) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-12',isCorrect:false},{text:'12',isCorrect:true},{text:'-7',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_3_003', content: '5² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'10',isCorrect:false},{text:'25',isCorrect:true},{text:'52',isCorrect:false},{text:'20',isCorrect:false}] },
  { id: 'west_math_3_004', content: '√81 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'west_math_3_005', content: '2x - 4 = 10, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'west_math_3_006', content: '3(x + 2) = 21, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'west_math_3_007', content: '40% of 150 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'50',isCorrect:false},{text:'55',isCorrect:false},{text:'60',isCorrect:true},{text:'65',isCorrect:false}] },
  { id: 'west_math_3_008', content: 'π ≈ ? (取两位小数)', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3.12',isCorrect:false},{text:'3.14',isCorrect:true},{text:'3.16',isCorrect:false},{text:'3.18',isCorrect:false}] },
]

// === MATH D4 (12题, grade 8) - Sample 6题 ===
const mathD4Questions: Question[] = [
  { id: 'west_math_4_001', content: 'x² - 4 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'±1',isCorrect:false},{text:'±2',isCorrect:true},{text:'±3',isCorrect:false},{text:'±4',isCorrect:false}] },
  { id: 'west_math_4_002', content: 'y = 2x + 1, when x = 3, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'west_math_4_003', content: 'cos(0°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'-1',isCorrect:false},{text:'√2/2',isCorrect:false}] },
  { id: 'west_math_4_004', content: 'a⁴ ÷ a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a²',isCorrect:true},{text:'a⁶',isCorrect:false},{text:'a⁸',isCorrect:false},{text:'1',isCorrect:false}] },
  { id: 'west_math_4_005', content: '(x+3)(x-3) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-9',isCorrect:true},{text:'x²+9',isCorrect:false},{text:'x²-6x+9',isCorrect:false},{text:'x²+6x-9',isCorrect:false}] },
  { id: 'west_math_4_006', content: '√72 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'6√2',isCorrect:true},{text:'3√6',isCorrect:false},{text:'2√18',isCorrect:false},{text:'8√3',isCorrect:false}] },
]

// === MATH D5 (5题, grade 9) - Sample 5题 ===
const mathD5Questions: Question[] = [
  { id: 'west_math_5_001', content: 'x² + 4x + 4 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'-2',isCorrect:true},{text:'2',isCorrect:false},{text:'-4',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'west_math_5_002', content: 'd/dx (x³) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'x²',isCorrect:false},{text:'3x²',isCorrect:true},{text:'3x',isCorrect:false},{text:'x³',isCorrect:false}] },
  { id: 'west_math_5_003', content: 'log₁₀(100) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'10',isCorrect:false},{text:'100',isCorrect:false}] },
  { id: 'west_math_5_004', content: 'sin(30°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:true},{text:'1',isCorrect:false},{text:'√2/2',isCorrect:false}] },
  { id: 'west_math_5_005', content: '∫(3x²) dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'3x³ + C',isCorrect:false},{text:'x³ + C',isCorrect:true},{text:'6x + C',isCorrect:false},{text:'3x² + C',isCorrect:false}] },
]

// === CHINESE D1 (30题, grade 1-3) - Sample 8题 ===
const chineseD1Questions: Question[] = [
  { id: 'west_chinese_1_001', content: '"水"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'west_chinese_1_002', content: '"月"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'太阳',isCorrect:false},{text:'月亮',isCorrect:true},{text:'星星',isCorrect:false},{text:'云彩',isCorrect:false}] },
  { id: 'west_chinese_1_003', content: '下列哪个是动物？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'汽车',isCorrect:false},{text:'飞机',isCorrect:false},{text:'小狗',isCorrect:true},{text:'电脑',isCorrect:false}] },
  { id: 'west_chinese_1_004', content: '"大"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'小',isCorrect:true},{text:'高',isCorrect:false},{text:'长',isCorrect:false},{text:'胖',isCorrect:false}] },
  { id: 'west_chinese_1_005', content: '一周有几天？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'5天',isCorrect:false},{text:'6天',isCorrect:false},{text:'7天',isCorrect:true},{text:'8天',isCorrect:false}] },
  { id: 'west_chinese_1_006', content: '"人"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:true},{text:'3画',isCorrect:false},{text:'4画',isCorrect:false}] },
  { id: 'west_chinese_1_007', content: '哪个字是形容词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'跑',isCorrect:false},{text:'美丽',isCorrect:true},{text:'吃',isCorrect:false},{text:'想',isCorrect:false}] },
  { id: 'west_chinese_1_008', content: '"书"可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'书生',isCorrect:false},{text:'书包',isCorrect:true},{text:'书法',isCorrect:false},{text:'书架',isCorrect:false}] },
]

// === CHINESE D2 (28题, grade 4-5) - Sample 8题 ===
const chineseD2Questions: Question[] = [
  { id: 'west_chinese_2_001', content: '《春晓》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'孟浩然',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_2_002', content: '"画蛇添足"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'做事要勇敢',isCorrect:false},{text:'多此一举反而弄巧成拙',isCorrect:true},{text:'要善于观察',isCorrect:false},{text:'团结合作很重要',isCorrect:false}] },
  { id: 'west_chinese_2_003', content: '下列哪个是褒义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'狡猾',isCorrect:false},{text:'虚伪',isCorrect:false},{text:'诚实',isCorrect:true},{text:'自私',isCorrect:false}] },
  { id: 'west_chinese_2_004', content: '"学而时习之"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'不亦说乎',isCorrect:true},{text:'温故知新',isCorrect:false},{text:'学而不厌',isCorrect:false},{text:'三人行必有我师',isCorrect:false}] },
  { id: 'west_chinese_2_005', content: '《三国演义》中诸葛亮是谁的军师？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'曹操',isCorrect:false},{text:'孙权',isCorrect:false},{text:'刘备',isCorrect:true},{text:'周瑜',isCorrect:false}] },
  { id: 'west_chinese_2_006', content: '"凸"字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:true},{text:'6画',isCorrect:false},{text:'7画',isCorrect:false}] },
  { id: 'west_chinese_2_007', content: '下列哪个不是唐诗？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'静夜思',isCorrect:false},{text:'春望',isCorrect:false},{text:'水调歌头',isCorrect:true},{text:'登鹳雀楼',isCorrect:false}] },
  { id: 'west_chinese_2_008', content: '"亡羊补牢"属于哪种修辞手法？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
]

// === CHINESE D3 (25题, grade 6-7) - Sample 8题 ===
const chineseD3Questions: Question[] = [
  { id: 'west_chinese_3_001', content: '《茅屋为秋风所破歌》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:true},{text:'白居易',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_3_002', content: '"出淤泥而不染"赞美的是哪种花？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'菊花',isCorrect:false},{text:'梅花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'牡丹',isCorrect:false}] },
  { id: 'west_chinese_3_003', content: '下列哪个是元曲？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'登鹳雀楼',isCorrect:false},{text:'春晓',isCorrect:false},{text:'天净沙·秋思',isCorrect:true},{text:'静夜思',isCorrect:false}] },
  { id: 'west_chinese_3_004', content: '"人生自古谁无死"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'留取丹心照汗青',isCorrect:true},{text:'天下兴亡匹夫有责',isCorrect:false},{text:'苟利国家生死以',isCorrect:false},{text:'山河破碎风飘絮',isCorrect:false}] },
  { id: 'west_chinese_3_005', content: '《背影》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'west_chinese_3_006', content: '"己所不欲，勿施于人"出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'west_chinese_3_007', content: '下列哪个是老舍的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'骆驼祥子',isCorrect:true},{text:'朝花夕拾',isCorrect:false},{text:'茶馆',isCorrect:false},{text:'四世同堂',isCorrect:false}] },
  { id: 'west_chinese_3_008', content: '"山重水复疑无路"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'柳暗花明又一村',isCorrect:true},{text:'桃花源里可耕田',isCorrect:false},{text:'春风得意马蹄疾',isCorrect:false},{text:'千树万树梨花开',isCorrect:false}] },
]

// === CHINESE D4 (12题, grade 8) - Sample 6题 ===
const chineseD4Questions: Question[] = [
  { id: 'west_chinese_4_001', content: '《聊斋志异》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:false},{text:'吴承恩',isCorrect:false},{text:'蒲松龄',isCorrect:true},{text:'罗贯中',isCorrect:false}] },
  { id: 'west_chinese_4_002', content: '"富贵不能淫"下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'贫贱不能移',isCorrect:false},{text:'贫贱不能移，威武不能屈',isCorrect:true},{text:'威武不能屈',isCorrect:false},{text:'此之谓大丈夫',isCorrect:false}] },
  { id: 'west_chinese_4_003', content: '下列哪个是清代小说？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《三国演义》',isCorrect:false},{text:'《水浒传》',isCorrect:false},{text:'《红楼梦》',isCorrect:true},{text:'《西游记》',isCorrect:false}] },
  { id: 'west_chinese_4_004', content: '"天人合一"是哪个学派的思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:true},{text:'儒家',isCorrect:false},{text:'法家',isCorrect:false},{text:'墨家',isCorrect:false}] },
  { id: 'west_chinese_4_005', content: '《诗经》共有多少篇？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'305篇',isCorrect:true},{text:'311篇',isCorrect:false},{text:'300篇',isCorrect:false},{text:'315篇',isCorrect:false}] },
  { id: 'west_chinese_4_006', content: '"杯弓蛇影"形容的是什么？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'美味佳肴',isCorrect:false},{text:'疑神疑鬼',isCorrect:true},{text:'技艺高超',isCorrect:false},{text:'文学才华',isCorrect:false}] },
]

// === CHINESE D5 (5题, grade 9) - Sample 5题 ===
const chineseD5Questions: Question[] = [
  { id: 'west_chinese_5_001', content: '"路漫漫其修远兮"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'吾将上下而求索',isCorrect:true},{text:'虽九死其犹未悔',isCorrect:false},{text:'长太息以掩涕兮',isCorrect:false},{text:'哀民生之多艰',isCorrect:false}] },
  { id: 'west_chinese_5_002', content: '《梦溪笔谈》的作者是谁？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'徐光启',isCorrect:false},{text:'沈括',isCorrect:true},{text:'宋应星',isCorrect:false},{text:'李时珍',isCorrect:false}] },
  { id: 'west_chinese_5_003', content: '王国维《人间词话》中提到的"第三境界"是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'昨夜西风凋碧树',isCorrect:false},{text:'衣带渐宽终不悔',isCorrect:false},{text:'众里寻他千百度',isCorrect:true},{text:'那人却在灯火阑珊处',isCorrect:false}] },
  { id: 'west_chinese_5_004', content: '《太平广记》是什么类型的书？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'历史书',isCorrect:false},{text:'小说总集',isCorrect:true},{text:'哲学书',isCorrect:false},{text:'医学书',isCorrect:false}] },
  { id: 'west_chinese_5_005', content: '"茕茕孑立"出自哪篇文章？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'《出师表》',isCorrect:true},{text:'《陈情表》',isCorrect:false},{text:'《祭十二郎文》',isCorrect:false},{text:'《赤壁赋》',isCorrect:false}] },
]

// === ENGLISH D1 (30题, grade 1-3) - Sample 8题 ===
const englishD1Questions: Question[] = [
  { id: 'west_english_1_001', content: 'What is "书" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Pen',isCorrect:false},{text:'Book',isCorrect:true},{text:'Bag',isCorrect:false},{text:'Desk',isCorrect:false}] },
  { id: 'west_english_1_002', content: 'How do you spell "cat"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'c-a-t',isCorrect:true},{text:'k-a-t',isCorrect:false},{text:'c-o-t',isCorrect:false},{text:'c-e-t',isCorrect:false}] },
  { id: 'west_english_1_003', content: '"黄色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:true},{text:'Purple',isCorrect:false}] },
  { id: 'west_english_1_004', content: 'What number is "8"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Six',isCorrect:false},{text:'Seven',isCorrect:false},{text:'Eight',isCorrect:true},{text:'Nine',isCorrect:false}] },
  { id: 'west_english_1_005', content: 'What is "狗"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'west_english_1_006', content: 'Good morning! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:true},{text:'Command',isCorrect:false},{text:'Goodbye',isCorrect:false}] },
  { id: 'west_english_1_007', content: 'What color is grass?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:false},{text:'Green',isCorrect:true},{text:'Yellow',isCorrect:false}] },
  { id: 'west_english_1_008', content: '"月亮" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Star',isCorrect:false},{text:'Moon',isCorrect:true},{text:'Cloud',isCorrect:false}] },
]

// === ENGLISH D2 (28题, grade 4-5) - Sample 8题 ===
const englishD2Questions: Question[] = [
  { id: 'west_english_2_001', content: 'What is the past tense of "eat"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Eated',isCorrect:false},{text:'Ate',isCorrect:true},{text:'Eaten',isCorrect:false},{text:'Eating',isCorrect:false}] },
  { id: 'west_english_2_002', content: 'He ___ football every Sunday.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'play',isCorrect:false},{text:'plays',isCorrect:true},{text:'playing',isCorrect:false},{text:'played',isCorrect:false}] },
  { id: 'west_english_2_003', content: 'What is the plural of "mouse"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Mouses',isCorrect:false},{text:'Mice',isCorrect:true},{text:'Mouse',isCorrect:false},{text:'Miesel',isCorrect:false}] },
  { id: 'west_english_2_004', content: 'I saw ___ elephant at the zoo.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'west_english_2_005', content: 'What time is it? 5:00', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Five o clock',isCorrect:true},{text:'Five',isCorrect:false},{text:'Five hours',isCorrect:false},{text:'Five clock',isCorrect:false}] },
  { id: 'west_english_2_006', content: 'My father ___ reading newspapers.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'likes',isCorrect:true},{text:'like',isCorrect:false},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
  { id: 'west_english_2_007', content: 'There ___ a lot of milk in the fridge.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_2_008', content: 'The opposite of "easy" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'simple',isCorrect:false},{text:'hard',isCorrect:true},{text:'difficult',isCorrect:false},{text:'both B and C',isCorrect:false}] },
]

// === ENGLISH D3 (25题, grade 6-7) - Sample 8题 ===
const englishD3Questions: Question[] = [
  { id: 'west_english_3_001', content: 'If I ___ you, I would accept the offer.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'west_english_3_002', content: 'She has ___ finished her project.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'west_english_3_003', content: 'The song ___ by the famous singer.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'sang',isCorrect:false},{text:'is sung',isCorrect:true},{text:'sings',isCorrect:false},{text:'singing',isCorrect:false}] },
  { id: 'west_english_3_004', content: 'Either you or I ___ responsible.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'west_english_3_005', content: 'I have been waiting for ___ two hours.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:false},{text:'for',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'west_english_3_006', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He don t understand',isCorrect:false},{text:'He doesn t understands',isCorrect:false},{text:'He doesn t understand',isCorrect:true},{text:'He don t understands',isCorrect:false}] },
  { id: 'west_english_3_007', content: 'The teacher told us ___ quietly.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'sit',isCorrect:false},{text:'to sit',isCorrect:true},{text:'sitting',isCorrect:false},{text:'sat',isCorrect:false}] },
  { id: 'west_english_3_008', content: 'By the time we arrived, the movie ___', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'started',isCorrect:false},{text:'had started',isCorrect:true},{text:'has started',isCorrect:false},{text:'was starting',isCorrect:false}] },
]

// === ENGLISH D4 (12题, grade 8) - Sample 6题 ===
const englishD4Questions: Question[] = [
  { id: 'west_english_4_001', content: 'The passive voice of "They built this house" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'This house is built',isCorrect:true},{text:'This house was built',isCorrect:false},{text:'This house is building',isCorrect:false},{text:'This house was building',isCorrect:false}] },
  { id: 'west_english_4_002', content: 'I insist that he ___ immediately.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'leave',isCorrect:true},{text:'to leave',isCorrect:false},{text:'leaving',isCorrect:false},{text:'left',isCorrect:false}] },
  { id: 'west_english_4_003', content: 'Which word is a preposition?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Under',isCorrect:true},{text:'Run',isCorrect:false}] },
  { id: 'west_english_4_004', content: '___ the noise, we could not sleep.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Because of',isCorrect:true},{text:'Since',isCorrect:false},{text:'As result',isCorrect:false}] },
  { id: 'west_english_4_005', content: 'He spoke ___ he knew everything.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'west_english_4_006', content: 'The word "responsibility" is a/an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'adjective',isCorrect:false},{text:'verb',isCorrect:false},{text:'noun',isCorrect:true},{text:'adverb',isCorrect:false}] },
]

// === ENGLISH D5 (5题, grade 9) - Sample 5题 ===
const englishD5Questions: Question[] = [
  { id: 'west_english_5_001', content: 'Had I known about the traffic, I ___ earlier.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'would leave',isCorrect:false},{text:'would have left',isCorrect:true},{text:'will leave',isCorrect:false},{text:'left',isCorrect:false}] },
  { id: 'west_english_5_002', content: 'Not only ___ the game, but she also won the trophy.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'she won',isCorrect:false},{text:'did she win',isCorrect:true},{text:'won she',isCorrect:false},{text:'she did win',isCorrect:false}] },
  { id: 'west_english_5_003', content: 'I would have succeeded ___ your help.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'but for',isCorrect:true},{text:'despite',isCorrect:false},{text:'without',isCorrect:false},{text:'if not for',isCorrect:false}] },
  { id: 'west_english_5_004', content: '___ hard, you would have passed.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'Study',isCorrect:false},{text:'Studied',isCorrect:false},{text:'Had you studied',isCorrect:true},{text:'If you studied',isCorrect:false}] },
  { id: 'west_english_5_005', content: 'The building ___ when the earthquake struck.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'was being built',isCorrect:true},{text:'was built',isCorrect:false},{text:'is built',isCorrect:false},{text:'has been built',isCorrect:false}] },
]

// === SCIENCE D1 (30题, grade 1-3) - Sample 8题 ===
const scienceD1Questions: Question[] = [
  { id: 'west_science_1_001', content: '水在什么温度会变成冰？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:true},{text:'100°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'-10°C',isCorrect:false}] },
  { id: 'west_science_1_002', content: '太阳从哪边升起？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'西边',isCorrect:false},{text:'东边',isCorrect:true},{text:'南边',isCorrect:false},{text:'北边',isCorrect:false}] },
  { id: 'west_science_1_003', content: '人体最大的器官是？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'心脏',isCorrect:false},{text:'大脑',isCorrect:false},{text:'皮肤',isCorrect:true},{text:'肝脏',isCorrect:false}] },
  { id: 'west_science_1_004', content: '植物需要什么才能生长？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'水和阳光',isCorrect:true},{text:'土壤和石头',isCorrect:false},{text:'空气和风',isCorrect:false},{text:'温度和冰',isCorrect:false}] },
  { id: 'west_science_1_005', content: '月亮会发光吗？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'会',isCorrect:false},{text:'不会，它反射太阳光',isCorrect:true},{text:'会发出蓝光',isCorrect:false},{text:'只在晚上发光',isCorrect:false}] },
  { id: 'west_science_1_006', content: '水的三种形态是？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'固体、液体、气体',isCorrect:true},{text:'水、冰、蒸汽',isCorrect:false},{text:'雨、雪、冰',isCorrect:false},{text:'河流、海洋、湖泊',isCorrect:false}] },
  { id: 'west_science_1_007', content: '什么动物会飞？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'狗',isCorrect:false},{text:'鸟',isCorrect:true},{text:'鱼',isCorrect:false},{text:'猫',isCorrect:false}] },
  { id: 'west_science_1_008', content: '地球的形状像什么？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'正方形',isCorrect:false},{text:'圆形',isCorrect:false},{text:'球形',isCorrect:true},{text:'三角形',isCorrect:false}] },
]

// === SCIENCE D2 (28题, grade 4-5) - Sample 8题 ===
const scienceD2Questions: Question[] = [
  { id: 'west_science_2_001', content: '植物的光合作用需要什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'阳光、水、二氧化碳',isCorrect:true},{text:'阳光、水、氧气',isCorrect:false},{text:'水、土壤、阳光',isCorrect:false},{text:'二氧化碳、土壤、水',isCorrect:false}] },
  { id: 'west_science_2_002', content: '人体的血液是怎么循环的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'从心脏到肺再到全身',isCorrect:false},{text:'从心脏到全身再到肺然后回心脏',isCorrect:true},{text:'从肺到全身再到心脏',isCorrect:false},{text:'从全身到心脏再到肺',isCorrect:false}] },
  { id: 'west_science_2_003', content: '声音是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'通过空气振动',isCorrect:true},{text:'通过光线',isCorrect:false},{text:'通过水',isCorrect:false},{text:'通过固体',isCorrect:false}] },
  { id: 'west_science_2_004', content: '什么是动物的冬眠？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在冬天睡觉',isCorrect:true},{text:'动物在冬天吃东西',isCorrect:false},{text:'动物在冬天繁殖',isCorrect:false},{text:'动物在冬天迁徙',isCorrect:false}] },
  { id: 'west_science_2_005', content: '电路的基本组成部分是？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'电源、导线、开关',isCorrect:true},{text:'灯泡、电池、插座',isCorrect:false},{text:'电线、灯泡、墙壁',isCorrect:false},{text:'开关、电池、电动机',isCorrect:false}] },
  { id: 'west_science_2_006', content: '水的循环包括哪三个过程？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'蒸发、凝结、降水',isCorrect:true},{text:'融化、凝固、蒸发',isCorrect:false},{text:'蒸发、凝固、降水',isCorrect:false},{text:'凝结、融化、降水',isCorrect:false}] },
  { id: 'west_science_2_007', content: '磁铁能吸引什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'铜',isCorrect:false},{text:'铝',isCorrect:false},{text:'铁',isCorrect:true},{text:'锌',isCorrect:false}] },
  { id: 'west_science_2_008', content: '地球的自转导致什么现象？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'四季变化',isCorrect:false},{text:'昼夜交替',isCorrect:true},{text:'潮汐变化',isCorrect:false},{text:'气候变化',isCorrect:false}] },
]

// === SCIENCE D3 (25题, grade 6-7) - Sample 8题 ===
const scienceD3Questions: Question[] = [
  { id: 'west_science_3_001', content: '细胞的基本结构包括？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'细胞壁、细胞膜、细胞核',isCorrect:true},{text:'细胞膜、细胞质、叶绿体',isCorrect:false},{text:'细胞核、线粒体、叶绿体',isCorrect:false},{text:'细胞壁、细胞质、线粒体',isCorrect:false}] },
  { id: 'west_science_3_002', content: '光的折射发生在什么情况下？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光从空气进入水或玻璃时',isCorrect:true},{text:'光在空气中传播时',isCorrect:false},{text:'光被镜子反射时',isCorrect:false},{text:'光穿过真空时',isCorrect:false}] },
  { id: 'west_science_3_003', content: '地球公转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一天',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一年',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'west_science_3_004', content: '什么是新陈代谢？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'生物体内化学反应的总和',isCorrect:true},{text:'细胞的分裂过程',isCorrect:false},{text:'能量转换的过程',isCorrect:false},{text:'营养物质的吸收',isCorrect:false}] },
  { id: 'west_science_3_005', content: '力的三要素是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'大小、方向、作用点',isCorrect:true},{text:'质量、速度、加速度',isCorrect:false},{text:'长度、宽度、高度',isCorrect:false},{text:'重力、摩擦力、弹力',isCorrect:false}] },
  { id: 'west_science_3_006', content: '什么是消化系统的主要功能？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'分解食物并吸收营养',isCorrect:true},{text:'运输氧气',isCorrect:false},{text:'排出废物',isCorrect:false},{text:'调节体温',isCorrect:false}] },
  { id: 'west_science_3_007', content: '大气层的主要成分是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'氮气和氧气',isCorrect:true},{text:'氧气和二氧化碳',isCorrect:false},{text:'氮气和二氧化碳',isCorrect:false},{text:'氢气和氧气',isCorrect:false}] },
  { id: 'west_science_3_008', content: '什么是反射定律？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'入射角与反射角互补',isCorrect:false}] },
]

// === SCIENCE D4 (12题, grade 8) - Sample 6题 ===
const scienceD4Questions: Question[] = [
  { id: 'west_science_4_001', content: '欧姆定律的公式是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'V = IR',isCorrect:true},{text:'V = I/R',isCorrect:false},{text:'V = R/I',isCorrect:false},{text:'V = I + R',isCorrect:false}] },
  { id: 'west_science_4_002', content: '加速度的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'m/s',isCorrect:false},{text:'m/s²',isCorrect:true},{text:'kg·m/s',isCorrect:false},{text:'N/kg',isCorrect:false}] },
  { id: 'west_science_4_003', content: 'DNA的中文名称是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'核糖核酸',isCorrect:false},{text:'脱氧核糖核酸',isCorrect:true},{text:'蛋白质',isCorrect:false},{text:'氨基酸',isCorrect:false}] },
  { id: 'west_science_4_004', content: '地球内部结构包括？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地壳、地幔、地核',isCorrect:true},{text:'地壳、地核、海洋',isCorrect:false},{text:'地幔、外核、内核',isCorrect:false},{text:'大陆、海洋、地核',isCorrect:false}] },
  { id: 'west_science_4_005', content: '什么是能量守恒定律？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'能量不会消失也不会创造，只能转换',isCorrect:true},{text:'能量可以创造也可以消失',isCorrect:false},{text:'能量在封闭系统中会减少',isCorrect:false},{text:'能量在开放系统中会减少',isCorrect:false}] },
  { id: 'west_science_4_006', content: '遗传的基本单位是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'染色体',isCorrect:false},{text:'基因',isCorrect:true},{text:'DNA',isCorrect:false},{text:'细胞',isCorrect:false}] },
]

// === SCIENCE D5 (5题, grade 9) - Sample 5题 ===
const scienceD5Questions: Question[] = [
  { id: 'west_science_5_001', content: '相对论是谁提出的？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'牛顿',isCorrect:false},{text:'爱因斯坦',isCorrect:true},{text:'伽利略',isCorrect:false},{text:'霍金',isCorrect:false}] },
  { id: 'west_science_5_002', content: 'E = mc² 是什么方程？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'质能方程',isCorrect:true},{text:'运动方程',isCorrect:false},{text:'电磁方程',isCorrect:false},{text:'热力学方程',isCorrect:false}] },
  { id: 'west_science_5_003', content: '量子力学研究的对象是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'宏观物体',isCorrect:false},{text:'微观粒子',isCorrect:true},{text:'天体运动',isCorrect:false},{text:'化学反应',isCorrect:false}] },
  { id: 'west_science_5_004', content: '宇宙大爆炸理论认为宇宙的年龄大约是多少？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'几十亿年',isCorrect:false},{text:'几百亿年',isCorrect:false},{text:'138亿年',isCorrect:true},{text:'数千亿年',isCorrect:false}] },
  { id: 'west_science_5_005', content: '什么是暗物质？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'看不见的物质',isCorrect:false},{text:'不发光但有引力的未知物质',isCorrect:true},{text:'黑洞中的物质',isCorrect:false},{text:'宇宙尘埃',isCorrect:false}] },
]

// Combine all questions
export const westQuestions: Question[] = [
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
  ...scienceD1Questions,
  ...scienceD2Questions,
  ...scienceD3Questions,
  ...scienceD4Questions,
  ...scienceD5Questions,
]

export const westQuestionBank = createWestOceanQuestionBank('west', westQuestions)