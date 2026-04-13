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

function createSouthHotOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
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

// === MATH D1 (20题, grade 1-3) - Sample 8题 ===
const mathD1Questions: Question[] = [
  { id: 'southHot_math_1_001', content: '7 + 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'11',isCorrect:false},{text:'12',isCorrect:false},{text:'13',isCorrect:true},{text:'14',isCorrect:false}] },
  { id: 'southHot_math_1_002', content: '15 - 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'southHot_math_1_003', content: '3 × 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'12',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'southHot_math_1_004', content: '18 ÷ 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'southHot_math_1_005', content: '45 + 32 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'75',isCorrect:false},{text:'76',isCorrect:false},{text:'77',isCorrect:true},{text:'78',isCorrect:false}] },
  { id: 'southHot_math_1_006', content: '83 - 47 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'34',isCorrect:false},{text:'35',isCorrect:false},{text:'36',isCorrect:true},{text:'37',isCorrect:false}] },
  { id: 'southHot_math_1_007', content: '4 × 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'34',isCorrect:false},{text:'35',isCorrect:false},{text:'36',isCorrect:true},{text:'37',isCorrect:false}] },
  { id: 'southHot_math_1_008', content: '56 ÷ 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D2 (25题, grade 4-5) - Sample 8题 ===
const mathD2Questions: Question[] = [
  { id: 'southHot_math_2_001', content: '267 + 389 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'646',isCorrect:false},{text:'656',isCorrect:true},{text:'666',isCorrect:false},{text:'676',isCorrect:false}] },
  { id: 'southHot_math_2_002', content: '1000 - 458 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'542',isCorrect:true},{text:'552',isCorrect:false},{text:'562',isCorrect:false},{text:'542',isCorrect:false}] },
  { id: 'southHot_math_2_003', content: '36 × 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'422',isCorrect:false},{text:'432',isCorrect:true},{text:'442',isCorrect:false},{text:'452',isCorrect:false}] },
  { id: 'southHot_math_2_004', content: '756 ÷ 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'62',isCorrect:false},{text:'63',isCorrect:true},{text:'64',isCorrect:false},{text:'65',isCorrect:false}] },
  { id: 'southHot_math_2_005', content: '4.7 + 3.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'8.5',isCorrect:false},{text:'8.6',isCorrect:true},{text:'8.7',isCorrect:false},{text:'8.8',isCorrect:false}] },
  { id: 'southHot_math_2_006', content: '9.5 - 4.7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4.6',isCorrect:false},{text:'4.7',isCorrect:false},{text:'4.8',isCorrect:true},{text:'5.8',isCorrect:false}] },
  { id: 'southHot_math_2_007', content: '0.8 × 2.5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'1.8',isCorrect:false},{text:'2.0',isCorrect:true},{text:'2.2',isCorrect:false},{text:'2.5',isCorrect:false}] },
  { id: 'southHot_math_2_008', content: '6.4 ÷ 0.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D3 (30题, grade 6-7) - Sample 8题 ===
const mathD3Questions: Question[] = [
  { id: 'southHot_math_3_001', content: '-8 + 3 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-11',isCorrect:false},{text:'-5',isCorrect:true},{text:'5',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'southHot_math_3_002', content: '(-5) × (-6) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-30',isCorrect:false},{text:'30',isCorrect:true},{text:'-11',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'southHot_math_3_003', content: '6² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'12',isCorrect:false},{text:'36',isCorrect:true},{text:'62',isCorrect:false},{text:'24',isCorrect:false}] },
  { id: 'southHot_math_3_004', content: '∛27 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'southHot_math_3_005', content: '3x + 7 = 22, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'southHot_math_3_006', content: '5(x - 2) = 25, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'southHot_math_3_007', content: '60% of 250 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'140',isCorrect:false},{text:'150',isCorrect:true},{text:'160',isCorrect:false},{text:'170',isCorrect:false}] },
  { id: 'southHot_math_3_008', content: '√169 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'11',isCorrect:false},{text:'12',isCorrect:false},{text:'13',isCorrect:true},{text:'14',isCorrect:false}] },
]

// === MATH D4 (18题, grade 8) - Sample 6题 ===
const mathD4Questions: Question[] = [
  { id: 'southHot_math_4_001', content: 'x² - 5x + 6 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'1, 6',isCorrect:false},{text:'2, 3',isCorrect:true},{text:'-2, -3',isCorrect:false},{text:'-1, -6',isCorrect:false}] },
  { id: 'southHot_math_4_002', content: 'y = 3x - 2, when x = 4, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'8',isCorrect:false},{text:'10',isCorrect:true},{text:'12',isCorrect:false},{text:'14',isCorrect:false}] },
  { id: 'southHot_math_4_003', content: 'tan(45°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'√3',isCorrect:false}] },
  { id: 'southHot_math_4_004', content: 'a³ × a⁴ = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a⁷',isCorrect:true},{text:'a¹²',isCorrect:false},{text:'a⁸',isCorrect:false},{text:'3a⁷',isCorrect:false}] },
  { id: 'southHot_math_4_005', content: '(2x+3)(2x-3) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'4x²-9',isCorrect:true},{text:'4x²+9',isCorrect:false},{text:'4x²-12x+9',isCorrect:false},{text:'4x²+12x-9',isCorrect:false}] },
  { id: 'southHot_math_4_006', content: '√48 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'4√3',isCorrect:true},{text:'2√12',isCorrect:false},{text:'3√4',isCorrect:false},{text:'6√2',isCorrect:false}] },
]

// === MATH D5 (7题, grade 9) - Sample 5题 ===
const mathD5Questions: Question[] = [
  { id: 'southHot_math_5_001', content: '2x² - 8 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'±2',isCorrect:true},{text:'±4',isCorrect:false},{text:'±8',isCorrect:false},{text:'±16',isCorrect:false}] },
  { id: 'southHot_math_5_002', content: 'd/dx (5x³) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'5x²',isCorrect:false},{text:'15x²',isCorrect:true},{text:'15x³',isCorrect:false},{text:'3x²',isCorrect:false}] },
  { id: 'southHot_math_5_003', content: 'log₂(32) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'southHot_math_5_004', content: 'cos(60°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:true},{text:'√2/2',isCorrect:false},{text:'√3/2',isCorrect:false}] },
  { id: 'southHot_math_5_005', content: '∫(4x³) dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'4x⁴ + C',isCorrect:false},{text:'x⁴ + C',isCorrect:true},{text:'12x² + C',isCorrect:false},{text:'4x³ + C',isCorrect:false}] },
  { id: 'southHot_math_5_006', content: 'If sin(θ) = 0.5, θ = ? (0° < θ < 90°)', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'30°',isCorrect:true},{text:'45°',isCorrect:false},{text:'60°',isCorrect:false},{text:'90°',isCorrect:false}] },
  { id: 'southHot_math_5_007', content: 'ln(e²) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'e',isCorrect:false},{text:'2e',isCorrect:false}] },
]

// === CHINESE D1 (20题, grade 1-3) - Sample 8题 ===
const chineseD1Questions: Question[] = [
  { id: 'southHot_chinese_1_001', content: '"山"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'southHot_chinese_1_002', content: '"火"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'水',isCorrect:false},{text:'火',isCorrect:true},{text:'土',isCorrect:false},{text:'风',isCorrect:false}] },
  { id: 'southHot_chinese_1_003', content: '下列哪个是交通工具？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'汽车',isCorrect:true},{text:'桌子',isCorrect:false},{text:'椅子',isCorrect:false},{text:'苹果',isCorrect:false}] },
  { id: 'southHot_chinese_1_004', content: '"长"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'短',isCorrect:true},{text:'高',isCorrect:false},{text:'大',isCorrect:false},{text:'宽',isCorrect:false}] },
  { id: 'southHot_chinese_1_005', content: '一年有几个月？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'10个月',isCorrect:false},{text:'11个月',isCorrect:false},{text:'12个月',isCorrect:true},{text:'13个月',isCorrect:false}] },
  { id: 'southHot_chinese_1_006', content: '"口"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'southHot_chinese_1_007', content: '哪个字是量词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'走',isCorrect:false},{text:'个',isCorrect:true},{text:'高',isCorrect:false},{text:'红',isCorrect:false}] },
  { id: 'southHot_chinese_1_008', content: '"花"可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'花费',isCorrect:false},{text:'花朵',isCorrect:true},{text:'花园',isCorrect:false},{text:'百花',isCorrect:false}] },
]

// === CHINESE D2 (25题, grade 4-5) - Sample 8题 ===
const chineseD2Questions: Question[] = [
  { id: 'southHot_chinese_2_001', content: '《悯农》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:true},{text:'李绅',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'southHot_chinese_2_002', content: '"纸上谈兵"说的是谁的故事？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'韩信',isCorrect:false},{text:'赵括',isCorrect:true},{text:'廉颇',isCorrect:false},{text:'蔺相如',isCorrect:false}] },
  { id: 'southHot_chinese_2_003', content: '下列哪个是中性词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'勇敢',isCorrect:false},{text:'狡猾',isCorrect:false},{text:'观察',isCorrect:true},{text:'虚伪',isCorrect:false}] },
  { id: 'southHot_chinese_2_004', content: '"三人行，必有我师"出自哪里？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'southHot_chinese_2_005', content: '《水浒传》中共有多少位好汉？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'100位',isCorrect:false},{text:'108位',isCorrect:true},{text:'112位',isCorrect:false},{text:'120位',isCorrect:false}] },
  { id: 'southHot_chinese_2_006', content: '"噩"字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'12画',isCorrect:false},{text:'13画',isCorrect:false},{text:'14画',isCorrect:true},{text:'15画',isCorrect:false}] },
  { id: 'southHot_chinese_2_007', content: '下列哪个不是四大发明？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'造纸术',isCorrect:false},{text:'印刷术',isCorrect:false},{text:'指南针',isCorrect:false},{text:'丝绸',isCorrect:true}] },
  { id: 'southHot_chinese_2_008', content: '"掩耳盗铃"属于哪种修辞手法？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
]

// === CHINESE D3 (30题, grade 6-7) - Sample 8题 ===
const chineseD3Questions: Question[] = [
  { id: 'southHot_chinese_3_001', content: '《念奴娇·赤壁怀古》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'辛弃疾',isCorrect:false},{text:'苏轼',isCorrect:true},{text:'柳永',isCorrect:false},{text:'李清照',isCorrect:false}] },
  { id: 'southHot_chinese_3_002', content: '"桃花源记"的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'陶渊明',isCorrect:true},{text:'欧阳修',isCorrect:false},{text:'范仲淹',isCorrect:false},{text:'王安石',isCorrect:false}] },
  { id: 'southHot_chinese_3_003', content: '下列哪个是明代小说？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'《三国演义》',isCorrect:true},{text:'《红楼梦》',isCorrect:false},{text:'《聊斋志异》',isCorrect:false},{text:'《儒林外史》',isCorrect:false}] },
  { id: 'southHot_chinese_3_004', content: '"先天下之忧而忧"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'后天下之乐而乐',isCorrect:true},{text:'天下兴亡匹夫有责',isCorrect:false},{text:'人生自古谁无死',isCorrect:false},{text:'留取丹心照汗青',isCorrect:false}] },
  { id: 'southHot_chinese_3_005', content: '《故乡》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:true},{text:'朱自清',isCorrect:false},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'southHot_chinese_3_006', content: '"学而不厌，诲人不倦"出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《礼记》',isCorrect:false}] },
  { id: 'southHot_chinese_3_007', content: '下列哪个是巴金的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《家》',isCorrect:true},{text:'《骆驼祥子》',isCorrect:false},{text:'《茶馆》',isCorrect:false},{text:'《四世同堂》',isCorrect:false}] },
  { id: 'southHot_chinese_3_008', content: '"明月几时有"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'把酒问青天',isCorrect:true},{text:'不知天上宫阙',isCorrect:false},{text:'我欲乘风归去',isCorrect:false},{text:'起舞弄清影',isCorrect:false}] },
]

// === CHINESE D4 (18题, grade 8) - Sample 6题 ===
const chineseD4Questions: Question[] = [
  { id: 'southHot_chinese_4_001', content: '《西厢记》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'关汉卿',isCorrect:false},{text:'王实甫',isCorrect:true},{text:'马致远',isCorrect:false},{text:'郑光祖',isCorrect:false}] },
  { id: 'southHot_chinese_4_002', content: '"学，然后知不足"下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'教，然后知困',isCorrect:true},{text:'思，然后知惑',isCorrect:false},{text:'行，然后知远',isCorrect:false},{text:'习，然后知新',isCorrect:false}] },
  { id: 'southHot_chinese_4_003', content: '下列哪个是清代戏剧？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《牡丹亭》',isCorrect:false},{text:'《桃花扇》',isCorrect:true},{text:'《西厢记》',isCorrect:false},{text:'《长生殿》',isCorrect:false}] },
  { id: 'southHot_chinese_4_004', content: '"天下兴亡，匹夫有责"是谁说的？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'顾炎武',isCorrect:true},{text:'黄宗羲',isCorrect:false},{text:'王夫之',isCorrect:false},{text:'龚自珍',isCorrect:false}] },
  { id: 'southHot_chinese_4_005', content: '《文心雕龙》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'刘勰',isCorrect:true},{text:'钟嵘',isCorrect:false},{text:'萧统',isCorrect:false},{text:'韩愈',isCorrect:false}] },
  { id: 'southHot_chinese_4_006', content: '"锲而不舍"出自哪篇文章？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《劝学》',isCorrect:true},{text:'《师说》',isCorrect:false},{text:'《送东阳马生序》',isCorrect:false},{text:'《为学》',isCorrect:false}] },
]

// === CHINESE D5 (7题, grade 9) - Sample 5题 ===
const chineseD5Questions: Question[] = [
  { id: 'southHot_chinese_5_001', content: '"长太息以掩涕兮"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'哀民生之多艰',isCorrect:true},{text:'虽九死其犹未悔',isCorrect:false},{text:'路漫漫其修远兮',isCorrect:false},{text:'吾将上下而求索',isCorrect:false}] },
  { id: 'southHot_chinese_5_002', content: '《二十四史》包括从哪个朝代开始的历史？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'夏',isCorrect:false},{text:'商',isCorrect:false},{text:'周',isCorrect:true},{text:'秦',isCorrect:false}] },
  { id: 'southHot_chinese_5_003', content: '"春江潮水连海平"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'海上明月共潮生',isCorrect:true},{text:'江月何年初照人',isCorrect:false},{text:'人生代代无穷已',isCorrect:false},{text:'江潭落月复西斜',isCorrect:false}] },
  { id: 'southHot_chinese_5_004', content: '《人间词话》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'鲁迅',isCorrect:false},{text:'王国维',isCorrect:true},{text:'胡适',isCorrect:false},{text:'陈寅恪',isCorrect:false}] },
  { id: 'southHot_chinese_5_005', content: '"明月松间照"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'清风半夜鸣蝉',isCorrect:false},{text:'清泉石上流',isCorrect:true},{text:'听取蛙声一片',isCorrect:false},{text:'稻花香里说丰年',isCorrect:false}] },
  { id: 'southHot_chinese_5_006', content: '《楚辞》的主要作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'宋玉',isCorrect:false},{text:'屈原',isCorrect:true},{text:'贾谊',isCorrect:false},{text:'刘向',isCorrect:false}] },
  { id: 'southHot_chinese_5_007', content: '"过尽千帆皆不是"下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'肠断白苹洲',isCorrect:true},{text:'斜晖脉脉水悠悠',isCorrect:false},{text:'梦长君不知',isCorrect:false},{text:'千万和春住',isCorrect:false}] },
]

// === ENGLISH D1 (20题, grade 1-3) - Sample 8题 ===
const englishD1Questions: Question[] = [
  { id: 'southHot_english_1_001', content: 'What is "鸟" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Fish',isCorrect:false},{text:'Bird',isCorrect:true},{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:false}] },
  { id: 'southHot_english_1_002', content: 'How do you spell "sun"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'s-u-n',isCorrect:true},{text:'s-o-n',isCorrect:false},{text:'s-a-n',isCorrect:false},{text:'s-e-n',isCorrect:false}] },
  { id: 'southHot_english_1_003', content: '"绿色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:true},{text:'Yellow',isCorrect:false},{text:'Purple',isCorrect:false}] },
  { id: 'southHot_english_1_004', content: 'What number is "10"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Eight',isCorrect:false},{text:'Nine',isCorrect:false},{text:'Ten',isCorrect:true},{text:'Eleven',isCorrect:false}] },
  { id: 'southHot_english_1_005', content: 'What is "鱼"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:true},{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:false}] },
  { id: 'southHot_english_1_006', content: 'Thank you! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:false},{text:'Thanks',isCorrect:true},{text:'Command',isCorrect:false}] },
  { id: 'southHot_english_1_007', content: 'What color is the sun?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:false},{text:'Yellow',isCorrect:true},{text:'White',isCorrect:false}] },
  { id: 'southHot_english_1_008', content: '"星星" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Moon',isCorrect:false},{text:'Star',isCorrect:true},{text:'Cloud',isCorrect:false}] },
]

// === ENGLISH D2 (25题, grade 4-5) - Sample 8题 ===
const englishD2Questions: Question[] = [
  { id: 'southHot_english_2_001', content: 'What is the past tense of "see"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Seed',isCorrect:false},{text:'Saw',isCorrect:true},{text:'Seen',isCorrect:false},{text:'Seeing',isCorrect:false}] },
  { id: 'southHot_english_2_002', content: 'They ___ football now.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'play',isCorrect:false},{text:'plays',isCorrect:false},{text:'playing',isCorrect:false},{text:'are playing',isCorrect:true}] },
  { id: 'southHot_english_2_003', content: 'What is the plural of "leaf"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Leafs',isCorrect:false},{text:'Leaves',isCorrect:true},{text:'Leafes',isCorrect:false},{text:'Leaf',isCorrect:false}] },
  { id: 'southHot_english_2_004', content: 'There is ___ water in the glass.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:false},{text:'some',isCorrect:true},{text:'many',isCorrect:false}] },
  { id: 'southHot_english_2_005', content: 'What time is it? 7:30', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Seven',isCorrect:false},{text:'Seven thirty',isCorrect:true},{text:'Seven and half',isCorrect:false},{text:'Half seven',isCorrect:false}] },
  { id: 'southHot_english_2_006', content: 'My mother ___ cooking dinner now.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'was',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'southHot_english_2_007', content: 'I have ___ finished my homework.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'southHot_english_2_008', content: 'The opposite of "light" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'heavy',isCorrect:true},{text:'dark',isCorrect:false},{text:'small',isCorrect:false},{text:'thin',isCorrect:false}] },
]

// === ENGLISH D3 (30题, grade 6-7) - Sample 8题 ===
const englishD3Questions: Question[] = [
  { id: 'southHot_english_3_001', content: 'If I ___ rich, I would travel the world.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'southHot_english_3_002', content: 'The book ___ by millions of people.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is loved',isCorrect:true},{text:'loves',isCorrect:false},{text:'loved',isCorrect:false},{text:'loving',isCorrect:false}] },
  { id: 'southHot_english_3_003', content: 'Neither he nor I ___ wrong.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'southHot_english_3_004', content: 'I have been learning English ___ 2019.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'for',isCorrect:false},{text:'since',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'southHot_english_3_005', content: 'Which sentence uses the subjunctive correctly?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'If I was you, I would go',isCorrect:false},{text:'If I were you, I would go',isCorrect:true},{text:'If I am you, I would go',isCorrect:false},{text:'If I be you, I would go',isCorrect:false}] },
  { id: 'southHot_english_3_006', content: 'He suggested ___ the meeting.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'postpone',isCorrect:false},{text:'to postpone',isCorrect:true},{text:'postponing',isCorrect:false},{text:'postponed',isCorrect:false}] },
  { id: 'southHot_english_3_007', content: 'By next year, I ___ here for five years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'will work',isCorrect:false},{text:'will have worked',isCorrect:true},{text:'will be working',isCorrect:false},{text:'work',isCorrect:false}] },
  { id: 'southHot_english_3_008', content: 'No sooner ___ than it started to rain.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'he arrived',isCorrect:false},{text:'did he arrive',isCorrect:true},{text:'had he arrived',isCorrect:false},{text:'he had arrived',isCorrect:false}] },
]

// === ENGLISH D4 (18题, grade 8) - Sample 6题 ===
const englishD4Questions: Question[] = [
  { id: 'southHot_english_4_001', content: 'The passive voice of "Someone is helping them" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'They are being helped',isCorrect:true},{text:'They is being helped',isCorrect:false},{text:'They are helped',isCorrect:false},{text:'They was being helped',isCorrect:false}] },
  { id: 'southHot_english_4_002', content: 'It is essential that he ___ on time.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'arrive',isCorrect:true},{text:'arrives',isCorrect:false},{text:'arriving',isCorrect:false},{text:'arrived',isCorrect:false}] },
  { id: 'southHot_english_4_003', content: 'Which word is a conjunction?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Although',isCorrect:true},{text:'Run',isCorrect:false}] },
  { id: 'southHot_english_4_004', content: '___ he was tired, he continued walking.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Despite',isCorrect:false},{text:'Although',isCorrect:true},{text:'Since of',isCorrect:false}] },
  { id: 'southHot_english_4_005', content: 'He acted ___ nothing had happened.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'southHot_english_4_006', content: 'The word "unbelievable" has ___ prefix(es).', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'one',isCorrect:false},{text:'two',isCorrect:true},{text:'three',isCorrect:false},{text:'none',isCorrect:false}] },
]

// === ENGLISH D5 (7题, grade 9) - Sample 5题 ===
const englishD5Questions: Question[] = [
  { id: 'southHot_english_5_001', content: 'Should ___ have called, I would have helped.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'you',isCorrect:false},{text:'he',isCorrect:false},{text:'they',isCorrect:false},{text:'you have',isCorrect:true}] },
  { id: 'southHot_english_5_002', content: 'At no time ___ such a thing.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'I have heard',isCorrect:false},{text:'have I heard',isCorrect:true},{text:'I heard',isCorrect:false},{text:'did I hear',isCorrect:false}] },
  { id: 'southHot_english_5_003', content: 'I would have succeeded ___ your guidance.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'but for',isCorrect:true},{text:'despite',isCorrect:false},{text:'without',isCorrect:false},{text:'if not for',isCorrect:false}] },
  { id: 'southHot_english_5_004', content: '___ the weather improves, we will cancel the event.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'Should',isCorrect:true},{text:'Would',isCorrect:false},{text:'Could',isCorrect:false},{text:'Might',isCorrect:false}] },
  { id: 'southHot_english_5_005', content: 'Hardly ___ when the phone rang.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'I had sat down',isCorrect:false},{text:'had I sat down',isCorrect:true},{text:'I sat down',isCorrect:false},{text:'did I sit down',isCorrect:false}] },
  { id: 'southHot_english_5_006', content: 'It is high time we ___ something about it.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'do',isCorrect:true},{text:'did',isCorrect:false},{text:'would do',isCorrect:false},{text:'had done',isCorrect:false}] },
  { id: 'southHot_english_5_007', content: 'Only after the war ___ how much damage was done.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'we realized',isCorrect:false},{text:'did we realize',isCorrect:true},{text:'we had realized',isCorrect:false},{text:'had we realized',isCorrect:false}] },
]

// === SCIENCE D1 (20题, grade 1-3) - Sample 8题 ===
const scienceD1Questions: Question[] = [
  { id: 'southHot_science_1_001', content: '水在什么温度会沸腾？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'100°C',isCorrect:true},{text:'200°C',isCorrect:false}] },
  { id: 'southHot_science_1_002', content: '月亮是什么形状？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'正方形',isCorrect:false},{text:'三角形',isCorrect:false},{text:'圆形',isCorrect:true},{text:'长方形',isCorrect:false}] },
  { id: 'southHot_science_1_003', content: '人体最大的器官是？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'心脏',isCorrect:false},{text:'大脑',isCorrect:false},{text:'皮肤',isCorrect:true},{text:'胃',isCorrect:false}] },
  { id: 'southHot_science_1_004', content: '植物需要什么才能生长？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'水和阳光',isCorrect:true},{text:'土壤和石头',isCorrect:false},{text:'空气和风',isCorrect:false},{text:'温度和冰',isCorrect:false}] },
  { id: 'southHot_science_1_005', content: '鸟会做什么？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'游泳',isCorrect:false},{text:'飞',isCorrect:true},{text:'爬树',isCorrect:false},{text:'挖洞',isCorrect:false}] },
  { id: 'southHot_science_1_006', content: '水有几种形态？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'一种',isCorrect:false},{text:'两种',isCorrect:false},{text:'三种',isCorrect:true},{text:'四种',isCorrect:false}] },
  { id: 'southHot_science_1_007', content: '什么动物会游泳？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'猫',isCorrect:false},{text:'狗',isCorrect:false},{text:'鱼',isCorrect:true},{text:'鸟',isCorrect:false}] },
  { id: 'southHot_science_1_008', content: '地球是什么形状？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'平的',isCorrect:false},{text:'正方形',isCorrect:false},{text:'圆形',isCorrect:false},{text:'球形',isCorrect:true}] },
]

// === SCIENCE D2 (25题, grade 4-5) - Sample 8题 ===
const scienceD2Questions: Question[] = [
  { id: 'southHot_science_2_001', content: '植物的种子是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'只靠人',isCorrect:false},{text:'只靠动物',isCorrect:false},{text:'风、水、动物等多种方式',isCorrect:true},{text:'只靠风',isCorrect:false}] },
  { id: 'southHot_science_2_002', content: '人体的骨骼有多少块？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'106块',isCorrect:false},{text:'206块',isCorrect:true},{text:'306块',isCorrect:false},{text:'406块',isCorrect:false}] },
  { id: 'southHot_science_2_003', content: '光在均匀介质中是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'曲线传播',isCorrect:false},{text:'直线传播',isCorrect:true},{text:'来回折返',isCorrect:false},{text:'螺旋传播',isCorrect:false}] },
  { id: 'southHot_science_2_004', content: '什么是动物的夏眠？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在夏天繁殖',isCorrect:false},{text:'动物在夏天睡觉',isCorrect:true},{text:'动物在夏天迁徙',isCorrect:false},{text:'动物在夏天吃东西',isCorrect:false}] },
  { id: 'southHot_science_2_005', content: '什么是导体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'不能导电的物质',isCorrect:false},{text:'容易导电的物质',isCorrect:true},{text:'很难导电的物质',isCorrect:false},{text:'只有金属能导电',isCorrect:false}] },
  { id: 'southHot_science_2_006', content: '水的三种形态是什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'固体、液体、气体',isCorrect:true},{text:'水、冰、蒸汽',isCorrect:false},{text:'雨、雪、雾',isCorrect:false},{text:'河流、湖泊、海洋',isCorrect:false}] },
  { id: 'southHot_science_2_007', content: '磁铁的同极会怎样？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'相吸',isCorrect:false},{text:'相斥',isCorrect:true},{text:'没反应',isCorrect:false},{text:'有时相吸有时相斥',isCorrect:false}] },
  { id: 'southHot_science_2_008', content: '地球绕太阳转叫什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'自转',isCorrect:false},{text:'公转',isCorrect:true},{text:'旋转',isCorrect:false},{text:'移动',isCorrect:false}] },
]

// === SCIENCE D3 (30题, grade 6-7) - Sample 8题 ===
const scienceD3Questions: Question[] = [
  { id: 'southHot_science_3_001', content: '植物细胞特有的结构是？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'细胞壁、叶绿体、液泡',isCorrect:true},{text:'细胞膜、细胞核、细胞质',isCorrect:false},{text:'线粒体、叶绿体、细胞核',isCorrect:false},{text:'细胞壁、线粒体、液泡',isCorrect:false}] },
  { id: 'southHot_science_3_002', content: '光的反射定律是什么？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'入射角与反射角无关',isCorrect:false}] },
  { id: 'southHot_science_3_003', content: '地球自转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一年',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一天',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'southHot_science_3_004', content: '什么是呼吸作用？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'吸收氧气释放二氧化碳',isCorrect:true},{text:'吸收二氧化碳释放氧气',isCorrect:false},{text:'只吸收氧气',isCorrect:false},{text:'只释放二氧化碳',isCorrect:false}] },
  { id: 'southHot_science_3_005', content: '压强的单位是什么？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'牛顿',isCorrect:false},{text:'帕斯卡',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'焦耳',isCorrect:false}] },
  { id: 'southHot_science_3_006', content: '什么是免疫系统？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'抵抗疾病的身体防御系统',isCorrect:true},{text:'消化食物的系统',isCorrect:false},{text:'运输血液的系统',isCorrect:false},{text:'呼吸空气的系统',isCorrect:false}] },
  { id: 'southHot_science_3_007', content: '大气层的作用是什么？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'只有保护作用',isCorrect:false},{text:'调节气候、阻挡紫外线、保温',isCorrect:true},{text:'只提供氧气',isCorrect:false},{text:'没有任何作用',isCorrect:false}] },
  { id: 'southHot_science_3_008', content: '什么是化学变化？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质形状改变但本质不变',isCorrect:false},{text:'物质本质改变生成新物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质位置改变',isCorrect:false}] },
]

// === SCIENCE D4 (18题, grade 8) - Sample 6题 ===
const scienceD4Questions: Question[] = [
  { id: 'southHot_science_4_001', content: '电流的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'伏特',isCorrect:false},{text:'安培',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'欧姆',isCorrect:false}] },
  { id: 'southHot_science_4_002', content: '速度的国际单位是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'km/h',isCorrect:false},{text:'m/s',isCorrect:true},{text:'km/s',isCorrect:false},{text:'m/h',isCorrect:false}] },
  { id: 'southHot_science_4_003', content: '染色体由什么组成？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'蛋白质',isCorrect:false},{text:'DNA和蛋白质',isCorrect:true},{text:'RNA和蛋白质',isCorrect:false},{text:'只有DNA',isCorrect:false}] },
  { id: 'southHot_science_4_004', content: '太阳系中有多少颗行星？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'7颗',isCorrect:false},{text:'8颗',isCorrect:true},{text:'9颗',isCorrect:false},{text:'10颗',isCorrect:false}] },
  { id: 'southHot_science_4_005', content: '什么是动能？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'物体由于位置而具有的能量',isCorrect:false},{text:'物体由于运动而具有的能量',isCorrect:true},{text:'物体由于形状而具有的能量',isCorrect:false},{text:'物体由于温度而具有的能量',isCorrect:false}] },
  { id: 'southHot_science_4_006', content: '什么是显性基因？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'在杂交中表现出来的基因',isCorrect:true},{text:'在杂交中隐藏的基因',isCorrect:false},{text:'不能表达性状的基因',isCorrect:false},{text:'只存在于男性的基因',isCorrect:false}] },
]

// === SCIENCE D5 (7题, grade 9) - Sample 5题 ===
const scienceD5Questions: Question[] = [
  { id: 'southHot_science_5_001', content: '广义相对论主要研究什么？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'微观粒子',isCorrect:false},{text:'时空与引力',isCorrect:true},{text:'电磁波',isCorrect:false},{text:'热力学',isCorrect:false}] },
  { id: 'southHot_science_5_002', content: '强相互作用力主要作用在？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'电子和原子核之间',isCorrect:false},{text:'质子和中子之间',isCorrect:true},{text:'电子和电子之间',isCorrect:false},{text:'原子和原子之间',isCorrect:false}] },
  { id: 'southHot_science_5_003', content: '量子力学的基本原理是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'确定性',isCorrect:false},{text:'不确定性原理',isCorrect:true},{text:'因果性',isCorrect:false},{text:'连续性',isCorrect:false}] },
  { id: 'southHot_science_5_004', content: '宇宙微波背景辐射的温度大约是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'2.7K',isCorrect:true},{text:'27K',isCorrect:false},{text:'270K',isCorrect:false},{text:'2700K',isCorrect:false}] },
  { id: 'southHot_science_5_005', content: '什么是希格斯玻色子？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'赋予粒子质量的粒子',isCorrect:true},{text:'一种光粒子',isCorrect:false},{text:'一种中微子',isCorrect:false},{text:'一种引力子',isCorrect:false}] },
  { id: 'southHot_science_5_006', content: 'DNA复制发生在？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'细胞质',isCorrect:false},{text:'细胞核',isCorrect:true},{text:'线粒体',isCorrect:false},{text:'核糖体',isCorrect:false}] },
  { id: 'southHot_science_5_007', content: '光的本质是什么？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'只有粒子性',isCorrect:false},{text:'只有波动性',isCorrect:false},{text:'具有波粒二象性',isCorrect:true},{text:'既不是粒子也不是波',isCorrect:false}] },
]

// === HISTORY D1 (20题, grade 1-3) - Sample 8题 ===
const historyD1Questions: Question[] = [
  { id: 'southHot_history_1_001', content: '中国第一个皇帝是谁？', type: 'single', difficulty: 1, category: 'history', grade: 1, options: [{text:'刘邦',isCorrect:false},{text:'秦始皇',isCorrect:true},{text:'项羽',isCorrect:false},{text:'韩信',isCorrect:false}] },
  { id: 'southHot_history_1_002', content: '长城是谁建造的？', type: 'single', difficulty: 1, category: 'history', grade: 1, options: [{text:'秦始皇',isCorrect:true},{text:'刘邦',isCorrect:false},{text:'刘备',isCorrect:false},{text:'曹操',isCorrect:false}] },
  { id: 'southHot_history_1_003', content: '三国是指哪三个国家？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'秦、楚、汉',isCorrect:false},{text:'魏、蜀、吴',isCorrect:true},{text:'赵、燕、齐',isCorrect:false},{text:'晋、宋、齐',isCorrect:false}] },
  { id: 'southHot_history_1_004', content: '《西游记》中的唐僧取经去哪里？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'日本',isCorrect:false},{text:'印度',isCorrect:true},{text:'韩国',isCorrect:false},{text:'泰国',isCorrect:false}] },
  { id: 'southHot_history_1_005', content: '造纸术是谁发明的？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'张衡',isCorrect:false},{text:'蔡伦',isCorrect:true},{text:'毕昇',isCorrect:false},{text:'华佗',isCorrect:false}] },
  { id: 'southHot_history_1_006', content: '指南针最早叫什么？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'司南',isCorrect:true},{text:'罗盘',isCorrect:false},{text:'指南车',isCorrect:false},{text:'指南针',isCorrect:false}] },
  { id: 'southHot_history_1_007', content: '唐朝的开国皇帝是？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'李世民',isCorrect:false},{text:'李渊',isCorrect:true},{text:'李隆基',isCorrect:false},{text:'李建成',isCorrect:false}] },
  { id: 'southHot_history_1_008', content: '南宋的第一个皇帝是？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'赵构',isCorrect:true},{text:'赵匡胤',isCorrect:false},{text:'赵鼎',isCorrect:false},{text:'赵昚',isCorrect:false}] },
]

// === HISTORY D2 (25题, grade 4-5) - Sample 8题 ===
const historyD2Questions: Question[] = [
  { id: 'southHot_history_2_001', content: '《史记》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'司马光',isCorrect:false},{text:'司马迁',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
  { id: 'southHot_history_2_002', content: '唐朝著名诗人李白被称为什么？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'诗圣',isCorrect:false},{text:'诗仙',isCorrect:true},{text:'诗佛',isCorrect:false},{text:'诗鬼',isCorrect:false}] },
  { id: 'southHot_history_2_003', content: '北宋的第一个皇帝是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'赵匡胤',isCorrect:true},{text:'赵构',isCorrect:false},{text:'赵鼎',isCorrect:false},{text:'赵昚',isCorrect:false}] },
  { id: 'southHot_history_2_004', content: '明代 famous航海家是谁？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'张骞',isCorrect:false},{text:'郑和',isCorrect:true},{text:'鉴真',isCorrect:false},{text:'玄奘',isCorrect:false}] },
  { id: 'southHot_history_2_005', content: '活字印刷术是谁发明的？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'蔡伦',isCorrect:false},{text:'毕昇',isCorrect:true},{text:'沈括',isCorrect:false},{text:'宋应星',isCorrect:false}] },
  { id: 'southHot_history_2_006', content: '《资治通鉴》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'司马迁',isCorrect:false},{text:'司马光',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
  { id: 'southHot_history_2_007', content: '清朝的开国皇帝是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'乾隆',isCorrect:false},{text:'康熙',isCorrect:false},{text:'皇太极',isCorrect:true},{text:'努尔哈赤',isCorrect:false}] },
  { id: 'southHot_history_2_008', content: '甲午战争发生在哪一年？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'1840年',isCorrect:false},{text:'1894年',isCorrect:true},{text:'1900年',isCorrect:false},{text:'1911年',isCorrect:false}] },
]

// === HISTORY D3 (30题, grade 6-7) - Sample 8题 ===
const historyD3Questions: Question[] = [
  { id: 'southHot_history_3_001', content: '五四运动发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1915年',isCorrect:false},{text:'1919年',isCorrect:true},{text:'1921年',isCorrect:false},{text:'1927年',isCorrect:false}] },
  { id: 'southHot_history_3_002', content: '中国共产党的成立时间是？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:true},{text:'1927年',isCorrect:false},{text:'1935年',isCorrect:false}] },
  { id: 'southHot_history_3_003', content: '抗日战争胜利是哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1945年',isCorrect:true},{text:'1949年',isCorrect:false},{text:'1950年',isCorrect:false},{text:'1937年',isCorrect:false}] },
  { id: 'southHot_history_3_004', content: '商鞅变法发生在哪个国家？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'楚国',isCorrect:false},{text:'秦国',isCorrect:true},{text:'齐国',isCorrect:false},{text:'燕国',isCorrect:false}] },
  { id: 'southHot_history_3_005', content: '丝绸之路的开辟和哪个朝代有关？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'汉朝',isCorrect:true},{text:'唐朝',isCorrect:false},{text:'明朝',isCorrect:false},{text:'宋朝',isCorrect:false}] },
  { id: 'southHot_history_3_006', content: '玄奘取经发生在哪个朝代？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'汉朝',isCorrect:false},{text:'南北朝',isCorrect:false},{text:'唐朝',isCorrect:true},{text:'宋朝',isCorrect:false}] },
  { id: 'southHot_history_3_007', content: '郑和下西洋最远到达哪里？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'非洲东海岸',isCorrect:true},{text:'欧洲',isCorrect:false},{text:'美洲',isCorrect:false},{text:'澳大利亚',isCorrect:false}] },
  { id: 'southHot_history_3_008', content: '第一次鸦片战争爆发于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'1839年',isCorrect:false},{text:'1840年',isCorrect:true},{text:'1842年',isCorrect:false},{text:'1856年',isCorrect:false}] },
]

// === HISTORY D4 (18题, grade 8) - Sample 6题 ===
const historyD4Questions: Question[] = [
  { id: 'southHot_history_4_001', content: '洋务运动的口号是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'自强、求富',isCorrect:true},{text:'民主、科学',isCorrect:false},{text:'救亡图存',isCorrect:false},{text:'中学为体，西学为用',isCorrect:false}] },
  { id: 'southHot_history_4_002', content: '戊戌变法发生在哪个皇帝在位时？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'咸丰帝',isCorrect:false},{text:'光绪帝',isCorrect:true},{text:'宣统帝',isCorrect:false},{text:'慈禧太后',isCorrect:false}] },
  { id: 'southHot_history_4_003', content: '辛亥革命的指导思想是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'三民主义',isCorrect:true},{text:'马克思主义',isCorrect:false},{text:'民主科学',isCorrect:false},{text:'社会主义',isCorrect:false}] },
  { id: 'southHot_history_4_004', content: '中国同盟会成立于哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1894年',isCorrect:false},{text:'1905年',isCorrect:true},{text:'1911年',isCorrect:false},{text:'1919年',isCorrect:false}] },
  { id: 'southHot_history_4_005', content: '新文化运动的主要阵地是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'《新青年》',isCorrect:true},{text:'《民报》',isCorrect:false},{text:'《时务报》',isCorrect:false},{text:'《国闻报》',isCorrect:false}] },
  { id: 'southHot_history_4_006', content: '科举制度正式废除于哪个朝代？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'宋朝',isCorrect:false},{text:'明朝',isCorrect:false},{text:'清朝',isCorrect:true},{text:'元朝',isCorrect:false}] },
]

// === HISTORY D5 (7题, grade 9) - Sample 5题 ===
const historyD5Questions: Question[] = [
  { id: 'southHot_history_5_001', content: '文艺复兴运动起源于哪个国家？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'法国',isCorrect:false},{text:'英国',isCorrect:false},{text:'意大利',isCorrect:true},{text:'西班牙',isCorrect:false}] },
  { id: 'southHot_history_5_002', content: '法国大革命爆发的标志是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'攻占巴士底狱',isCorrect:true},{text:'《人权宣言》发表',isCorrect:false},{text:'拿破仑掌权',isCorrect:false},{text:'三级会议召开',isCorrect:false}] },
  { id: 'southHot_history_5_003', content: '第一次世界大战的导火索是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'萨拉热窝事件',isCorrect:true},{text:'德国闪击波兰',isCorrect:false},{text:'俄国十月革命',isCorrect:false},{text:'凡尔登战役',isCorrect:false}] },
  { id: 'southHot_history_5_004', content: '《凡尔赛和约》的主要内容是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'建立联合国',isCorrect:false},{text:'对德国进行惩罚和限制',isCorrect:true},{text:'瓜分德国殖民地',isCorrect:false},{text:'赔偿美国损失',isCorrect:false}] },
  { id: 'southHot_history_5_005', content: '十月革命发生在哪一年？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'1914年',isCorrect:false},{text:'1917年',isCorrect:true},{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:false}] },
  { id: 'southHot_history_5_006', content: '冷战后期的特点是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'美苏争霸',isCorrect:true},{text:'法西斯崛起',isCorrect:false},{text:'社会主义运动',isCorrect:false},{text:'殖民主义扩张',isCorrect:false}] },
  { id: 'southHot_history_5_007', content: '布雷顿森林体系确立了什么的地位？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'英镑',isCorrect:false},{text:'美元',isCorrect:true},{text:'黄金',isCorrect:false},{text:'欧元',isCorrect:false}] },
]

// Combine all questions
export const southHotQuestions: Question[] = [
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
  ...historyD1Questions,
  ...historyD2Questions,
  ...historyD3Questions,
  ...historyD4Questions,
  ...historyD5Questions,
]

export const southHotQuestionBank = createSouthHotOceanQuestionBank('southHot', southHotQuestions)