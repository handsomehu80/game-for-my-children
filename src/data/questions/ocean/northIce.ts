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

function createNorthIceOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
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

// === MATH D1 (10题, grade 1-3) - Sample 6题 ===
const mathD1Questions: Question[] = [
  { id: 'northIce_math_1_001', content: '4 + 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'northIce_math_1_002', content: '9 - 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false},{text:'6',isCorrect:false}] },
  { id: 'northIce_math_1_003', content: '2 × 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'northIce_math_1_004', content: '12 ÷ 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'northIce_math_1_005', content: '34 + 25 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'58',isCorrect:false},{text:'59',isCorrect:true},{text:'60',isCorrect:false},{text:'61',isCorrect:false}] },
  { id: 'northIce_math_1_006', content: '78 - 43 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'33',isCorrect:false},{text:'34',isCorrect:false},{text:'35',isCorrect:true},{text:'36',isCorrect:false}] },
]

// === MATH D2 (18题, grade 4-5) - Sample 8题 ===
const mathD2Questions: Question[] = [
  { id: 'northIce_math_2_001', content: '178 + 267 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'435',isCorrect:false},{text:'445',isCorrect:true},{text:'455',isCorrect:false},{text:'465',isCorrect:false}] },
  { id: 'northIce_math_2_002', content: '956 - 389 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'557',isCorrect:false},{text:'567',isCorrect:true},{text:'577',isCorrect:false},{text:'587',isCorrect:false}] },
  { id: 'northIce_math_2_003', content: '48 × 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'566',isCorrect:false},{text:'576',isCorrect:true},{text:'586',isCorrect:false},{text:'596',isCorrect:false}] },
  { id: 'northIce_math_2_004', content: '576 ÷ 18 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'30',isCorrect:false},{text:'31',isCorrect:false},{text:'32',isCorrect:true},{text:'33',isCorrect:false}] },
  { id: 'northIce_math_2_005', content: '5.6 + 3.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'9.2',isCorrect:false},{text:'9.3',isCorrect:false},{text:'9.4',isCorrect:true},{text:'9.5',isCorrect:false}] },
  { id: 'northIce_math_2_006', content: '8.7 - 4.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3.6',isCorrect:false},{text:'3.7',isCorrect:false},{text:'3.8',isCorrect:true},{text:'4.8',isCorrect:false}] },
  { id: 'northIce_math_2_007', content: '1.5 × 0.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'1.0',isCorrect:false},{text:'1.1',isCorrect:false},{text:'1.2',isCorrect:true},{text:'1.3',isCorrect:false}] },
  { id: 'northIce_math_2_008', content: '7.2 ÷ 0.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D3 (30题, grade 6-7) - Sample 8题 ===
const mathD3Questions: Question[] = [
  { id: 'northIce_math_3_001', content: '-15 + 7 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-22',isCorrect:false},{text:'-8',isCorrect:true},{text:'8',isCorrect:false},{text:'22',isCorrect:false}] },
  { id: 'northIce_math_3_002', content: '(-4) × (-7) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-28',isCorrect:false},{text:'28',isCorrect:true},{text:'-11',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'northIce_math_3_003', content: '4³ = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'12',isCorrect:false},{text:'64',isCorrect:true},{text:'81',isCorrect:false},{text:'48',isCorrect:false}] },
  { id: 'northIce_math_3_004', content: '∛8 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'northIce_math_3_005', content: '4x + 9 = 29, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'northIce_math_3_006', content: '3(x + 4) = 27, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'northIce_math_3_007', content: '75% of 400 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'280',isCorrect:false},{text:'290',isCorrect:false},{text:'300',isCorrect:true},{text:'310',isCorrect:false}] },
  { id: 'northIce_math_3_008', content: '√196 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'12',isCorrect:false},{text:'13',isCorrect:false},{text:'14',isCorrect:true},{text:'15',isCorrect:false}] },
]

// === MATH D4 (27题, grade 8) - Sample 8题 ===
const mathD4Questions: Question[] = [
  { id: 'northIce_math_4_001', content: 'x² - 7x + 12 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'2, 6',isCorrect:false},{text:'3, 4',isCorrect:true},{text:'-3, -4',isCorrect:false},{text:'-2, -6',isCorrect:false}] },
  { id: 'northIce_math_4_002', content: 'y = -2x + 5, when x = -1, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'3',isCorrect:false},{text:'5',isCorrect:false},{text:'7',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'northIce_math_4_003', content: 'sin(45°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'√2/2',isCorrect:true},{text:'√3/2',isCorrect:false}] },
  { id: 'northIce_math_4_004', content: 'a⁵ ÷ a³ = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a²',isCorrect:true},{text:'a⁸',isCorrect:false},{text:'a¹⁵',isCorrect:false},{text:'1',isCorrect:false}] },
  { id: 'northIce_math_4_005', content: '(x+5)(x-5) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-25',isCorrect:true},{text:'x²+25',isCorrect:false},{text:'x²-10x+25',isCorrect:false},{text:'x²+10x-25',isCorrect:false}] },
  { id: 'northIce_math_4_006', content: '√75 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5√3',isCorrect:true},{text:'3√5',isCorrect:false},{text:'5√5',isCorrect:false},{text:'3√3',isCorrect:false}] },
  { id: 'northIce_math_4_007', content: '如果一次函数的斜率是2，截距是-3，函数是？', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'y = 2x - 3',isCorrect:true},{text:'y = -2x + 3',isCorrect:false},{text:'y = 2x + 3',isCorrect:false},{text:'y = -2x - 3',isCorrect:false}] },
  { id: 'northIce_math_4_008', content: 'cos(30°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'√2/2',isCorrect:false},{text:'√3/2',isCorrect:true}] },
]

// === MATH D5 (15题, grade 9) - Sample 8题 ===
const mathD5Questions: Question[] = [
  { id: 'northIce_math_5_001', content: 'x² + 6x + 9 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'-3',isCorrect:true},{text:'3',isCorrect:false},{text:'-9',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'northIce_math_5_002', content: 'd/dx (x⁴) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'x³',isCorrect:false},{text:'4x³',isCorrect:true},{text:'4x⁴',isCorrect:false},{text:'x⁵',isCorrect:false}] },
  { id: 'northIce_math_5_003', content: 'log₃(27) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'northIce_math_5_004', content: 'tan(60°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:false},{text:'√3',isCorrect:true}] },
  { id: 'northIce_math_5_005', content: '∫(2x) dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'2x² + C',isCorrect:false},{text:'x² + C',isCorrect:true},{text:'x + C',isCorrect:false},{text:'2 + C',isCorrect:false}] },
  { id: 'northIce_math_5_006', content: 'If cos(θ) = √3/2, θ = ? (0° < θ < 90°)', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'30°',isCorrect:true},{text:'45°',isCorrect:false},{text:'60°',isCorrect:false},{text:'90°',isCorrect:false}] },
  { id: 'northIce_math_5_007', content: 'ln(1) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:true},{text:'1',isCorrect:false},{text:'e',isCorrect:false},{text:'∞',isCorrect:false}] },
  { id: 'northIce_math_5_008', content: '如果函数f(x) = 2x + 1，则f(3) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
]

// === CHINESE D1 (10题, grade 1-3) - Sample 6题 ===
const chineseD1Questions: Question[] = [
  { id: 'northIce_chinese_1_001', content: '"木"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'northIce_chinese_1_002', content: '"风"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'雨',isCorrect:false},{text:'风',isCorrect:true},{text:'云',isCorrect:false},{text:'雷',isCorrect:false}] },
  { id: 'northIce_chinese_1_003', content: '下列哪个是学习用品？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'橡皮',isCorrect:true},{text:'苹果',isCorrect:false},{text:'小狗',isCorrect:false},{text:'汽车',isCorrect:false}] },
  { id: 'northIce_chinese_1_004', content: '"多"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'少',isCorrect:true},{text:'大',isCorrect:false},{text:'高',isCorrect:false},{text:'长',isCorrect:false}] },
  { id: 'northIce_chinese_1_005', content: '人民币有几种面值？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'5种',isCorrect:false},{text:'6种',isCorrect:false},{text:'7种',isCorrect:true},{text:'8种',isCorrect:false}] },
  { id: 'northIce_chinese_1_006', content: '"土"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
]

// === CHINESE D2 (18题, grade 4-5) - Sample 8题 ===
const chineseD2Questions: Question[] = [
  { id: 'northIce_chinese_2_001', content: '《咏鹅》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'骆宾王',isCorrect:true},{text:'李峤',isCorrect:false},{text:'王勃',isCorrect:false},{text:'杨炯',isCorrect:false}] },
  { id: 'northIce_chinese_2_002', content: '《草》这首诗的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'白居易',isCorrect:true},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false},{text:'李商隐',isCorrect:false}] },
  { id: 'northIce_chinese_2_003', content: '下列哪个是形声字？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'人',isCorrect:false},{text:'日',isCorrect:false},{text:'河',isCorrect:true},{text:'上',isCorrect:false}] },
  { id: 'northIce_chinese_2_004', content: '《游子吟》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'李白',isCorrect:false},{text:'孟郊',isCorrect:true},{text:'贾岛',isCorrect:false},{text:'韩愈',isCorrect:false}] },
  { id: 'northIce_chinese_2_005', content: '"春眠不觉晓"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'处处闻啼鸟',isCorrect:true},{text:'夜来风雨声',isCorrect:false},{text:'花落知多少',isCorrect:false},{text:'当春乃发生',isCorrect:false}] },
  { id: 'northIce_chinese_2_006', content: '下列哪个不是唐宋八大家？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'李白',isCorrect:true},{text:'韩愈',isCorrect:false},{text:'柳宗元',isCorrect:false},{text:'欧阳修',isCorrect:false}] },
  { id: 'northIce_chinese_2_007', content: '"孤帆远影碧空尽"下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'唯见长江天际流',isCorrect:true},{text:'不及汪伦送我情',isCorrect:false},{text:'西出阳关无故人',isCorrect:false},{text:'黄河入海流',isCorrect:false}] },
  { id: 'northIce_chinese_2_008', content: '"举头望明月"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'低头思故乡',isCorrect:true},{text:'千里共婵娟',isCorrect:false},{text:'月是故乡明',isCorrect:false},{text:'月落乌啼霜满天',isCorrect:false}] },
]

// === CHINESE D3 (30题, grade 6-7) - Sample 8题 ===
const chineseD3Questions: Question[] = [
  { id: 'northIce_chinese_3_001', content: '《渡荆门送别》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'李白',isCorrect:true},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false},{text:'孟浩然',isCorrect:false}] },
  { id: 'northIce_chinese_3_002', content: '《登飞来峰》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'王安石',isCorrect:true},{text:'苏轼',isCorrect:false},{text:'辛弃疾',isCorrect:false},{text:'陆游',isCorrect:false}] },
  { id: 'northIce_chinese_3_003', content: '下列哪个是送别诗？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'《黄鹤楼送孟浩然之广陵》',isCorrect:true},{text:'《登鹳雀楼》',isCorrect:false},{text:'《静夜思》',isCorrect:false},{text:'《春晓》',isCorrect:false}] },
  { id: 'northIce_chinese_3_004', content: '"山重水复疑无路"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'柳暗花明又一村',isCorrect:true},{text:'桃花源里可耕田',isCorrect:false},{text:'春风得意马蹄疾',isCorrect:false},{text:'千树万树梨花开',isCorrect:false}] },
  { id: 'northIce_chinese_3_005', content: '《卖油翁》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'欧阳修',isCorrect:true},{text:'苏轼',isCorrect:false},{text:'王安石',isCorrect:false},{text:'曾巩',isCorrect:false}] },
  { id: 'northIce_chinese_3_006', content: '"出淤泥而不染"赞美的是哪种花？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'菊花',isCorrect:false},{text:'梅花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'牡丹',isCorrect:false}] },
  { id: 'northIce_chinese_3_007', content: '《孔乙己》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:true},{text:'朱自清',isCorrect:false},{text:'老舍',isCorrect:false},{text:'冰心',isCorrect:false}] },
  { id: 'northIce_chinese_3_008', content: '"不知天上宫阙"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'我欲乘风归去',isCorrect:true},{text:'起舞弄清影',isCorrect:false},{text:'何似在人间',isCorrect:false},{text:'转朱阁低绮户',isCorrect:false}] },
]

// === CHINESE D4 (27题, grade 8) - Sample 8题 ===
const chineseD4Questions: Question[] = [
  { id: 'northIce_chinese_4_001', content: '《儒林外史》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'吴敬梓',isCorrect:true},{text:'曹雪芹',isCorrect:false},{text:'蒲松龄',isCorrect:false},{text:'罗贯中',isCorrect:false}] },
  { id: 'northIce_chinese_4_002', content: '"十年树木，百年树人"出自哪里？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《管子》',isCorrect:true},{text:'《论语》',isCorrect:false},{text:'《孟子》',isCorrect:false},{text:'《大学》',isCorrect:false}] },
  { id: 'northIce_chinese_4_003', content: '下列哪个是明代小说？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《西游记》',isCorrect:true},{text:'《红楼梦》',isCorrect:false},{text:'《聊斋志异》',isCorrect:false},{text:'《儒林外史》',isCorrect:false}] },
  { id: 'northIce_chinese_4_004', content: '"己所不欲，勿施于人"体现哪种思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:false},{text:'儒家',isCorrect:true},{text:'法家',isCorrect:false},{text:'墨家',isCorrect:false}] },
  { id: 'northIce_chinese_4_005', content: '《庄子》又称什么？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《南华经》',isCorrect:true},{text:'《道德经》',isCorrect:false},{text:'《逍遥游》',isCorrect:false},{text:'《齐物论》',isCorrect:false}] },
  { id: 'northIce_chinese_4_006', content: '《史记》的体裁是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'纪传体',isCorrect:true},{text:'编年体',isCorrect:false},{text:'国别体',isCorrect:false},{text:'纪事本末体',isCorrect:false}] },
  { id: 'northIce_chinese_4_007', content: '《出塞》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'王昌龄',isCorrect:true},{text:'王之涣',isCorrect:false},{text:'高适',isCorrect:false},{text:'岑参',isCorrect:false}] },
  { id: 'northIce_chinese_4_008', content: '古代六艺包括礼、乐、射、御、书和？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'数',isCorrect:true},{text:'诗',isCorrect:false},{text:'画',isCorrect:false},{text:'棋',isCorrect:false}] },
]

// === CHINESE D5 (15题, grade 9) - Sample 8题 ===
const chineseD5Questions: Question[] = [
  { id: 'northIce_chinese_5_001', content: '《二十四诗品》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'司空图',isCorrect:true},{text:'皎然',isCorrect:false},{text:'白居易',isCorrect:false},{text:'刘勰',isCorrect:false}] },
  { id: 'northIce_chinese_5_002', content: '王国维认为"古今之成大事业者"必须经过三种境界，其中第二种境界是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'昨夜西风凋碧树',isCorrect:false},{text:'衣带渐宽终不悔',isCorrect:true},{text:'众里寻他千百度',isCorrect:false},{text:'那人却在灯火阑珊处',isCorrect:false}] },
  { id: 'northIce_chinese_5_003', content: '《文心雕龙》的成书年代是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'南朝梁',isCorrect:true},{text:'南朝宋',isCorrect:false},{text:'北朝魏',isCorrect:false},{text:'唐朝',isCorrect:false}] },
  { id: 'northIce_chinese_5_004', content: '"路漫漫其修远兮"下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'吾将上下而求索',isCorrect:true},{text:'虽九死其犹未悔',isCorrect:false},{text:'长太息以掩涕兮',isCorrect:false},{text:'哀民生之多艰',isCorrect:false}] },
  { id: 'northIce_chinese_5_005', content: '《太平广记》编于哪个朝代？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'宋代',isCorrect:true},{text:'唐代',isCorrect:false},{text:'明代',isCorrect:false},{text:'清代',isCorrect:false}] },
  { id: 'northIce_chinese_5_006', content: '"曾经沧海难为水"下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'除却巫山不是云',isCorrect:true},{text:'相见时难别亦难',isCorrect:false},{text:'东风无力百花残',isCorrect:false},{text:'春蚕到死丝方尽',isCorrect:false}] },
  { id: 'northIce_chinese_5_007', content: '《汉纪》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'荀悦',isCorrect:true},{text:'司马迁',isCorrect:false},{text:'班固',isCorrect:false},{text:'范晔',isCorrect:false}] },
  { id: 'northIce_chinese_5_008', content: '下列哪个不是宋代文学家？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'李白',isCorrect:true},{text:'苏轼',isCorrect:false},{text:'欧阳修',isCorrect:false},{text:'王安石',isCorrect:false}] },
]

// === ENGLISH D1 (10题, grade 1-3) - Sample 6题 ===
const englishD1Questions: Question[] = [
  { id: 'northIce_english_1_001', content: 'What is "水" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Fire',isCorrect:false},{text:'Water',isCorrect:true},{text:'Earth',isCorrect:false},{text:'Air',isCorrect:false}] },
  { id: 'northIce_english_1_002', content: 'How do you spell "run"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'r-u-n',isCorrect:true},{text:'r-a-n',isCorrect:false},{text:'r-o-n',isCorrect:false},{text:'r-i-n',isCorrect:false}] },
  { id: 'northIce_english_1_003', content: '"黑色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'White',isCorrect:false},{text:'Black',isCorrect:true},{text:'Gray',isCorrect:false},{text:'Brown',isCorrect:false}] },
  { id: 'northIce_english_1_004', content: 'What number is "3"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'One',isCorrect:false},{text:'Two',isCorrect:false},{text:'Three',isCorrect:true},{text:'Four',isCorrect:false}] },
  { id: 'northIce_english_1_005', content: 'What is "花"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Tree',isCorrect:false},{text:'Grass',isCorrect:false},{text:'Flower',isCorrect:true},{text:'Leaf',isCorrect:false}] },
  { id: 'northIce_english_1_006', content: 'Good night! is used when ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'meeting',isCorrect:false},{text:'sleeping',isCorrect:true},{text:'eating',isCorrect:false},{text:'playing',isCorrect:false}] },
]

// === ENGLISH D2 (18题, grade 4-5) - Sample 8题 ===
const englishD2Questions: Question[] = [
  { id: 'northIce_english_2_001', content: 'What is the past tense of "write"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Writed',isCorrect:false},{text:'Wrote',isCorrect:true},{text:'Written',isCorrect:false},{text:'Writing',isCorrect:false}] },
  { id: 'northIce_english_2_002', content: 'She ___ to music now.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'listen',isCorrect:false},{text:'listens',isCorrect:false},{text:'is listening',isCorrect:true},{text:'listened',isCorrect:false}] },
  { id: 'northIce_english_2_003', content: 'What is the plural of "tooth"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Tooths',isCorrect:false},{text:'Toothes',isCorrect:false},{text:'Teeth',isCorrect:true},{text:'Tooth',isCorrect:false}] },
  { id: 'northIce_english_2_004', content: 'There are ___ students in the class.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:false},{text:'many',isCorrect:true},{text:'much',isCorrect:false}] },
  { id: 'northIce_english_2_005', content: 'What time is it? 9:15', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Nine',isCorrect:false},{text:'Quarter past nine',isCorrect:true},{text:'Nine quarter',isCorrect:false},{text:'Half nine',isCorrect:false}] },
  { id: 'northIce_english_2_006', content: 'My father ___ in a company.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'work',isCorrect:false},{text:'works',isCorrect:true},{text:'is working',isCorrect:false},{text:'working',isCorrect:false}] },
  { id: 'northIce_english_2_007', content: 'I have ___ visited Beijing.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'just',isCorrect:false}] },
  { id: 'northIce_english_2_008', content: 'The opposite of "empty" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'full',isCorrect:true},{text:'heavy',isCorrect:false},{text:'clean',isCorrect:false},{text:'quiet',isCorrect:false}] },
]

// === ENGLISH D3 (30题, grade 6-7) - Sample 8题 ===
const englishD3Questions: Question[] = [
  { id: 'northIce_english_3_001', content: 'If he ___ here, he would help us.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'northIce_english_3_002', content: 'The movie ___ by millions of people.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is enjoyed',isCorrect:true},{text:'enjoys',isCorrect:false},{text:'enjoyed',isCorrect:false},{text:'enjoying',isCorrect:false}] },
  { id: 'northIce_english_3_003', content: 'Not only she but also I ___ happy.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'northIce_english_3_004', content: 'I have been living here ___ 2010.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'for',isCorrect:false},{text:'since',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'northIce_english_3_005', content: 'Which sentence is grammatically correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He don t have money',isCorrect:false},{text:'He doesn t have money',isCorrect:true},{text:'He not have money',isCorrect:false},{text:'He doesn t has money',isCorrect:false}] },
  { id: 'northIce_english_3_006', content: 'My teacher advised me ___ harder.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'study',isCorrect:false},{text:'to study',isCorrect:true},{text:'studying',isCorrect:false},{text:'studied',isCorrect:false}] },
  { id: 'northIce_english_3_007', content: 'By the time I graduate, I ___ here for 6 years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'will study',isCorrect:false},{text:'will have studied',isCorrect:true},{text:'will be studying',isCorrect:false},{text:'study',isCorrect:false}] },
  { id: 'northIce_english_3_008', content: 'Scarcely ___ when the accident happened.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'he arrived',isCorrect:false},{text:'did he arrive',isCorrect:true},{text:'had he arrived',isCorrect:false},{text:'he had arrived',isCorrect:false}] },
]

// === ENGLISH D4 (27题, grade 8) - Sample 8题 ===
const englishD4Questions: Question[] = [
  { id: 'northIce_english_4_001', content: 'The passive voice of "They have finished the work" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'The work has been finished',isCorrect:true},{text:'The work have been finished',isCorrect:false},{text:'The work is finished',isCorrect:false},{text:'The work was finished',isCorrect:false}] },
  { id: 'northIce_english_4_002', content: 'It is vital that everyone ___ present.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'is',isCorrect:false},{text:'be',isCorrect:true},{text:'being',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'northIce_english_4_003', content: 'Which word is a demonstrative pronoun?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'This',isCorrect:true},{text:'Beautiful',isCorrect:false},{text:'Run',isCorrect:false}] },
  { id: 'northIce_english_4_004', content: '___ the rain, we went out.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Despite of',isCorrect:false},{text:'In spite of',isCorrect:true},{text:'Although',isCorrect:false},{text:'Because',isCorrect:false}] },
  { id: 'northIce_english_4_005', content: 'He looked ___ he were sick.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'northIce_english_4_006', content: 'The word "impossible" has ___ prefix.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'one',isCorrect:false},{text:'two',isCorrect:true},{text:'three',isCorrect:false},{text:'none',isCorrect:false}] },
  { id: 'northIce_english_4_007', content: 'The letter ___ yesterday.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'should receive',isCorrect:false},{text:'should be received',isCorrect:true},{text:'should have received',isCorrect:false},{text:'should received',isCorrect:false}] },
  { id: 'northIce_english_4_008', content: 'I would rather you ___ home now.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'leave',isCorrect:true},{text:'left',isCorrect:false},{text:'leaving',isCorrect:false},{text:'to leave',isCorrect:false}] },
]

// === ENGLISH D5 (15题, grade 9) - Sample 8题 ===
const englishD5Questions: Question[] = [
  { id: 'northIce_english_5_001', content: 'Had I known, I ___ you sooner.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'would help',isCorrect:false},{text:'would have helped',isCorrect:true},{text:'will help',isCorrect:false},{text:'helped',isCorrect:false}] },
  { id: 'northIce_english_5_002', content: 'On no account ___ be late.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'you must',isCorrect:false},{text:'must you',isCorrect:true},{text:'you should',isCorrect:false},{text:'should you',isCorrect:false}] },
  { id: 'northIce_english_5_003', content: 'I would have succeeded ___ your support.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'but for',isCorrect:true},{text:'despite',isCorrect:false},{text:'without',isCorrect:false},{text:'if not for',isCorrect:false}] },
  { id: 'northIce_english_5_004', content: 'Were it to rain tomorrow, we ___ the trip.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'cancel',isCorrect:false},{text:'would cancel',isCorrect:true},{text:'will cancel',isCorrect:false},{text:'canceled',isCorrect:false}] },
  { id: 'northIce_english_5_005', content: 'Rarely ___ such a beautiful view.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'I have seen',isCorrect:false},{text:'have I seen',isCorrect:true},{text:'I saw',isCorrect:false},{text:'did I see',isCorrect:false}] },
  { id: 'northIce_english_5_006', content: 'It is time we ___ the meeting.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'begin',isCorrect:true},{text:'began',isCorrect:false},{text:'begun',isCorrect:false},{text:'beginning',isCorrect:false}] },
  { id: 'northIce_english_5_007', content: 'Only then ___ the truth.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'I realized',isCorrect:false},{text:'did I realize',isCorrect:true},{text:'I had realized',isCorrect:false},{text:'had I realized',isCorrect:false}] },
  { id: 'northIce_english_5_008', content: 'I never thought she ___ such a mistake.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'will make',isCorrect:false},{text:'would make',isCorrect:true},{text:'would have made',isCorrect:false},{text:'made',isCorrect:false}] },
]

// === SCIENCE D1 (10题, grade 1-3) - Sample 6题 ===
const scienceD1Questions: Question[] = [
  { id: 'northIce_science_1_001', content: '太阳从哪里升起？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'西边',isCorrect:false},{text:'东边',isCorrect:true},{text:'南边',isCorrect:false},{text:'北边',isCorrect:false}] },
  { id: 'northIce_science_1_002', content: '什么动物会下蛋？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'狗',isCorrect:false},{text:'猫',isCorrect:false},{text:'鸡',isCorrect:true},{text:'兔子',isCorrect:false}] },
  { id: 'northIce_science_1_003', content: '植物需要什么？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'水和阳光',isCorrect:true},{text:'面包和水',isCorrect:false},{text:'石头和水',isCorrect:false},{text:'空气和土壤',isCorrect:false}] },
  { id: 'northIce_science_1_004', content: '地球是什么形状？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'平的',isCorrect:false},{text:'正方形',isCorrect:false},{text:'圆形',isCorrect:false},{text:'球形',isCorrect:true}] },
  { id: 'northIce_science_1_005', content: '什么能发光？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'月亮',isCorrect:false},{text:'地球',isCorrect:false},{text:'太阳',isCorrect:true},{text:'石头',isCorrect:false}] },
  { id: 'northIce_science_1_006', content: '水在什么温度会结冰？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'0°C',isCorrect:true},{text:'100°C',isCorrect:false},{text:'-10°C',isCorrect:false},{text:'50°C',isCorrect:false}] },
]

// === SCIENCE D2 (18题, grade 4-5) - Sample 8题 ===
const scienceD2Questions: Question[] = [
  { id: 'northIce_science_2_001', content: '植物的光合作用需要什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'阳光和二氧化碳',isCorrect:false},{text:'阳光、水和二氧化碳',isCorrect:true},{text:'只有阳光',isCorrect:false},{text:'只有水',isCorrect:false}] },
  { id: 'northIce_science_2_002', content: '人体的骨骼有什么功能？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'只有支撑身体',isCorrect:false},{text:'支撑身体、保护内脏、造血',isCorrect:true},{text:'只有造血功能',isCorrect:false},{text:'只有保护内脏',isCorrect:false}] },
  { id: 'northIce_science_2_003', content: '声音可以在什么中传播？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'只能在空气中',isCorrect:false},{text:'可以在固体、液体和气体中',isCorrect:true},{text:'只能在液体中',isCorrect:false},{text:'只能在固体中',isCorrect:false}] },
  { id: 'northIce_science_2_004', content: '什么是动物的迁徙？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在冬天睡觉',isCorrect:false},{text:'动物随季节变化而移动',isCorrect:true},{text:'动物在白天活动',isCorrect:false},{text:'动物在夜里活动',isCorrect:false}] },
  { id: 'northIce_science_2_005', content: '什么是绝缘体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'容易导电的物质',isCorrect:false},{text:'不容易导电的物质',isCorrect:true},{text:'能完全阻止电流',isCorrect:false},{text:'只有塑料才是',isCorrect:false}] },
  { id: 'northIce_science_2_006', content: '地球的自转导致什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'四季变化',isCorrect:false},{text:'昼夜交替',isCorrect:true},{text:'潮汐变化',isCorrect:false},{text:'气候变化',isCorrect:false}] },
  { id: 'northIce_science_2_007', content: '磁铁能吸引什么金属？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'铝',isCorrect:false},{text:'铜',isCorrect:false},{text:'铁',isCorrect:true},{text:'锌',isCorrect:false}] },
  { id: 'northIce_science_2_008', content: '什么是光合作用？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'植物吸收氧气的过程',isCorrect:false},{text:'植物制造有机物的过程',isCorrect:true},{text:'植物呼吸的过程',isCorrect:false},{text:'植物吸收水分的过程',isCorrect:false}] },
]

// === SCIENCE D3 (30题, grade 6-7) - Sample 8题 ===
const scienceD3Questions: Question[] = [
  { id: 'northIce_science_3_001', content: '细胞壁的主要成分是？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'蛋白质',isCorrect:false},{text:'纤维素',isCorrect:true},{text:'淀粉',isCorrect:false},{text:'脂肪',isCorrect:false}] },
  { id: 'northIce_science_3_002', content: '光的折射发生在什么情况下？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光从空气进入水或玻璃时',isCorrect:true},{text:'光在镜子表面反射时',isCorrect:false},{text:'光在空气中直线传播时',isCorrect:false},{text:'光被物体吸收时',isCorrect:false}] },
  { id: 'northIce_science_3_003', content: '地球公转一周大约是多少天？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'30天',isCorrect:false},{text:'365天',isCorrect:true},{text:'360天',isCorrect:false},{text:'400天',isCorrect:false}] },
  { id: 'northIce_science_3_004', content: '什么是新陈代谢？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'生物体与外界环境进行物质交换',isCorrect:false},{text:'生物体内化学反应的总和',isCorrect:true},{text:'细胞的分裂过程',isCorrect:false},{text:'营养物质的消化吸收',isCorrect:false}] },
  { id: 'northIce_science_3_005', content: '大气压强随着高度增加会怎样？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'增加',isCorrect:false},{text:'减小',isCorrect:true},{text:'不变',isCorrect:false},{text:'先增加后减小',isCorrect:false}] },
  { id: 'northIce_science_3_006', content: '什么是染色体？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'细胞核中的蛋白质',isCorrect:false},{text:'由DNA和蛋白质组成',isCorrect:true},{text:'细胞质中的结构',isCorrect:false},{text:'细胞膜的一部分',isCorrect:false}] },
  { id: 'northIce_science_3_007', content: '什么是动能？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物体由于位置而具有的能量',isCorrect:false},{text:'物体由于运动而具有的能量',isCorrect:true},{text:'物体由于形状而具有的能量',isCorrect:false},{text:'物体由于温度而具有的能量',isCorrect:false}] },
  { id: 'northIce_science_3_008', content: '化学反应中什么是催化剂？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'加快反应的物质',isCorrect:false},{text:'改变化学反应速率但本身不被消耗的物质',isCorrect:true},{text:'参与反应并被消耗的物质',isCorrect:false},{text:'使反应停止的物质',isCorrect:false}] },
]

// === SCIENCE D4 (27题, grade 8) - Sample 8题 ===
const scienceD4Questions: Question[] = [
  { id: 'northIce_science_4_001', content: '压强的国际单位是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'牛顿',isCorrect:false},{text:'帕斯卡',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'焦耳',isCorrect:false}] },
  { id: 'northIce_science_4_002', content: '如果一个物体的速度加倍，它的动能将？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'加倍',isCorrect:false},{text:'变成4倍',isCorrect:true},{text:'变成8倍',isCorrect:false},{text:'不变',isCorrect:false}] },
  { id: 'northIce_science_4_003', content: 'DNA复制发生在？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'细胞质',isCorrect:false},{text:'细胞核',isCorrect:true},{text:'线粒体',isCorrect:false},{text:'核糖体',isCorrect:false}] },
  { id: 'northIce_science_4_004', content: '太阳系中最大的行星是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地球',isCorrect:false},{text:'土星',isCorrect:false},{text:'木星',isCorrect:true},{text:'海王星',isCorrect:false}] },
  { id: 'northIce_science_4_005', content: '什么是功率？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'做功的多少',isCorrect:false},{text:'做功的快慢',isCorrect:true},{text:'做功的效率',isCorrect:false},{text:'做功的时间',isCorrect:false}] },
  { id: 'northIce_science_4_006', content: '什么是基因突变？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'基因数量的改变',isCorrect:false},{text:'DNA序列的永久改变',isCorrect:true},{text:'染色体的改变',isCorrect:false},{text:'细胞核的改变',isCorrect:false}] },
  { id: 'northIce_science_4_007', content: '地壳是由什么组成的？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'只有花岗岩',isCorrect:false},{text:'各种岩石包括沉积岩、变质岩等',isCorrect:true},{text:'只有玄武岩',isCorrect:false},{text:'只有沉积岩',isCorrect:false}] },
  { id: 'northIce_science_4_008', content: '什么是频率？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'波传播的速度',isCorrect:false},{text:'单位时间内振动的次数',isCorrect:true},{text:'波的振幅',isCorrect:false},{text:'波的波长',isCorrect:false}] },
]

// === SCIENCE D5 (15题, grade 9) - Sample 8题 ===
const scienceD5Questions: Question[] = [
  { id: 'northIce_science_5_001', content: '量子力学中电子具有什么特性？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'确定性',isCorrect:false},{text:'波粒二象性',isCorrect:true},{text:'连续性',isCorrect:false},{text:'唯一性',isCorrect:false}] },
  { id: 'northIce_science_5_002', content: '相对论中能量和质量的转换公式是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'E = mc²',isCorrect:true},{text:'E = mgh',isCorrect:false},{text:'E = ½mv²',isCorrect:false},{text:'E = hν',isCorrect:false}] },
  { id: 'northIce_science_5_003', content: '原子核由什么组成？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'只有质子',isCorrect:false},{text:'质子和中子',isCorrect:true},{text:'只有中子',isCorrect:false},{text:'电子和质子',isCorrect:false}] },
  { id: 'northIce_science_5_004', content: '光年是什么的单位？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'时间',isCorrect:false},{text:'长度',isCorrect:true},{text:'速度',isCorrect:false},{text:'质量',isCorrect:false}] },
  { id: 'northIce_science_5_005', content: '什么是半衰期？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'原子衰变一半所需的时间',isCorrect:true},{text:'原子衰变全部所需的时间',isCorrect:false},{text:'原子衰变四分之一所需的时间',isCorrect:false},{text:'原子衰变两倍所需的时间',isCorrect:false}] },
  { id: 'northIce_science_5_006', content: '电磁波谱中可见光的位置是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'在无线电波和微波之间',isCorrect:false},{text:'在紫外线和红外线之间',isCorrect:true},{text:'在X射线和伽马射线之间',isCorrect:false},{text:'在无线电波和红外线之间',isCorrect:false}] },
  { id: 'northIce_science_5_007', content: '细胞呼吸的主要产物是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'二氧化碳和水',isCorrect:true},{text:'只有二氧化碳',isCorrect:false},{text:'只有水',isCorrect:false},{text:'氧气和葡萄糖',isCorrect:false}] },
  { id: 'northIce_science_5_008', content: '宇宙膨胀的证据是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'恒星的光度',isCorrect:false},{text:'星系光谱的红移',isCorrect:true},{text:'宇宙微波背景辐射的温度',isCorrect:false},{text:'星系的形状',isCorrect:false}] },
]

// === PHYSICS D1 (10题, grade 1-3) - Sample 6题 ===
const physicsD1Questions: Question[] = [
  { id: 'northIce_physics_1_001', content: '什么让东西往下掉？', type: 'single', difficulty: 1, category: 'physics', grade: 1, options: [{text:'重力',isCorrect:true},{text:'风力',isCorrect:false},{text:'推力',isCorrect:false},{text:'拉力',isCorrect:false}] },
  { id: 'northIce_physics_1_002', content: '影子是怎么形成的？', type: 'single', difficulty: 1, category: 'physics', grade: 1, options: [{text:'光被阻挡',isCorrect:true},{text:'光穿过物体',isCorrect:false},{text:'物体发光',isCorrect:false},{text:'光被反射',isCorrect:false}] },
  { id: 'northIce_physics_1_003', content: '什么东西能发出声音？', type: 'single', difficulty: 1, category: 'physics', grade: 2, options: [{text:'振动的东西',isCorrect:true},{text:'静止的东西',isCorrect:false},{text:'透明的东西',isCorrect:false},{text:'软的东西',isCorrect:false}] },
  { id: 'northIce_physics_1_004', content: '光的传播方式是怎样的？', type: 'single', difficulty: 1, category: 'physics', grade: 2, options: [{text:'曲线',isCorrect:false},{text:'直线',isCorrect:true},{text:'环形',isCorrect:false},{text:'无规律',isCorrect:false}] },
  { id: 'northIce_physics_1_005', content: '镜子能反射什么？', type: 'single', difficulty: 1, category: 'physics', grade: 3, options: [{text:'声音',isCorrect:false},{text:'光',isCorrect:true},{text:'热',isCorrect:false},{text:'水',isCorrect:false}] },
  { id: 'northIce_physics_1_006', content: '什么是热的传递方式之一？', type: 'single', difficulty: 1, category: 'physics', grade: 3, options: [{text:'传导',isCorrect:true},{text:'混合',isCorrect:false},{text:'变形',isCorrect:false},{text:'爆炸',isCorrect:false}] },
]

// === PHYSICS D2 (18题, grade 4-5) - Sample 8题 ===
const physicsD2Questions: Question[] = [
  { id: 'northIce_physics_2_001', content: '声音是由什么产生的？', type: 'single', difficulty: 2, category: 'physics', grade: 4, options: [{text:'振动',isCorrect:true},{text:'光',isCorrect:false},{text:'热',isCorrect:false},{text:'颜色',isCorrect:false}] },
  { id: 'northIce_physics_2_002', content: '光的传播速度大约是？', type: 'single', difficulty: 2, category: 'physics', grade: 4, options: [{text:'30万公里/秒',isCorrect:true},{text:'30万公里/小时',isCorrect:false},{text:'30万公里/分钟',isCorrect:false},{text:'3万公里/秒',isCorrect:false}] },
  { id: 'northIce_physics_2_003', content: '凸透镜有什么作用？', type: 'single', difficulty: 2, category: 'physics', grade: 4, options: [{text:'发散光线',isCorrect:false},{text:'会聚光线',isCorrect:true},{text:'阻挡光线',isCorrect:false},{text:'反射光线',isCorrect:false}] },
  { id: 'northIce_physics_2_004', content: '什么是热传导？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'热通过空气传递',isCorrect:false},{text:'热通过直接接触传递',isCorrect:true},{text:'热通过液体传递',isCorrect:false},{text:'热通过太阳传递',isCorrect:false}] },
  { id: 'northIce_physics_2_005', content: '什么是光的反射？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'光进入物体后改变方向',isCorrect:false},{text:'光碰到表面后返回',isCorrect:true},{text:'光被物体吸收',isCorrect:false},{text:'光穿过透明物体',isCorrect:false}] },
  { id: 'northIce_physics_2_006', content: '什么是热辐射？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'热通过物体传递',isCorrect:false},{text:'热以电磁波形式传递',isCorrect:true},{text:'热通过液体传递',isCorrect:false},{text:'热通过气体传递',isCorrect:false}] },
  { id: 'northIce_physics_2_007', content: '声音在什么中传播最快？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'空气',isCorrect:false},{text:'水',isCorrect:false},{text:'固体',isCorrect:true},{text:'真空',isCorrect:false}] },
  { id: 'northIce_physics_2_008', content: '什么是光的折射？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'光被反射',isCorrect:false},{text:'光从一种介质进入另一种介质时方向改变',isCorrect:true},{text:'光被吸收',isCorrect:false},{text:'光被散射',isCorrect:false}] },
]

// === PHYSICS D3 (30题, grade 6-7) - Sample 8题 ===
const physicsD3Questions: Question[] = [
  { id: 'northIce_physics_3_001', content: '力的国际单位是？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'焦耳',isCorrect:false},{text:'牛顿',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'帕斯卡',isCorrect:false}] },
  { id: 'northIce_physics_3_002', content: '速度的国际单位是？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'m/s',isCorrect:true},{text:'km/h',isCorrect:false},{text:'m/s²',isCorrect:false},{text:'N',isCorrect:false}] },
  { id: 'northIce_physics_3_003', content: '光的反射定律是什么？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'两者之和等于90度',isCorrect:false}] },
  { id: 'northIce_physics_3_004', content: '什么是动能？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体由于位置具有的能量',isCorrect:false},{text:'物体由于运动具有的能量',isCorrect:true},{text:'物体由于形变具有的能量',isCorrect:false},{text:'物体由于温度具有的能量',isCorrect:false}] },
  { id: 'northIce_physics_3_005', content: '什么是重力势能？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体由于运动具有的能量',isCorrect:false},{text:'物体由于位置具有的能量',isCorrect:true},{text:'物体由于形变具有的能量',isCorrect:false},{text:'物体由于温度具有的能量',isCorrect:false}] },
  { id: 'northIce_physics_3_006', content: '杠杆平衡的条件是？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'动力乘以动力臂等于阻力乘以阻力臂',isCorrect:true},{text:'动力等于阻力',isCorrect:false},{text:'动力臂等于阻力臂',isCorrect:false},{text:'动力加动力臂等于阻力加阻力臂',isCorrect:false}] },
  { id: 'northIce_physics_3_007', content: '什么是比热容？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体吸热的能力',isCorrect:false},{text:'单位质量物质升高1度所需的热量',isCorrect:true},{text:'物体的温度',isCorrect:false},{text:'物体的热量',isCorrect:false}] },
  { id: 'northIce_physics_3_008', content: '什么是频率？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'1秒内振动的次数',isCorrect:true},{text:'振动的大小',isCorrect:false},{text:'振动所需的时间',isCorrect:false},{text:'振动传播的速度',isCorrect:false}] },
]

// === PHYSICS D4 (27题, grade 8) - Sample 8题 ===
const physicsD4Questions: Question[] = [
  { id: 'northIce_physics_4_001', content: '压强的国际单位是？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'牛顿',isCorrect:false},{text:'帕斯卡',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'焦耳',isCorrect:false}] },
  { id: 'northIce_physics_4_002', content: '如果速度加倍，动能怎么变化？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'加倍',isCorrect:false},{text:'变成4倍',isCorrect:true},{text:'变成8倍',isCorrect:false},{text:'不变',isCorrect:false}] },
  { id: 'northIce_physics_4_003', content: '欧姆定律的公式是？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'V = IR',isCorrect:true},{text:'V = I/R',isCorrect:false},{text:'V = R/I',isCorrect:false},{text:'V = I + R',isCorrect:false}] },
  { id: 'northIce_physics_4_004', content: '什么是波长？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'波振动一次的距离',isCorrect:false},{text:'相邻波峰或波谷之间的距离',isCorrect:true},{text:'波传播的速度',isCorrect:false},{text:'波振动的高度',isCorrect:false}] },
  { id: 'northIce_physics_4_005', content: '什么是功率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'做功的多少',isCorrect:false},{text:'做功的快慢',isCorrect:true},{text:'做功的效率',isCorrect:false},{text:'做功的时间',isCorrect:false}] },
  { id: 'northIce_physics_4_006', content: '什么是机械效率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'有用功与总功的比值',isCorrect:true},{text:'总功与有用功的比值',isCorrect:false},{text:'无用功与总功的比值',isCorrect:false},{text:'有用功与无用功的比值',isCorrect:false}] },
  { id: 'northIce_physics_4_007', content: '什么是折射率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'光在真空中的速度与在介质中速度的比值',isCorrect:true},{text:'光在介质中的速度',isCorrect:false},{text:'光在真空中的速度',isCorrect:false},{text:'光在介质中与空气中速度的比值',isCorrect:false}] },
  { id: 'northIce_physics_4_008', content: '什么是共振？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'物体以相同频率振动的现象',isCorrect:true},{text:'物体静止的状态',isCorrect:false},{text:'物体振幅减小的现象',isCorrect:false},{text:'物体随机振动的现象',isCorrect:false}] },
]

// === PHYSICS D5 (15题, grade 9) - Sample 8题 ===
const physicsD5Questions: Question[] = [
  { id: 'northIce_physics_5_001', content: '相对论表明物体的质量随速度增加而？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'减少',isCorrect:false},{text:'增加',isCorrect:true},{text:'不变',isCorrect:false},{text:'先增加后减少',isCorrect:false}] },
  { id: 'northIce_physics_5_002', content: '光电效应证明了什么？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'光具有波动性',isCorrect:false},{text:'光具有粒子性',isCorrect:true},{text:'光没有能量',isCorrect:false},{text:'光只有波动性没有粒子性',isCorrect:false}] },
  { id: 'northIce_physics_5_003', content: '德布罗意波长适用于？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'只有光子',isCorrect:false},{text:'所有运动的粒子',isCorrect:true},{text:'只有电子',isCorrect:false},{text:'只有原子',isCorrect:false}] },
  { id: 'northIce_physics_5_004', content: '核聚变是？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'轻核结合形成重核',isCorrect:true},{text:'重核分裂成轻核',isCorrect:false},{text:'原子核释放电子',isCorrect:false},{text:'原子核吸收电子',isCorrect:false}] },
  { id: 'northIce_physics_5_005', content: '强相互作用力的作用范围是？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'无限远',isCorrect:false},{text:'10^-15米',isCorrect:true},{text:'10^-10米',isCorrect:false},{text:'1米',isCorrect:false}] },
  { id: 'northIce_physics_5_006', content: '如果一个系统的熵增加，这意味着？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'系统变得更有序',isCorrect:false},{text:'系统变得更无序',isCorrect:true},{text:'系统的能量增加',isCorrect:false},{text:'系统的温度升高',isCorrect:false}] },
  { id: 'northIce_physics_5_007', content: '什么是引力透镜效应？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'光被引力加速',isCorrect:false},{text:'光被引力弯曲',isCorrect:true},{text:'光被引力吸引',isCorrect:false},{text:'光被引力排斥',isCorrect:false}] },
  { id: 'northIce_physics_5_008', content: '在量子力学中，测不准原理指出什么不能同时精确测量？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'位置和动量',isCorrect:true},{text:'时间和能量',isCorrect:false},{text:'质量和速度',isCorrect:false},{text:'电荷和电流',isCorrect:false}] },
]

// === CHEMISTRY D1 (10题, grade 1-3) - Sample 6题 ===
const chemistryD1Questions: Question[] = [
  { id: 'northIce_chemistry_1_001', content: '水是由什么组成的？', type: 'single', difficulty: 1, category: 'chemistry', grade: 1, options: [{text:'氧气和氮气',isCorrect:false},{text:'氢气和氧气',isCorrect:true},{text:'碳和氧',isCorrect:false},{text:'氮和氢',isCorrect:false}] },
  { id: 'northIce_chemistry_1_002', content: '空气中有多少氧气？', type: 'single', difficulty: 1, category: 'chemistry', grade: 1, options: [{text:'约21%',isCorrect:true},{text:'约78%',isCorrect:false},{text:'约50%',isCorrect:false},{text:'约10%',isCorrect:false}] },
  { id: 'northIce_chemistry_1_003', content: '什么是铁锈？', type: 'single', difficulty: 1, category: 'chemistry', grade: 2, options: [{text:'铁燃烧后的产物',isCorrect:false},{text:'铁与氧气和水反应后的产物',isCorrect:true},{text:'铁的杂质',isCorrect:false},{text:'铁的另一种形式',isCorrect:false}] },
  { id: 'northIce_chemistry_1_004', content: '什么是燃烧？', type: 'single', difficulty: 1, category: 'chemistry', grade: 2, options: [{text:'物体变湿',isCorrect:false},{text:'物质与氧气快速反应产生光和热',isCorrect:true},{text:'物体变冷',isCorrect:false},{text:'物体溶解',isCorrect:false}] },
  { id: 'northIce_chemistry_1_005', content: '什么是二氧化碳？', type: 'single', difficulty: 1, category: 'chemistry', grade: 3, options: [{text:'碳和氢的化合物',isCorrect:false},{text:'碳和氧的化合物',isCorrect:true},{text:'氧和氢的化合物',isCorrect:false},{text:'氮和氧的化合物',isCorrect:false}] },
  { id: 'northIce_chemistry_1_006', content: '什么是PH值？', type: 'single', difficulty: 1, category: 'chemistry', grade: 3, options: [{text:'水的温度',isCorrect:false},{text:'水的酸碱度',isCorrect:true},{text:'水的颜色',isCorrect:false},{text:'水的味道',isCorrect:false}] },
]

// === CHEMISTRY D2 (18题, grade 4-5) - Sample 8题 ===
const chemistryD2Questions: Question[] = [
  { id: 'northIce_chemistry_2_001', content: '什么是化学变化？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'物质形状改变但本质不变',isCorrect:false},{text:'物质本质改变生成新物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质位置改变',isCorrect:false}] },
  { id: 'northIce_chemistry_2_002', content: '什么是物理变化？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'物质本质改变',isCorrect:false},{text:'物质的形状、大小或状态改变但本质不变',isCorrect:true},{text:'生成新物质',isCorrect:false},{text:'物质燃烧',isCorrect:false}] },
  { id: 'northIce_chemistry_2_003', content: '什么是催化剂？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'加快反应的物质',isCorrect:false},{text:'改变化学反应速率但本身不被消耗',isCorrect:true},{text:'参与反应并被消耗',isCorrect:false},{text:'使反应停止',isCorrect:false}] },
  { id: 'northIce_chemistry_2_004', content: '什么是酸？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'能释放氢氧根离子的物质',isCorrect:false},{text:'能释放氢离子的物质',isCorrect:true},{text:'能接受氢离子的物质',isCorrect:false},{text:'不含氢的物质',isCorrect:false}] },
  { id: 'northIce_chemistry_2_005', content: '什么是碱？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'能释放氢离子的物质',isCorrect:false},{text:'能释放氢氧根离子的物质',isCorrect:true},{text:'能接受氢氧根离子的物质',isCorrect:false},{text:'不含氢氧根的物质',isCorrect:false}] },
  { id: 'northIce_chemistry_2_006', content: '什么是中和反应？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'酸和碱反应生成盐和水',isCorrect:true},{text:'酸和盐反应',isCorrect:false},{text:'碱和盐反应',isCorrect:false},{text:'两个酸反应',isCorrect:false}] },
  { id: 'northIce_chemistry_2_007', content: '什么是质量守恒定律？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'化学反应中质量不断增加',isCorrect:false},{text:'化学反应中质量不断减少',isCorrect:false},{text:'化学反应前后质量不变',isCorrect:true},{text:'化学反应中质量有时变有时不变',isCorrect:false}] },
  { id: 'northIce_chemistry_2_008', content: '什么是原子？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'可以再分的粒子',isCorrect:false},{text:'保持化学性质的最小粒子',isCorrect:true},{text:'很大的粒子',isCorrect:false},{text:'发光的粒子',isCorrect:false}] },
]

// === CHEMISTRY D3 (30题, grade 6-7) - Sample 8题 ===
const chemistryD3Questions: Question[] = [
  { id: 'northIce_chemistry_3_001', content: '原子核由什么组成？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'只有电子',isCorrect:false},{text:'质子和中子',isCorrect:true},{text:'只有质子',isCorrect:false},{text:'电子和中子',isCorrect:false}] },
  { id: 'northIce_chemistry_3_002', content: '同位素是指什么？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'质子数相同但中子数不同的原子',isCorrect:true},{text:'中子数相同但质子数不同的原子',isCorrect:false},{text:'电子数相同但质子数不同的原子',isCorrect:false},{text:'质子数不同的原子',isCorrect:false}] },
  { id: 'northIce_chemistry_3_003', content: '什么是离子？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'失去或获得电子的原子或分子',isCorrect:true},{text:'没有电子的原子',isCorrect:false},{text:'只有电子的粒子',isCorrect:false},{text:'中性的原子',isCorrect:false}] },
  { id: 'northIce_chemistry_3_004', content: '什么是化学键？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'原子之间的引力或排斥力',isCorrect:true},{text:'原子之间的距离',isCorrect:false},{text:'原子的大小',isCorrect:false},{text:'原子的重量',isCorrect:false}] },
  { id: 'northIce_chemistry_3_005', content: '什么是氧化反应？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'物质失去电子的反应',isCorrect:true},{text:'物质获得电子的反应',isCorrect:false},{text:'物质与氢气反应',isCorrect:false},{text:'物质与水反应',isCorrect:false}] },
  { id: 'northIce_chemistry_3_006', content: '什么是还原反应？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'物质失去电子的反应',isCorrect:false},{text:'物质获得电子的反应',isCorrect:true},{text:'物质与氧气反应',isCorrect:false},{text:'物质与氮气反应',isCorrect:false}] },
  { id: 'northIce_chemistry_3_007', content: '元素周期表按什么排列？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'原子量',isCorrect:false},{text:'质子数',isCorrect:true},{text:'电子数',isCorrect:false},{text:'中子数',isCorrect:false}] },
  { id: 'northIce_chemistry_3_008', content: '什么是化合物？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'只有一种元素组成的物质',isCorrect:false},{text:'两种或两种以上元素组成的物质',isCorrect:true},{text:'混合物',isCorrect:false},{text:'单质',isCorrect:false}] },
]

// === CHEMISTRY D4 (27题, grade 8) - Sample 8题 ===
const chemistryD4Questions: Question[] = [
  { id: 'northIce_chemistry_4_001', content: '什么是摩尔质量？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'1摩尔物质的质量',isCorrect:true},{text:'1个粒子的质量',isCorrect:false},{text:'物质的密度',isCorrect:false},{text:'物质的体积',isCorrect:false}] },
  { id: 'northIce_chemistry_4_002', content: '阿伏伽德罗常数是？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'6.02×10²³',isCorrect:true},{text:'6.02×10²²',isCorrect:false},{text:'6.02×10²⁴',isCorrect:false},{text:'6.02×10²⁵',isCorrect:false}] },
  { id: 'northIce_chemistry_4_003', content: '什么是共价键？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'金属原子之间的键',isCorrect:false},{text:'非金属原子之间共享电子的键',isCorrect:true},{text:'离子之间的键',isCorrect:false},{text:'原子与离子之间的键',isCorrect:false}] },
  { id: 'northIce_chemistry_4_004', content: '什么是离子键？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'原子之间共享电子',isCorrect:false},{text:'正负离子之间的静电引力',isCorrect:true},{text:'金属原子之间的键',isCorrect:false},{text:'分子之间的力',isCorrect:false}] },
  { id: 'northIce_chemistry_4_005', content: '什么是勒夏特列原理？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'反应速率随温度增加而增加',isCorrect:false},{text:'平衡系统受扰动时会向减小扰动的方向移动',isCorrect:true},{text:'反应朝着生成更多产物的方向移动',isCorrect:false},{text:'反应朝着反应物减少的方向移动',isCorrect:false}] },
  { id: 'northIce_chemistry_4_006', content: '什么是放热反应？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'吸收热量的反应',isCorrect:false},{text:'释放热量的反应',isCorrect:true},{text:'温度不变的反应',isCorrect:false},{text:'需要催化剂的反应',isCorrect:false}] },
  { id: 'northIce_chemistry_4_007', content: '什么是吸热反应？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'释放热量的反应',isCorrect:false},{text:'吸收热量的反应',isCorrect:true},{text:'温度升高的反应',isCorrect:false},{text:'温度降低的反应',isCorrect:false}] },
  { id: 'northIce_chemistry_4_008', content: '什么是化学平衡？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'反应完全停止的状态',isCorrect:false},{text:'正逆反应速率相等的状态',isCorrect:true},{text:'反应物全部消耗完的状态',isCorrect:false},{text:'产物全部生成的状态',isCorrect:false}] },
]

// === CHEMISTRY D5 (15题, grade 9) - Sample 8题 ===
const chemistryD5Questions: Question[] = [
  { id: 'northIce_chemistry_5_001', content: '什么是电子云？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'电子的轨道',isCorrect:false},{text:'电子在原子核外出现的概率分布',isCorrect:true},{text:'电子的速度',isCorrect:false},{text:'电子的能量',isCorrect:false}] },
  { id: 'northIce_chemistry_5_002', content: '什么是杂化轨道？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'不同原子轨道的混合',isCorrect:true},{text:'电子云的形状',isCorrect:false},{text:'原子的能级',isCorrect:false},{text:'分子的振动',isCorrect:false}] },
  { id: 'northIce_chemistry_5_003', content: '什么是电负性？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'原子吸引电子的能力',isCorrect:true},{text:'原子失去电子的能力',isCorrect:false},{text:'原子核的大小',isCorrect:false},{text:'电子的数量',isCorrect:false}] },
  { id: 'northIce_chemistry_5_004', content: '什么是sp³杂化？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'一个s轨道和三个p轨道的混合',isCorrect:true},{text:'一个s轨道和一个p轨道的混合',isCorrect:false},{text:'两个s轨道和两个p轨道的混合',isCorrect:false},{text:'三个s轨道和一个p轨道的混合',isCorrect:false}] },
  { id: 'northIce_chemistry_5_005', content: '什么是分子间作用力？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'原子之间的力',isCorrect:false},{text:'分子之间的力',isCorrect:true},{text:'离子之间的力',isCorrect:false},{text:'化学键',isCorrect:false}] },
  { id: 'northIce_chemistry_5_006', content: '什么是氢键？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'氢原子与其他原子形成的强化学键',isCorrect:false},{text:'氢键是分子间作用力的一种',isCorrect:true},{text:'氢原子失去电子形成的键',isCorrect:false},{text:'氢原子获得电子形成的键',isCorrect:false}] },
  { id: 'northIce_chemistry_5_007', content: '什么是晶格能？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'晶体中原子振动的能量',isCorrect:false},{text:'气态离子形成固态晶体时释放的能量',isCorrect:true},{text:'晶体的熔点',isCorrect:false},{text:'晶体中电子的能量',isCorrect:false}] },
  { id: 'northIce_chemistry_5_008', content: '什么是配合物的稳定常数？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'配合物分解的常数',isCorrect:false},{text:'配合物形成程度的常数',isCorrect:true},{text:'配合物的浓度',isCorrect:false},{text:'配合物的颜色',isCorrect:false}] },
]

// Combine all questions
export const northIceQuestions: Question[] = [
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
  ...physicsD1Questions,
  ...physicsD2Questions,
  ...physicsD3Questions,
  ...physicsD4Questions,
  ...physicsD5Questions,
  ...chemistryD1Questions,
  ...chemistryD2Questions,
  ...chemistryD3Questions,
  ...chemistryD4Questions,
  ...chemistryD5Questions,
]

export const northIceQuestionBank = createNorthIceOceanQuestionBank('northIce', northIceQuestions)