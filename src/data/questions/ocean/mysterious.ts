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

function createMysteriousOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
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

// === MATH D1 (5题, grade 1-3) - Sample 5题 ===
const mathD1Questions: Question[] = [
  { id: 'mysterious_math_1_001', content: '6 + 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false},{text:'10',isCorrect:false}] },
  { id: 'mysterious_math_1_002', content: '10 - 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'mysterious_math_1_003', content: '3 × 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'9',isCorrect:true},{text:'12',isCorrect:false},{text:'15',isCorrect:false}] },
  { id: 'mysterious_math_1_004', content: '20 ÷ 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false},{text:'6',isCorrect:false}] },
  { id: 'mysterious_math_1_005', content: '50 + 30 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'70',isCorrect:false},{text:'80',isCorrect:true},{text:'90',isCorrect:false},{text:'100',isCorrect:false}] },
]

// === MATH D2 (10题, grade 4-5) - Sample 6题 ===
const mathD2Questions: Question[] = [
  { id: 'mysterious_math_2_001', content: '245 + 389 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'624',isCorrect:false},{text:'634',isCorrect:true},{text:'644',isCorrect:false},{text:'654',isCorrect:false}] },
  { id: 'mysterious_math_2_002', content: '876 - 498 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'368',isCorrect:false},{text:'378',isCorrect:true},{text:'388',isCorrect:false},{text:'398',isCorrect:false}] },
  { id: 'mysterious_math_2_003', content: '45 × 18 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'800',isCorrect:false},{text:'810',isCorrect:true},{text:'820',isCorrect:false},{text:'830',isCorrect:false}] },
  { id: 'mysterious_math_2_004', content: '720 ÷ 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'46',isCorrect:false},{text:'47',isCorrect:false},{text:'48',isCorrect:true},{text:'49',isCorrect:false}] },
  { id: 'mysterious_math_2_005', content: '6.3 + 4.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'10.1',isCorrect:false},{text:'11.0',isCorrect:false},{text:'11.1',isCorrect:true},{text:'12.0',isCorrect:false}] },
  { id: 'mysterious_math_2_006', content: '9.6 - 5.7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3.7',isCorrect:false},{text:'3.8',isCorrect:false},{text:'3.9',isCorrect:true},{text:'4.9',isCorrect:false}] },
]

// === MATH D3 (25题, grade 6-7) - Sample 8题 ===
const mathD3Questions: Question[] = [
  { id: 'mysterious_math_3_001', content: '-10 + 6 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-16',isCorrect:false},{text:'-4',isCorrect:true},{text:'4',isCorrect:false},{text:'16',isCorrect:false}] },
  { id: 'mysterious_math_3_002', content: '(-3) × (-9) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-27',isCorrect:false},{text:'27',isCorrect:true},{text:'-12',isCorrect:false},{text:'12',isCorrect:false}] },
  { id: 'mysterious_math_3_003', content: '5³ = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'15',isCorrect:false},{text:'25',isCorrect:false},{text:'125',isCorrect:true},{text:'625',isCorrect:false}] },
  { id: 'mysterious_math_3_004', content: '∛64 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'mysterious_math_3_005', content: '5x + 8 = 28, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false},{text:'6',isCorrect:false}] },
  { id: 'mysterious_math_3_006', content: '4(x - 3) = 32, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:true},{text:'12',isCorrect:false},{text:'13',isCorrect:false}] },
  { id: 'mysterious_math_3_007', content: '80% of 350 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'260',isCorrect:false},{text:'270',isCorrect:false},{text:'280',isCorrect:true},{text:'290',isCorrect:false}] },
  { id: 'mysterious_math_3_008', content: '√225 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false},{text:'17',isCorrect:false}] },
]

// === MATH D4 (35题, grade 8) - Sample 10题 ===
const mathD4Questions: Question[] = [
  { id: 'mysterious_math_4_001', content: 'x² - 8x + 15 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'2, 8',isCorrect:false},{text:'3, 5',isCorrect:true},{text:'-3, -5',isCorrect:false},{text:'-2, -8',isCorrect:false}] },
  { id: 'mysterious_math_4_002', content: 'y = 4x - 7, when x = 3, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'3',isCorrect:false},{text:'5',isCorrect:true},{text:'7',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'mysterious_math_4_003', content: 'sin(60°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'√2/2',isCorrect:false},{text:'√3/2',isCorrect:true}] },
  { id: 'mysterious_math_4_004', content: 'a⁶ ÷ a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a³',isCorrect:false},{text:'a⁴',isCorrect:true},{text:'a⁸',isCorrect:false},{text:'a¹²',isCorrect:false}] },
  { id: 'mysterious_math_4_005', content: '(x+4)(x-4) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-16',isCorrect:true},{text:'x²+16',isCorrect:false},{text:'x²-8x+16',isCorrect:false},{text:'x²+8x-16',isCorrect:false}] },
  { id: 'mysterious_math_4_006', content: '√98 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'7√2',isCorrect:true},{text:'2√7',isCorrect:false},{text:'7√3',isCorrect:false},{text:'3√7',isCorrect:false}] },
  { id: 'mysterious_math_4_007', content: '如果一次函数的斜率是-3，截距是5，函数是？', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'y = -3x + 5',isCorrect:true},{text:'y = 3x + 5',isCorrect:false},{text:'y = -3x - 5',isCorrect:false},{text:'y = 3x - 5',isCorrect:false}] },
  { id: 'mysterious_math_4_008', content: 'cos(45°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'√2/2',isCorrect:true},{text:'√3/2',isCorrect:false}] },
  { id: 'mysterious_math_4_009', content: '如果x:y = 3:4，且x = 15，则y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'18',isCorrect:false},{text:'20',isCorrect:true},{text:'22',isCorrect:false},{text:'24',isCorrect:false}] },
  { id: 'mysterious_math_4_010', content: 'tan(30°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'1',isCorrect:false},{text:'√3',isCorrect:false},{text:'√3/3',isCorrect:true},{text:'0',isCorrect:false}] },
]

// === MATH D5 (25题, grade 9) - Sample 10题 ===
const mathD5Questions: Question[] = [
  { id: 'mysterious_math_5_001', content: 'x² + 5x + 6 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'-2, -3',isCorrect:true},{text:'2, 3',isCorrect:false},{text:'-2, 3',isCorrect:false},{text:'2, -3',isCorrect:false}] },
  { id: 'mysterious_math_5_002', content: 'd/dx (3x⁵) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'3x⁴',isCorrect:false},{text:'15x⁴',isCorrect:true},{text:'15x⁵',isCorrect:false},{text:'5x⁴',isCorrect:false}] },
  { id: 'mysterious_math_5_003', content: 'log₂(64) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'mysterious_math_5_004', content: 'sin(90°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'√2/2',isCorrect:false}] },
  { id: 'mysterious_math_5_005', content: '∫(6x²) dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'6x³ + C',isCorrect:false},{text:'2x³ + C',isCorrect:true},{text:'3x³ + C',isCorrect:false},{text:'12x + C',isCorrect:false}] },
  { id: 'mysterious_math_5_006', content: 'If tan(θ) = 1, θ = ? (0° < θ < 90°)', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'30°',isCorrect:false},{text:'45°',isCorrect:true},{text:'60°',isCorrect:false},{text:'90°',isCorrect:false}] },
  { id: 'mysterious_math_5_007', content: 'ln(e³) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'e',isCorrect:false}] },
  { id: 'mysterious_math_5_008', content: '如果函数f(x) = x² - 3x + 2，则f(2) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:true},{text:'1',isCorrect:false},{text:'2',isCorrect:false},{text:'3',isCorrect:false}] },
  { id: 'mysterious_math_5_009', content: '∫sin(x) dx = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'cos(x) + C',isCorrect:false},{text:'-cos(x) + C',isCorrect:true},{text:'sin(x) + C',isCorrect:false},{text:'-sin(x) + C',isCorrect:false}] },
  { id: 'mysterious_math_5_010', content: 'lim(x→0) (sin(x))/x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'∞',isCorrect:false},{text:'不存在',isCorrect:false}] },
]

// === CHINESE D1 (5题, grade 1-3) - Sample 5题 ===
const chineseD1Questions: Question[] = [
  { id: 'mysterious_chinese_1_001', content: '"天"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'mysterious_chinese_1_002', content: '"日"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'月亮',isCorrect:false},{text:'太阳',isCorrect:true},{text:'星星',isCorrect:false},{text:'云',isCorrect:false}] },
  { id: 'mysterious_chinese_1_003', content: '下列哪个是水果？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'白菜',isCorrect:false},{text:'苹果',isCorrect:true},{text:'萝卜',isCorrect:false},{text:'青菜',isCorrect:false}] },
  { id: 'mysterious_chinese_1_004', content: '"上"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'下',isCorrect:true},{text:'前',isCorrect:false},{text:'左',isCorrect:false},{text:'高',isCorrect:false}] },
  { id: 'mysterious_chinese_1_005', content: '"好"字可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'好人',isCorrect:true},{text:'好学',isCorrect:false},{text:'好处',isCorrect:false},{text:'好吃',isCorrect:false}] },
]

// === CHINESE D2 (10题, grade 4-5) - Sample 6题 ===
const chineseD2Questions: Question[] = [
  { id: 'mysterious_chinese_2_001', content: '《枫桥夜泊》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'张继',isCorrect:true},{text:'张说',isCorrect:false},{text:'张九龄',isCorrect:false},{text:'张籍',isCorrect:false}] },
  { id: 'mysterious_chinese_2_002', content: '"独在异乡为异客"下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'每逢佳节倍思亲',isCorrect:true},{text:'遍插茱萸少一人',isCorrect:false},{text:'遥知兄弟登高处',isCorrect:false},{text:'何当共剪西窗烛',isCorrect:false}] },
  { id: 'mysterious_chinese_2_003', content: '下列哪个是形声字？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'人',isCorrect:false},{text:'日',isCorrect:false},{text:'明',isCorrect:true},{text:'上',isCorrect:false}] },
  { id: 'mysterious_chinese_2_004', content: '《悯农》其二的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'李绅',isCorrect:true},{text:'白居易',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'mysterious_chinese_2_005', content: '"谁知盘中餐"下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'粒粒皆辛苦',isCorrect:true},{text:'汗滴禾下土',isCorrect:false},{text:'春种一粒粟',isCorrect:false},{text:'秋收万颗子',isCorrect:false}] },
  { id: 'mysterious_chinese_2_006', content: '下列哪个不是四大名著？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'西游记',isCorrect:false},{text:'红楼梦',isCorrect:false},{text:'儒林外史',isCorrect:true},{text:'三国演义',isCorrect:false}] },
]

// === CHINESE D3 (25题, grade 6-7) - Sample 8题 ===
const chineseD3Questions: Question[] = [
  { id: 'mysterious_chinese_3_001', content: '《使至塞上》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'王维',isCorrect:true},{text:'孟浩然',isCorrect:false},{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false}] },
  { id: 'mysterious_chinese_3_002', content: '"大漠孤烟直"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'长河落日圆',isCorrect:true},{text:'黄河入海流',isCorrect:false},{text:'明月出天山',isCorrect:false},{text:'千里暮云平',isCorrect:false}] },
  { id: 'mysterious_chinese_3_003', content: '《钱塘湖春行》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'白居易',isCorrect:true},{text:'韩愈',isCorrect:false},{text:'柳宗元',isCorrect:false},{text:'刘禹锡',isCorrect:false}] },
  { id: 'mysterious_chinese_3_004', content: '"两岸猿声啼不住"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'轻舟已过万重山',isCorrect:true},{text:'两岸青山相对出',isCorrect:false},{text:'孤帆远影碧空尽',isCorrect:false},{text:'千里江陵一日还',isCorrect:false}] },
  { id: 'mysterious_chinese_3_005', content: '《爱莲说》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'周敦颐',isCorrect:true},{text:'陶渊明',isCorrect:false},{text:'刘禹锡',isCorrect:false},{text:'韩愈',isCorrect:false}] },
  { id: 'mysterious_chinese_3_006', content: '"出淤泥而不染"赞美的是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'菊花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'梅花',isCorrect:false},{text:'牡丹',isCorrect:false}] },
  { id: 'mysterious_chinese_3_007', content: '《最后一课》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'都德',isCorrect:true},{text:'莫泊桑',isCorrect:false},{text:'雨果',isCorrect:false},{text:'巴尔扎克',isCorrect:false}] },
  { id: 'mysterious_chinese_3_008', content: '《天净沙·秋思》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'马致远',isCorrect:true},{text:'关汉卿',isCorrect:false},{text:'白朴',isCorrect:false},{text:'郑光祖',isCorrect:false}] },
]

// === CHINESE D4 (35题, grade 8) - Sample 10题 ===
const chineseD4Questions: Question[] = [
  { id: 'mysterious_chinese_4_001', content: '《窦娥冤》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'关汉卿',isCorrect:true},{text:'王实甫',isCorrect:false},{text:'马致远',isCorrect:false},{text:'白朴',isCorrect:false}] },
  { id: 'mysterious_chinese_4_002', content: '《牡丹亭》的主要人物是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'崔莺莺',isCorrect:false},{text:'杜丽娘',isCorrect:true},{text:'林黛玉',isCorrect:false},{text:'薛宝钗',isCorrect:false}] },
  { id: 'mysterious_chinese_4_003', content: '"学而时习之"出自哪里？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'mysterious_chinese_4_004', content: '《少年闰土》选自鲁迅的哪部作品？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《呐喊》',isCorrect:false},{text:'《彷徨》',isCorrect:false},{text:'《朝花夕拾》',isCorrect:true},{text:'《野草》',isCorrect:false}] },
  { id: 'mysterious_chinese_4_005', content: '《背影》描写的父亲是去哪里给儿子买橘子？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'北京站',isCorrect:false},{text:'南京站',isCorrect:false},{text:'徐州站',isCorrect:true},{text:'上海站',isCorrect:false}] },
  { id: 'mysterious_chinese_4_006', content: '《桃花源记》中渔人是怎么发现桃花源的？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'迷路了',isCorrect:false},{text:'顺着桃花林走',isCorrect:true},{text:'被人带领',isCorrect:false},{text:'做梦',isCorrect:false}] },
  { id: 'mysterious_chinese_4_007', content: '《岳阳楼记》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'范仲淹',isCorrect:true},{text:'欧阳修',isCorrect:false},{text:'王安石',isCorrect:false},{text:'苏轼',isCorrect:false}] },
  { id: 'mysterious_chinese_4_008', content: '"先天下之忧而忧"体现的思想是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'个人主义',isCorrect:false},{text:'爱国主义',isCorrect:true},{text:'享乐主义',isCorrect:false},{text:'悲观主义',isCorrect:false}] },
  { id: 'mysterious_chinese_4_009', content: '《答谢中书书》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'陶弘景',isCorrect:true},{text:'吴均',isCorrect:false},{text:'郦道元',isCorrect:false},{text:'谢灵运',isCorrect:false}] },
  { id: 'mysterious_chinese_4_010', content: '"山川之美"下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'古来共谈',isCorrect:true},{text:'天下壮观',isCorrect:false},{text:'人间胜境',isCorrect:false},{text:'千古名篇',isCorrect:false}] },
]

// === CHINESE D5 (25题, grade 9) - Sample 10题 ===
const chineseD5Questions: Question[] = [
  { id: 'mysterious_chinese_5_001', content: '《楚辞·九歌·国殇》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'屈原',isCorrect:true},{text:'宋玉',isCorrect:false},{text:'贾谊',isCorrect:false},{text:'刘向',isCorrect:false}] },
  { id: 'mysterious_chinese_5_002', content: '"身既死兮神以灵"下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'魂魄毅兮为鬼雄',isCorrect:true},{text:'子魂魄兮为鬼雄',isCorrect:false},{text:'国殇兮魂魄毅',isCorrect:false},{text:'鬼雄兮魂魄毅',isCorrect:false}] },
  { id: 'mysterious_chinese_5_003', content: '《二十四史》最后一部是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'《明史》',isCorrect:false},{text:'《清史稿》',isCorrect:true},{text:'《宋史》',isCorrect:false},{text:'《元史》',isCorrect:false}] },
  { id: 'mysterious_chinese_5_004', content: '《织梦者》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'张炜',isCorrect:false},{text:'韩少功',isCorrect:false},{text:'王小波',isCorrect:true},{text:'余华',isCorrect:false}] },
  { id: 'mysterious_chinese_5_005', content: '王国维《人间词话》中提到的"第一境界"是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'昨夜西风凋碧树',isCorrect:true},{text:'衣带渐宽终不悔',isCorrect:false},{text:'众里寻他千百度',isCorrect:false},{text:'那人却在灯火阑珊处',isCorrect:false}] },
  { id: 'mysterious_chinese_5_006', content: '《诗经》"风雅颂"中"雅"指的是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'民间歌谣',isCorrect:false},{text:'宫廷乐曲',isCorrect:true},{text:'宗庙祭祀',isCorrect:false},{text:'战争歌曲',isCorrect:false}] },
  { id: 'mysterious_chinese_5_007', content: '"满招损"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'谦受益',isCorrect:true},{text:'傲招祸',isCorrect:false},{text:'满必亡',isCorrect:false},{text:'满则溢',isCorrect:false}] },
  { id: 'mysterious_chinese_5_008', content: '《伶官传序》的作者是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'欧阳修',isCorrect:true},{text:'韩愈',isCorrect:false},{text:'柳宗元',isCorrect:false},{text:'王安石',isCorrect:false}] },
  { id: 'mysterious_chinese_5_009', content: '"忧劳可以兴国"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'逸豫可以亡身',isCorrect:true},{text:'勤俭可以兴家',isCorrect:false},{text:'骄奢可以败国',isCorrect:false},{text:'安逸可以亡身',isCorrect:false}] },
  { id: 'mysterious_chinese_5_010', content: '《项脊轩志》表达了什么情感？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'对故乡的思念',isCorrect:false},{text:'对亡妻的怀念',isCorrect:false},{text:'对项脊轩的留恋和对亲人的思念',isCorrect:true},{text:'对仕途的感慨',isCorrect:false}] },
]

// === ENGLISH D1 (5题, grade 1-3) - Sample 5题 ===
const englishD1Questions: Question[] = [
  { id: 'mysterious_english_1_001', content: 'What is "狗" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'mysterious_english_1_002', content: 'How do you spell "book"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'b-o-o-k',isCorrect:true},{text:'b-u-o-k',isCorrect:false},{text:'b-o-k',isCorrect:false},{text:'b-u-k',isCorrect:false}] },
  { id: 'mysterious_english_1_003', content: '"白色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Black',isCorrect:false},{text:'White',isCorrect:true},{text:'Gray',isCorrect:false},{text:'Brown',isCorrect:false}] },
  { id: 'mysterious_english_1_004', content: 'What number is "7"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Five',isCorrect:false},{text:'Six',isCorrect:false},{text:'Seven',isCorrect:true},{text:'Eight',isCorrect:false}] },
  { id: 'mysterious_english_1_005', content: 'What is "山"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'River',isCorrect:false},{text:'Lake',isCorrect:false},{text:'Mountain',isCorrect:true},{text:'Sea',isCorrect:false}] },
]

// === ENGLISH D2 (10题, grade 4-5) - Sample 6题 ===
const englishD2Questions: Question[] = [
  { id: 'mysterious_english_2_001', content: 'What is the past tense of "read"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Readed',isCorrect:false},{text:'Read',isCorrect:true},{text:'Red',isCorrect:false},{text:'Reading',isCorrect:false}] },
  { id: 'mysterious_english_2_002', content: 'She ___ to school every day.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'go',isCorrect:false},{text:'goes',isCorrect:true},{text:'going',isCorrect:false},{text:'went',isCorrect:false}] },
  { id: 'mysterious_english_2_003', content: 'What is the plural of "woman"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Womans',isCorrect:false},{text:'Womens',isCorrect:false},{text:'Women',isCorrect:true},{text:'Woman',isCorrect:false}] },
  { id: 'mysterious_english_2_004', content: 'I saw ___ elephant at the zoo.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'mysterious_english_2_005', content: 'What time is it? 2:30', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Two',isCorrect:false},{text:'Half past two',isCorrect:true},{text:'Two and half',isCorrect:false},{text:'Half two',isCorrect:false}] },
  { id: 'mysterious_english_2_006', content: 'My grandmother ___ cooking every day.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'like',isCorrect:false},{text:'likes',isCorrect:true},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
]

// === ENGLISH D3 (25题, grade 6-7) - Sample 8题 ===
const englishD3Questions: Question[] = [
  { id: 'mysterious_english_3_001', content: 'If I ___ rich, I would buy a house.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'mysterious_english_3_002', content: 'The song ___ by many people.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is loved',isCorrect:true},{text:'loves',isCorrect:false},{text:'loved',isCorrect:false},{text:'loving',isCorrect:false}] },
  { id: 'mysterious_english_3_003', content: 'Either you or I ___ wrong.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'mysterious_english_3_004', content: 'I have been learning English ___ 2019.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'for',isCorrect:false},{text:'since',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'mysterious_english_3_005', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He don t know',isCorrect:false},{text:'He doesn t knows',isCorrect:false},{text:'He doesn t know',isCorrect:true},{text:'He don t knows',isCorrect:false}] },
  { id: 'mysterious_english_3_006', content: 'The teacher asked us ___ the exercise.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'complete',isCorrect:false},{text:'to complete',isCorrect:true},{text:'completing',isCorrect:false},{text:'completed',isCorrect:false}] },
  { id: 'mysterious_english_3_007', content: 'By the time I arrived, they ___ all the food.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'ate',isCorrect:false},{text:'had eaten',isCorrect:true},{text:'have eaten',isCorrect:false},{text:'were eating',isCorrect:false}] },
  { id: 'mysterious_english_3_008', content: 'Hardly ___ when the phone rang.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'I had sat down',isCorrect:false},{text:'had I sat down',isCorrect:true},{text:'I sat down',isCorrect:false},{text:'did I sit down',isCorrect:false}] },
]

// === ENGLISH D4 (35题, grade 8) - Sample 10题 ===
const englishD4Questions: Question[] = [
  { id: 'mysterious_english_4_001', content: 'The passive voice of "They are building a house" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'A house is being built',isCorrect:true},{text:'A house is building',isCorrect:false},{text:'A house was built',isCorrect:false},{text:'A house is built',isCorrect:false}] },
  { id: 'mysterious_english_4_002', content: 'I suggest that he ___ the doctor.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'see',isCorrect:true},{text:'to see',isCorrect:false},{text:'seeing',isCorrect:false},{text:'saw',isCorrect:false}] },
  { id: 'mysterious_english_4_003', content: 'Which word is an adverb?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Beautiful',isCorrect:false},{text:'Quickly',isCorrect:true},{text:'Happy',isCorrect:false},{text:'Tall',isCorrect:false}] },
  { id: 'mysterious_english_4_004', content: '___ the rain, we stayed home.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Because of',isCorrect:true},{text:'Since',isCorrect:false},{text:'As result of',isCorrect:false}] },
  { id: 'mysterious_english_4_005', content: 'He acted ___ he had seen a ghost.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'mysterious_english_4_006', content: 'The word "immediately" is a/an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'adjective',isCorrect:false},{text:'verb',isCorrect:false},{text:'adverb',isCorrect:true},{text:'conjunction',isCorrect:false}] },
  { id: 'mysterious_english_4_007', content: 'The letter ___ yesterday.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'should receive',isCorrect:false},{text:'should be received',isCorrect:true},{text:'should have received',isCorrect:false},{text:'should received',isCorrect:false}] },
  { id: 'mysterious_english_4_008', content: 'I would rather you ___ home now.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'leave',isCorrect:true},{text:'left',isCorrect:false},{text:'leaving',isCorrect:false},{text:'to leave',isCorrect:false}] },
  { id: 'mysterious_english_4_009', content: 'Not only ___ the award, but she also gave a speech.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'she won',isCorrect:false},{text:'did she win',isCorrect:true},{text:'won she',isCorrect:false},{text:'she did win',isCorrect:false}] },
  { id: 'mysterious_english_4_010', content: 'The building ___ when the earthquake struck.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'was being built',isCorrect:true},{text:'was built',isCorrect:false},{text:'is built',isCorrect:false},{text:'has been built',isCorrect:false}] },
]

// === ENGLISH D5 (25题, grade 9) - Sample 10题 ===
const englishD5Questions: Question[] = [
  { id: 'mysterious_english_5_001', content: 'Had I known you were coming, I ___ you at the airport.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'would meet',isCorrect:false},{text:'would have met',isCorrect:true},{text:'will meet',isCorrect:false},{text:'met',isCorrect:false}] },
  { id: 'mysterious_english_5_002', content: 'Not only ___ the game, but she also won the trophy.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'she won',isCorrect:false},{text:'did she win',isCorrect:true},{text:'won she',isCorrect:false},{text:'she did win',isCorrect:false}] },
  { id: 'mysterious_english_5_003', content: 'I would have succeeded ___ your help.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'but for',isCorrect:true},{text:'despite',isCorrect:false},{text:'without',isCorrect:false},{text:'if not for',isCorrect:false}] },
  { id: 'mysterious_english_5_004', content: '___ the weather improves, we will cancel the event.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'Should',isCorrect:true},{text:'Would',isCorrect:false},{text:'Could',isCorrect:false},{text:'Might',isCorrect:false}] },
  { id: 'mysterious_english_5_005', content: 'Hardly ___ when the lights went out.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'he had sat down',isCorrect:false},{text:'had he sat down',isCorrect:true},{text:'he sat down',isCorrect:false},{text:'did he sit down',isCorrect:false}] },
  { id: 'mysterious_english_5_006', content: 'It is high time we ___ something about it.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'do',isCorrect:true},{text:'did',isCorrect:false},{text:'would do',isCorrect:false},{text:'had done',isCorrect:false}] },
  { id: 'mysterious_english_5_007', content: 'Only after the war ___ how much damage was done.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'we realized',isCorrect:false},{text:'did we realize',isCorrect:true},{text:'we had realized',isCorrect:false},{text:'had we realized',isCorrect:false}] },
  { id: 'mysterious_english_5_008', content: 'I never thought she ___ such a mistake.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'will make',isCorrect:false},{text:'would make',isCorrect:true},{text:'would have made',isCorrect:false},{text:'made',isCorrect:false}] },
  { id: 'mysterious_english_5_009', content: 'Were it ___ the expense, I would buy a new car.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'not for',isCorrect:true},{text:'for',isCorrect:false},{text:'about',isCorrect:false},{text:'to',isCorrect:false}] },
  { id: 'mysterious_english_5_010', content: 'I would appreciate ___ if you could reply soon.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'that',isCorrect:false},{text:'this',isCorrect:false},{text:'it',isCorrect:true},{text:'you',isCorrect:false}] },
]

// === SCIENCE D1 (5题, grade 1-3) - Sample 5题 ===
const scienceD1Questions: Question[] = [
  { id: 'mysterious_science_1_001', content: '水在什么温度沸腾？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:false},{text:'100°C',isCorrect:true},{text:'50°C',isCorrect:false},{text:'200°C',isCorrect:false}] },
  { id: 'mysterious_science_1_002', content: '太阳从哪里升起？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'西边',isCorrect:false},{text:'东边',isCorrect:true},{text:'南边',isCorrect:false},{text:'北边',isCorrect:false}] },
  { id: 'mysterious_science_1_003', content: '植物需要什么？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'水和阳光',isCorrect:true},{text:'土壤和石头',isCorrect:false},{text:'空气和风',isCorrect:false},{text:'温度和冰',isCorrect:false}] },
  { id: 'mysterious_science_1_004', content: '人体最大的器官是？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'心脏',isCorrect:false},{text:'大脑',isCorrect:false},{text:'皮肤',isCorrect:true},{text:'胃',isCorrect:false}] },
  { id: 'mysterious_science_1_005', content: '什么能发光？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'月亮',isCorrect:false},{text:'太阳',isCorrect:true},{text:'地球',isCorrect:false},{text:'石头',isCorrect:false}] },
]

// === SCIENCE D2 (10题, grade 4-5) - Sample 6题 ===
const scienceD2Questions: Question[] = [
  { id: 'mysterious_science_2_001', content: '植物的光合作用需要什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'阳光、水、二氧化碳',isCorrect:true},{text:'阳光、水、氧气',isCorrect:false},{text:'水、土壤、阳光',isCorrect:false},{text:'二氧化碳、土壤、水',isCorrect:false}] },
  { id: 'mysterious_science_2_002', content: '人体的骨骼有多少块？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'106块',isCorrect:false},{text:'206块',isCorrect:true},{text:'306块',isCorrect:false},{text:'406块',isCorrect:false}] },
  { id: 'mysterious_science_2_003', content: '声音是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'通过空气振动',isCorrect:true},{text:'通过光线',isCorrect:false},{text:'通过水',isCorrect:false},{text:'通过固体',isCorrect:false}] },
  { id: 'mysterious_science_2_004', content: '什么是动物的冬眠？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在冬天睡觉',isCorrect:true},{text:'动物在冬天吃东西',isCorrect:false},{text:'动物在冬天繁殖',isCorrect:false},{text:'动物在冬天迁徙',isCorrect:false}] },
  { id: 'mysterious_science_2_005', content: '电路的基本组成部分是？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'电源、导线、开关',isCorrect:true},{text:'灯泡、电池、插座',isCorrect:false},{text:'电线、灯泡、墙壁',isCorrect:false},{text:'开关、电池、电动机',isCorrect:false}] },
  { id: 'mysterious_science_2_006', content: '水的循环包括哪三个过程？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'蒸发、凝结、降水',isCorrect:true},{text:'融化、凝固、蒸发',isCorrect:false},{text:'蒸发、凝固、降水',isCorrect:false},{text:'凝结、融化、降水',isCorrect:false}] },
]

// === SCIENCE D3 (25题, grade 6-7) - Sample 8题 ===
const scienceD3Questions: Question[] = [
  { id: 'mysterious_science_3_001', content: '细胞的基本结构包括？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'细胞壁、细胞膜、细胞核',isCorrect:true},{text:'细胞膜、细胞质、细胞核',isCorrect:false},{text:'细胞壁、细胞质、叶绿体',isCorrect:false},{text:'细胞膜、叶绿体、液泡',isCorrect:false}] },
  { id: 'mysterious_science_3_002', content: '光的折射发生在什么情况下？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光从空气进入水或玻璃时',isCorrect:true},{text:'光在空气中传播时',isCorrect:false},{text:'光被镜子反射时',isCorrect:false},{text:'光穿过真空时',isCorrect:false}] },
  { id: 'mysterious_science_3_003', content: '地球公转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一天',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一年',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'mysterious_science_3_004', content: '什么是新陈代谢？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'生物体内化学反应的总和',isCorrect:true},{text:'细胞的分裂过程',isCorrect:false},{text:'能量转换的过程',isCorrect:false},{text:'营养物质的吸收',isCorrect:false}] },
  { id: 'mysterious_science_3_005', content: '力的三要素是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'大小、方向、作用点',isCorrect:true},{text:'质量、速度、加速度',isCorrect:false},{text:'长度、宽度、高度',isCorrect:false},{text:'重力、摩擦力、弹力',isCorrect:false}] },
  { id: 'mysterious_science_3_006', content: '什么是消化系统的主要功能？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'分解食物并吸收营养',isCorrect:true},{text:'运输氧气',isCorrect:false},{text:'排出废物',isCorrect:false},{text:'调节体温',isCorrect:false}] },
  { id: 'mysterious_science_3_007', content: '大气层的主要成分是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'氮气和氧气',isCorrect:true},{text:'氧气和二氧化碳',isCorrect:false},{text:'氮气和二氧化碳',isCorrect:false},{text:'氢气和氧气',isCorrect:false}] },
  { id: 'mysterious_science_3_008', content: '什么是反射定律？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'入射角与反射角互补',isCorrect:false}] },
]

// === SCIENCE D4 (35题, grade 8) - Sample 10题 ===
const scienceD4Questions: Question[] = [
  { id: 'mysterious_science_4_001', content: '欧姆定律的公式是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'V = IR',isCorrect:true},{text:'V = I/R',isCorrect:false},{text:'V = R/I',isCorrect:false},{text:'V = I + R',isCorrect:false}] },
  { id: 'mysterious_science_4_002', content: '加速度的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'m/s',isCorrect:false},{text:'m/s²',isCorrect:true},{text:'kg·m/s',isCorrect:false},{text:'N/kg',isCorrect:false}] },
  { id: 'mysterious_science_4_003', content: 'DNA的中文名称是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'核糖核酸',isCorrect:false},{text:'脱氧核糖核酸',isCorrect:true},{text:'蛋白质',isCorrect:false},{text:'氨基酸',isCorrect:false}] },
  { id: 'mysterious_science_4_004', content: '地球内部结构包括？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地壳、地幔、地核',isCorrect:true},{text:'地壳、地核、海洋',isCorrect:false},{text:'地幔、外核、内核',isCorrect:false},{text:'大陆、海洋、地核',isCorrect:false}] },
  { id: 'mysterious_science_4_005', content: '什么是能量守恒定律？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'能量不会消失也不会创造，只能转换',isCorrect:true},{text:'能量可以创造也可以消失',isCorrect:false},{text:'能量在封闭系统中会减少',isCorrect:false},{text:'能量在开放系统中会减少',isCorrect:false}] },
  { id: 'mysterious_science_4_006', content: '遗传的基本单位是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'染色体',isCorrect:false},{text:'基因',isCorrect:true},{text:'DNA',isCorrect:false},{text:'细胞',isCorrect:false}] },
  { id: 'mysterious_science_4_007', content: '太阳系中有多少颗行星？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'7颗',isCorrect:false},{text:'8颗',isCorrect:true},{text:'9颗',isCorrect:false},{text:'10颗',isCorrect:false}] },
  { id: 'mysterious_science_4_008', content: '什么是动能定理？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'合外力做的功等于物体动能的变化',isCorrect:true},{text:'动能与质量成正比',isCorrect:false},{text:'动能与速度成正比',isCorrect:false},{text:'动能是守恒的',isCorrect:false}] },
  { id: 'mysterious_science_4_009', content: '什么是染色体数目变异？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'染色体结构的改变',isCorrect:false},{text:'染色体数目的增加或减少',isCorrect:true},{text:'基因突变',isCorrect:false},{text:'DNA复制错误',isCorrect:false}] },
  { id: 'mysterious_science_4_010', content: '地球的自转周期是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'约24小时',isCorrect:true},{text:'约365天',isCorrect:false},{text:'约30天',isCorrect:false},{text:'约12小时',isCorrect:false}] },
]

// === SCIENCE D5 (25题, grade 9) - Sample 10题 ===
const scienceD5Questions: Question[] = [
  { id: 'mysterious_science_5_001', content: '相对论是谁提出的？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'牛顿',isCorrect:false},{text:'爱因斯坦',isCorrect:true},{text:'伽利略',isCorrect:false},{text:'霍金',isCorrect:false}] },
  { id: 'mysterious_science_5_002', content: 'E = mc² 是什么方程？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'质能方程',isCorrect:true},{text:'运动方程',isCorrect:false},{text:'电磁方程',isCorrect:false},{text:'热力学方程',isCorrect:false}] },
  { id: 'mysterious_science_5_003', content: '量子力学研究的对象是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'宏观物体',isCorrect:false},{text:'微观粒子',isCorrect:true},{text:'天体运动',isCorrect:false},{text:'化学反应',isCorrect:false}] },
  { id: 'mysterious_science_5_004', content: '宇宙大爆炸理论认为宇宙的年龄大约是多少？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'几十亿年',isCorrect:false},{text:'几百亿年',isCorrect:false},{text:'138亿年',isCorrect:true},{text:'数千亿年',isCorrect:false}] },
  { id: 'mysterious_science_5_005', content: '什么是暗物质？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'看不见的物质',isCorrect:false},{text:'不发光但有引力的未知物质',isCorrect:true},{text:'黑洞中的物质',isCorrect:false},{text:'宇宙尘埃',isCorrect:false}] },
  { id: 'mysterious_science_5_006', content: '强相互作用力主要作用在？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'电子和原子核之间',isCorrect:false},{text:'质子和中子之间',isCorrect:true},{text:'电子和电子之间',isCorrect:false},{text:'原子和原子之间',isCorrect:false}] },
  { id: 'mysterious_science_5_007', content: '什么是量子纠缠？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'一个粒子分裂成两个粒子',isCorrect:false},{text:'两个粒子之间存在超距关联',isCorrect:true},{text:'粒子在时空中移动',isCorrect:false},{text:'粒子的随机运动',isCorrect:false}] },
  { id: 'mysterious_science_5_008', content: '宇宙微波背景辐射的温度大约是？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'2.7K',isCorrect:true},{text:'27K',isCorrect:false},{text:'270K',isCorrect:false},{text:'2700K',isCorrect:false}] },
  { id: 'mysterious_science_5_009', content: '什么是希格斯玻色子？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'赋予粒子质量的粒子',isCorrect:true},{text:'一种光粒子',isCorrect:false},{text:'一种中微子',isCorrect:false},{text:'一种引力子',isCorrect:false}] },
  { id: 'mysterious_science_5_010', content: '光的本质是什么？', type: 'single', difficulty: 5, category: 'science', grade: 9, options: [{text:'只有粒子性',isCorrect:false},{text:'只有波动性',isCorrect:false},{text:'具有波粒二象性',isCorrect:true},{text:'既不是粒子也不是波',isCorrect:false}] },
]

// === PHYSICS D1 (5题, grade 1-3) - Sample 5题 ===
const physicsD1Questions: Question[] = [
  { id: 'mysterious_physics_1_001', content: '什么让东西往下掉？', type: 'single', difficulty: 1, category: 'physics', grade: 1, options: [{text:'重力',isCorrect:true},{text:'风力',isCorrect:false},{text:'推力',isCorrect:false},{text:'拉力',isCorrect:false}] },
  { id: 'mysterious_physics_1_002', content: '影子是怎么形成的？', type: 'single', difficulty: 1, category: 'physics', grade: 1, options: [{text:'光被阻挡',isCorrect:true},{text:'光穿过物体',isCorrect:false},{text:'物体发光',isCorrect:false},{text:'光被反射',isCorrect:false}] },
  { id: 'mysterious_physics_1_003', content: '什么东西能发出声音？', type: 'single', difficulty: 1, category: 'physics', grade: 2, options: [{text:'振动的东西',isCorrect:true},{text:'静止的东西',isCorrect:false},{text:'透明的东西',isCorrect:false},{text:'软的东西',isCorrect:false}] },
  { id: 'mysterious_physics_1_004', content: '光的传播方式是怎样的？', type: 'single', difficulty: 1, category: 'physics', grade: 2, options: [{text:'曲线',isCorrect:false},{text:'直线',isCorrect:true},{text:'环形',isCorrect:false},{text:'无规律',isCorrect:false}] },
  { id: 'mysterious_physics_1_005', content: '镜子能反射什么？', type: 'single', difficulty: 1, category: 'physics', grade: 3, options: [{text:'声音',isCorrect:false},{text:'光',isCorrect:true},{text:'热',isCorrect:false},{text:'水',isCorrect:false}] },
]

// === PHYSICS D2 (10题, grade 4-5) - Sample 6题 ===
const physicsD2Questions: Question[] = [
  { id: 'mysterious_physics_2_001', content: '声音是由什么产生的？', type: 'single', difficulty: 2, category: 'physics', grade: 4, options: [{text:'振动',isCorrect:true},{text:'光',isCorrect:false},{text:'热',isCorrect:false},{text:'颜色',isCorrect:false}] },
  { id: 'mysterious_physics_2_002', content: '凸透镜有什么作用？', type: 'single', difficulty: 2, category: 'physics', grade: 4, options: [{text:'发散光线',isCorrect:false},{text:'会聚光线',isCorrect:true},{text:'阻挡光线',isCorrect:false},{text:'反射光线',isCorrect:false}] },
  { id: 'mysterious_physics_2_003', content: '什么是热传导？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'热通过空气传递',isCorrect:false},{text:'热通过直接接触传递',isCorrect:true},{text:'热通过液体传递',isCorrect:false},{text:'热通过太阳传递',isCorrect:false}] },
  { id: 'mysterious_physics_2_004', content: '什么是光的反射？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'光进入物体后改变方向',isCorrect:false},{text:'光碰到表面后返回',isCorrect:true},{text:'光被物体吸收',isCorrect:false},{text:'光穿过透明物体',isCorrect:false}] },
  { id: 'mysterious_physics_2_005', content: '什么是热辐射？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'热通过物体传递',isCorrect:false},{text:'热以电磁波形式传递',isCorrect:true},{text:'热通过液体传递',isCorrect:false},{text:'热通过气体传递',isCorrect:false}] },
  { id: 'mysterious_physics_2_006', content: '声音在什么中传播最快？', type: 'single', difficulty: 2, category: 'physics', grade: 5, options: [{text:'空气',isCorrect:false},{text:'水',isCorrect:false},{text:'固体',isCorrect:true},{text:'真空',isCorrect:false}] },
]

// === PHYSICS D3 (25题, grade 6-7) - Sample 8题 ===
const physicsD3Questions: Question[] = [
  { id: 'mysterious_physics_3_001', content: '力的国际单位是？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'焦耳',isCorrect:false},{text:'牛顿',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'帕斯卡',isCorrect:false}] },
  { id: 'mysterious_physics_3_002', content: '速度的国际单位是？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'m/s',isCorrect:true},{text:'km/h',isCorrect:false},{text:'m/s²',isCorrect:false},{text:'N',isCorrect:false}] },
  { id: 'mysterious_physics_3_003', content: '光的反射定律是什么？', type: 'single', difficulty: 3, category: 'physics', grade: 6, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'两者之和等于90度',isCorrect:false}] },
  { id: 'mysterious_physics_3_004', content: '什么是动能？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体由于位置具有的能量',isCorrect:false},{text:'物体由于运动具有的能量',isCorrect:true},{text:'物体由于形变具有的能量',isCorrect:false},{text:'物体由于温度具有的能量',isCorrect:false}] },
  { id: 'mysterious_physics_3_005', content: '什么是重力势能？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体由于运动具有的能量',isCorrect:false},{text:'物体由于位置具有的能量',isCorrect:true},{text:'物体由于形变具有的能量',isCorrect:false},{text:'物体由于温度具有的能量',isCorrect:false}] },
  { id: 'mysterious_physics_3_006', content: '杠杆平衡的条件是？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'动力乘以动力臂等于阻力乘以阻力臂',isCorrect:true},{text:'动力等于阻力',isCorrect:false},{text:'动力臂等于阻力臂',isCorrect:false},{text:'动力加动力臂等于阻力加阻力臂',isCorrect:false}] },
  { id: 'mysterious_physics_3_007', content: '什么是比热容？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'物体吸热的能力',isCorrect:false},{text:'单位质量物质升高1度所需的热量',isCorrect:true},{text:'物体的温度',isCorrect:false},{text:'物体的热量',isCorrect:false}] },
  { id: 'mysterious_physics_3_008', content: '什么是频率？', type: 'single', difficulty: 3, category: 'physics', grade: 7, options: [{text:'1秒内振动的次数',isCorrect:true},{text:'振动的大小',isCorrect:false},{text:'振动所需的时间',isCorrect:false},{text:'振动传播的速度',isCorrect:false}] },
]

// === PHYSICS D4 (35题, grade 8) - Sample 10题 ===
const physicsD4Questions: Question[] = [
  { id: 'mysterious_physics_4_001', content: '压强的国际单位是？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'牛顿',isCorrect:false},{text:'帕斯卡',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'焦耳',isCorrect:false}] },
  { id: 'mysterious_physics_4_002', content: '如果速度加倍，动能怎么变化？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'加倍',isCorrect:false},{text:'变成4倍',isCorrect:true},{text:'变成8倍',isCorrect:false},{text:'不变',isCorrect:false}] },
  { id: 'mysterious_physics_4_003', content: '欧姆定律的公式是？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'V = IR',isCorrect:true},{text:'V = I/R',isCorrect:false},{text:'V = R/I',isCorrect:false},{text:'V = I + R',isCorrect:false}] },
  { id: 'mysterious_physics_4_004', content: '什么是波长？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'波振动一次的距离',isCorrect:false},{text:'相邻波峰或波谷之间的距离',isCorrect:true},{text:'波传播的速度',isCorrect:false},{text:'波振动的高度',isCorrect:false}] },
  { id: 'mysterious_physics_4_005', content: '什么是功率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'做功的多少',isCorrect:false},{text:'做功的快慢',isCorrect:true},{text:'做功的效率',isCorrect:false},{text:'做功的时间',isCorrect:false}] },
  { id: 'mysterious_physics_4_006', content: '什么是机械效率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'有用功与总功的比值',isCorrect:true},{text:'总功与有用功的比值',isCorrect:false},{text:'无用功与总功的比值',isCorrect:false},{text:'有用功与无用功的比值',isCorrect:false}] },
  { id: 'mysterious_physics_4_007', content: '什么是折射率？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'光在真空中的速度与在介质中速度的比值',isCorrect:true},{text:'光在介质中的速度',isCorrect:false},{text:'光在真空中的速度',isCorrect:false},{text:'光在介质中与空气中速度的比值',isCorrect:false}] },
  { id: 'mysterious_physics_4_008', content: '什么是共振？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'物体以相同频率振动的现象',isCorrect:true},{text:'物体静止的状态',isCorrect:false},{text:'物体振幅减小的现象',isCorrect:false},{text:'物体随机振动的现象',isCorrect:false}] },
  { id: 'mysterious_physics_4_009', content: '什么是动能定理？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'合外力做的功等于物体动能的变化',isCorrect:true},{text:'动能与质量成正比',isCorrect:false},{text:'动能与速度成正比',isCorrect:false},{text:'动能是守恒的',isCorrect:false}] },
  { id: 'mysterious_physics_4_010', content: '什么是伯努利原理？', type: 'single', difficulty: 4, category: 'physics', grade: 8, options: [{text:'流速大的地方压强小',isCorrect:true},{text:'流速大的地方压强大',isCorrect:false},{text:'流速与压强无关',isCorrect:false},{text:'流速小的地方压强小',isCorrect:false}] },
]

// === PHYSICS D5 (25题, grade 9) - Sample 10题 ===
const physicsD5Questions: Question[] = [
  { id: 'mysterious_physics_5_001', content: '相对论表明物体的质量随速度增加而？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'减少',isCorrect:false},{text:'增加',isCorrect:true},{text:'不变',isCorrect:false},{text:'先增加后减少',isCorrect:false}] },
  { id: 'mysterious_physics_5_002', content: '光电效应证明了什么？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'光具有波动性',isCorrect:false},{text:'光具有粒子性',isCorrect:true},{text:'光没有能量',isCorrect:false},{text:'光只有波动性没有粒子性',isCorrect:false}] },
  { id: 'mysterious_physics_5_003', content: '德布罗意波长适用于？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'只有光子',isCorrect:false},{text:'所有运动的粒子',isCorrect:true},{text:'只有电子',isCorrect:false},{text:'只有原子',isCorrect:false}] },
  { id: 'mysterious_physics_5_004', content: '核聚变是？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'轻核结合形成重核',isCorrect:true},{text:'重核分裂成轻核',isCorrect:false},{text:'原子核释放电子',isCorrect:false},{text:'原子核吸收电子',isCorrect:false}] },
  { id: 'mysterious_physics_5_005', content: '强相互作用力的作用范围是？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'无限远',isCorrect:false},{text:'10^-15米',isCorrect:true},{text:'10^-10米',isCorrect:false},{text:'1米',isCorrect:false}] },
  { id: 'mysterious_physics_5_006', content: '如果一个系统的熵增加，这意味着？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'系统变得更有序',isCorrect:false},{text:'系统变得更无序',isCorrect:true},{text:'系统的能量增加',isCorrect:false},{text:'系统的温度升高',isCorrect:false}] },
  { id: 'mysterious_physics_5_007', content: '什么是引力透镜效应？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'光被引力加速',isCorrect:false},{text:'光被引力弯曲',isCorrect:true},{text:'光被引力吸引',isCorrect:false},{text:'光被引力排斥',isCorrect:false}] },
  { id: 'mysterious_physics_5_008', content: '在量子力学中，测不准原理指出什么不能同时精确测量？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'位置和动量',isCorrect:true},{text:'时间和能量',isCorrect:false},{text:'质量和速度',isCorrect:false},{text:'电荷和电流',isCorrect:false}] },
  { id: 'mysterious_physics_5_009', content: '什么是量子隧穿效应？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'粒子穿越势垒的现象',isCorrect:true},{text:'粒子在势阱中的运动',isCorrect:false},{text:'粒子的随机运动',isCorrect:false},{text:'粒子在原子核外的运动',isCorrect:false}] },
  { id: 'mysterious_physics_5_010', content: '黑洞的事件视界是？', type: 'single', difficulty: 5, category: 'physics', grade: 9, options: [{text:'黑洞的边界，超过这个边界任何东西都无法逃脱',isCorrect:true},{text:'黑洞的中心',isCorrect:false},{text:'黑洞的表面',isCorrect:false},{text:'黑洞的引力范围',isCorrect:false}] },
]

// === CHEMISTRY D1 (5题, grade 1-3) - Sample 5题 ===
const chemistryD1Questions: Question[] = [
  { id: 'mysterious_chemistry_1_001', content: '水是由什么组成的？', type: 'single', difficulty: 1, category: 'chemistry', grade: 1, options: [{text:'氧气和氮气',isCorrect:false},{text:'氢气和氧气',isCorrect:true},{text:'碳和氧',isCorrect:false},{text:'氮和氢',isCorrect:false}] },
  { id: 'mysterious_chemistry_1_002', content: '空气中有多少氧气？', type: 'single', difficulty: 1, category: 'chemistry', grade: 1, options: [{text:'约21%',isCorrect:true},{text:'约78%',isCorrect:false},{text:'约50%',isCorrect:false},{text:'约10%',isCorrect:false}] },
  { id: 'mysterious_chemistry_1_003', content: '什么是铁锈？', type: 'single', difficulty: 1, category: 'chemistry', grade: 2, options: [{text:'铁燃烧后的产物',isCorrect:false},{text:'铁与氧气和水反应后的产物',isCorrect:true},{text:'铁的杂质',isCorrect:false},{text:'铁的另一种形式',isCorrect:false}] },
  { id: 'mysterious_chemistry_1_004', content: '什么是燃烧？', type: 'single', difficulty: 1, category: 'chemistry', grade: 2, options: [{text:'物体变湿',isCorrect:false},{text:'物质与氧气快速反应产生光和热',isCorrect:true},{text:'物体变冷',isCorrect:false},{text:'物体溶解',isCorrect:false}] },
  { id: 'mysterious_chemistry_1_005', content: '什么是二氧化碳？', type: 'single', difficulty: 1, category: 'chemistry', grade: 3, options: [{text:'碳和氢的化合物',isCorrect:false},{text:'碳和氧的化合物',isCorrect:true},{text:'氧和氢的化合物',isCorrect:false},{text:'氮和氧的化合物',isCorrect:false}] },
]

// === CHEMISTRY D2 (10题, grade 4-5) - Sample 6题 ===
const chemistryD2Questions: Question[] = [
  { id: 'mysterious_chemistry_2_001', content: '什么是化学变化？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'物质形状改变但本质不变',isCorrect:false},{text:'物质本质改变生成新物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质位置改变',isCorrect:false}] },
  { id: 'mysterious_chemistry_2_002', content: '什么是物理变化？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'物质本质改变',isCorrect:false},{text:'物质的形状、大小或状态改变但本质不变',isCorrect:true},{text:'生成新物质',isCorrect:false},{text:'物质燃烧',isCorrect:false}] },
  { id: 'mysterious_chemistry_2_003', content: '什么是催化剂？', type: 'single', difficulty: 2, category: 'chemistry', grade: 4, options: [{text:'加快反应的物质',isCorrect:false},{text:'改变化学反应速率但本身不被消耗',isCorrect:true},{text:'参与反应并被消耗',isCorrect:false},{text:'使反应停止',isCorrect:false}] },
  { id: 'mysterious_chemistry_2_004', content: '什么是酸？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'能释放氢氧根离子的物质',isCorrect:false},{text:'能释放氢离子的物质',isCorrect:true},{text:'能接受氢离子的物质',isCorrect:false},{text:'不含氢的物质',isCorrect:false}] },
  { id: 'mysterious_chemistry_2_005', content: '什么是碱？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'能释放氢离子的物质',isCorrect:false},{text:'能释放氢氧根离子的物质',isCorrect:true},{text:'能接受氢氧根离子的物质',isCorrect:false},{text:'不含氢氧根的物质',isCorrect:false}] },
  { id: 'mysterious_chemistry_2_006', content: '什么是中和反应？', type: 'single', difficulty: 2, category: 'chemistry', grade: 5, options: [{text:'酸和碱反应生成盐和水',isCorrect:true},{text:'酸和盐反应',isCorrect:false},{text:'碱和盐反应',isCorrect:false},{text:'两个酸反应',isCorrect:false}] },
]

// === CHEMISTRY D3 (25题, grade 6-7) - Sample 8题 ===
const chemistryD3Questions: Question[] = [
  { id: 'mysterious_chemistry_3_001', content: '原子核由什么组成？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'只有电子',isCorrect:false},{text:'质子和中子',isCorrect:true},{text:'只有质子',isCorrect:false},{text:'电子和中子',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_002', content: '同位素是指什么？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'质子数相同但中子数不同的原子',isCorrect:true},{text:'中子数相同但质子数不同的原子',isCorrect:false},{text:'电子数相同但质子数不同的原子',isCorrect:false},{text:'质子数不同的原子',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_003', content: '什么是离子？', type: 'single', difficulty: 3, category: 'chemistry', grade: 6, options: [{text:'失去或获得电子的原子或分子',isCorrect:true},{text:'没有电子的原子',isCorrect:false},{text:'只有电子的粒子',isCorrect:false},{text:'中性的原子',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_004', content: '什么是化学键？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'原子之间的引力或排斥力',isCorrect:true},{text:'原子之间的距离',isCorrect:false},{text:'原子的大小',isCorrect:false},{text:'原子的重量',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_005', content: '什么是氧化反应？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'物质失去电子的反应',isCorrect:true},{text:'物质获得电子的反应',isCorrect:false},{text:'物质与氢气反应',isCorrect:false},{text:'物质与水反应',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_006', content: '什么是还原反应？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'物质失去电子的反应',isCorrect:false},{text:'物质获得电子的反应',isCorrect:true},{text:'物质与氧气反应',isCorrect:false},{text:'物质与氮气反应',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_007', content: '元素周期表按什么排列？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'原子量',isCorrect:false},{text:'质子数',isCorrect:true},{text:'电子数',isCorrect:false},{text:'中子数',isCorrect:false}] },
  { id: 'mysterious_chemistry_3_008', content: '什么是化合物？', type: 'single', difficulty: 3, category: 'chemistry', grade: 7, options: [{text:'只有一种元素组成的物质',isCorrect:false},{text:'两种或两种以上元素组成的物质',isCorrect:true},{text:'混合物',isCorrect:false},{text:'单质',isCorrect:false}] },
]

// === CHEMISTRY D4 (35题, grade 8) - Sample 10题 ===
const chemistryD4Questions: Question[] = [
  { id: 'mysterious_chemistry_4_001', content: '什么是摩尔质量？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'1摩尔物质的质量',isCorrect:true},{text:'1个粒子的质量',isCorrect:false},{text:'物质的密度',isCorrect:false},{text:'物质的体积',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_002', content: '阿伏伽德罗常数是？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'6.02×10²³',isCorrect:true},{text:'6.02×10²²',isCorrect:false},{text:'6.02×10²⁴',isCorrect:false},{text:'6.02×10²⁵',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_003', content: '什么是共价键？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'金属原子之间的键',isCorrect:false},{text:'非金属原子之间共享电子的键',isCorrect:true},{text:'离子之间的键',isCorrect:false},{text:'原子与离子之间的键',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_004', content: '什么是离子键？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'原子之间共享电子',isCorrect:false},{text:'正负离子之间的静电引力',isCorrect:true},{text:'金属原子之间的键',isCorrect:false},{text:'分子之间的力',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_005', content: '什么是勒夏特列原理？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'反应速率随温度增加而增加',isCorrect:false},{text:'平衡系统受扰动时会向减小扰动的方向移动',isCorrect:true},{text:'反应朝着生成更多产物的方向移动',isCorrect:false},{text:'反应朝着反应物减少的方向移动',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_006', content: '什么是放热反应？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'吸收热量的反应',isCorrect:false},{text:'释放热量的反应',isCorrect:true},{text:'温度不变的反应',isCorrect:false},{text:'需要催化剂的反应',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_007', content: '什么是吸热反应？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'释放热量的反应',isCorrect:false},{text:'吸收热量的反应',isCorrect:true},{text:'温度升高的反应',isCorrect:false},{text:'温度降低的反应',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_008', content: '什么是化学平衡？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'反应完全停止的状态',isCorrect:false},{text:'正逆反应速率相等的状态',isCorrect:true},{text:'反应物全部消耗完的状态',isCorrect:false},{text:'产物全部生成的状态',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_009', content: '什么是化学计量数？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'化学反应中各物质的分子数之比',isCorrect:true},{text:'反应物的总质量',isCorrect:false},{text:'产物的总质量',isCorrect:false},{text:'反应的速率',isCorrect:false}] },
  { id: 'mysterious_chemistry_4_010', content: '什么是活化能？', type: 'single', difficulty: 4, category: 'chemistry', grade: 8, options: [{text:'反应物具有的最低能量',isCorrect:false},{text:'使反应发生所需的最小能量',isCorrect:true},{text:'反应产物的能量',isCorrect:false},{text:'反应的活化焓',isCorrect:false}] },
]

// === CHEMISTRY D5 (25题, grade 9) - Sample 10题 ===
const chemistryD5Questions: Question[] = [
  { id: 'mysterious_chemistry_5_001', content: '什么是电子云？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'电子的轨道',isCorrect:false},{text:'电子在原子核外出现的概率分布',isCorrect:true},{text:'电子的速度',isCorrect:false},{text:'电子的能量',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_002', content: '什么是杂化轨道？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'不同原子轨道的混合',isCorrect:true},{text:'电子云的形状',isCorrect:false},{text:'原子的能级',isCorrect:false},{text:'分子的振动',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_003', content: '什么是电负性？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'原子吸引电子的能力',isCorrect:true},{text:'原子失去电子的能力',isCorrect:false},{text:'原子核的大小',isCorrect:false},{text:'电子的数量',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_004', content: '什么是sp³杂化？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'一个s轨道和三个p轨道的混合',isCorrect:true},{text:'一个s轨道和一个p轨道的混合',isCorrect:false},{text:'两个s轨道和两个p轨道的混合',isCorrect:false},{text:'三个s轨道和一个p轨道的混合',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_005', content: '什么是分子间作用力？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'原子之间的力',isCorrect:false},{text:'分子之间的力',isCorrect:true},{text:'离子之间的力',isCorrect:false},{text:'化学键',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_006', content: '什么是氢键？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'氢原子与其他原子形成的强化学键',isCorrect:false},{text:'氢键是分子间作用力的一种',isCorrect:true},{text:'氢原子失去电子形成的键',isCorrect:false},{text:'氢原子获得电子形成的键',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_007', content: '什么是晶格能？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'晶体中原子振动的能量',isCorrect:false},{text:'气态离子形成固态晶体时释放的能量',isCorrect:true},{text:'晶体的熔点',isCorrect:false},{text:'晶体中电子的能量',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_008', content: '什么是配合物的稳定常数？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'配合物分解的常数',isCorrect:false},{text:'配合物形成程度的常数',isCorrect:true},{text:'配合物的浓度',isCorrect:false},{text:'配合物的颜色',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_009', content: '什么是过渡金属？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'d轨道未完全填满的金属',isCorrect:true},{text:'位于周期表左侧的金属',isCorrect:false},{text:'位于周期表右侧的金属',isCorrect:false},{text:'最活泼的金属',isCorrect:false}] },
  { id: 'mysterious_chemistry_5_010', content: '什么是配合物的晶体场理论？', type: 'single', difficulty: 5, category: 'chemistry', grade: 9, options: [{text:'解释金属离子与配体之间静电作用的理论',isCorrect:true},{text:'解释金属键的理论',isCorrect:false},{text:'解释共价键的理论',isCorrect:false},{text:'解释离子键的理论',isCorrect:false}] },
]

// === HISTORY D1 (5题, grade 1-3) - Sample 5题 ===
const historyD1Questions: Question[] = [
  { id: 'mysterious_history_1_001', content: '中国第一个皇帝是谁？', type: 'single', difficulty: 1, category: 'history', grade: 1, options: [{text:'刘邦',isCorrect:false},{text:'秦始皇',isCorrect:true},{text:'项羽',isCorrect:false},{text:'韩信',isCorrect:false}] },
  { id: 'mysterious_history_1_002', content: '长城是谁建造的？', type: 'single', difficulty: 1, category: 'history', grade: 1, options: [{text:'秦始皇',isCorrect:true},{text:'刘邦',isCorrect:false},{text:'刘备',isCorrect:false},{text:'曹操',isCorrect:false}] },
  { id: 'mysterious_history_1_003', content: '三国是指哪三个国家？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'秦、楚、汉',isCorrect:false},{text:'魏、蜀、吴',isCorrect:true},{text:'赵、燕、齐',isCorrect:false},{text:'晋、宋、齐',isCorrect:false}] },
  { id: 'mysterious_history_1_004', content: '《西游记》中的唐僧取经去哪里？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'日本',isCorrect:false},{text:'印度',isCorrect:true},{text:'韩国',isCorrect:false},{text:'泰国',isCorrect:false}] },
  { id: 'mysterious_history_1_005', content: '造纸术是谁发明的？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'张衡',isCorrect:false},{text:'蔡伦',isCorrect:true},{text:'毕昇',isCorrect:false},{text:'华佗',isCorrect:false}] },
]

// === HISTORY D2 (10题, grade 4-5) - Sample 6题 ===
const historyD2Questions: Question[] = [
  { id: 'mysterious_history_2_001', content: '《史记》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'司马光',isCorrect:false},{text:'司马迁',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
  { id: 'mysterious_history_2_002', content: '唐朝著名诗人李白被称为什么？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'诗圣',isCorrect:false},{text:'诗仙',isCorrect:true},{text:'诗佛',isCorrect:false},{text:'诗鬼',isCorrect:false}] },
  { id: 'mysterious_history_2_003', content: '北宋的第一个皇帝是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'赵匡胤',isCorrect:true},{text:'赵构',isCorrect:false},{text:'赵鼎',isCorrect:false},{text:'赵昚',isCorrect:false}] },
  { id: 'mysterious_history_2_004', content: '明代著名航海家是谁？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'张骞',isCorrect:false},{text:'郑和',isCorrect:true},{text:'鉴真',isCorrect:false},{text:'玄奘',isCorrect:false}] },
  { id: 'mysterious_history_2_005', content: '活字印刷术是谁发明的？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'蔡伦',isCorrect:false},{text:'毕昇',isCorrect:true},{text:'沈括',isCorrect:false},{text:'宋应星',isCorrect:false}] },
  { id: 'mysterious_history_2_006', content: '《资治通鉴》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'司马迁',isCorrect:false},{text:'司马光',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
]

// === HISTORY D3 (25题, grade 6-7) - Sample 8题 ===
const historyD3Questions: Question[] = [
  { id: 'mysterious_history_3_001', content: '五四运动发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1915年',isCorrect:false},{text:'1919年',isCorrect:true},{text:'1921年',isCorrect:false},{text:'1927年',isCorrect:false}] },
  { id: 'mysterious_history_3_002', content: '中国共产党的成立时间是？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:true},{text:'1927年',isCorrect:false},{text:'1935年',isCorrect:false}] },
  { id: 'mysterious_history_3_003', content: '抗日战争胜利是哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1945年',isCorrect:true},{text:'1949年',isCorrect:false},{text:'1950年',isCorrect:false},{text:'1937年',isCorrect:false}] },
  { id: 'mysterious_history_3_004', content: '商鞅变法发生在哪个国家？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'楚国',isCorrect:false},{text:'秦国',isCorrect:true},{text:'齐国',isCorrect:false},{text:'燕国',isCorrect:false}] },
  { id: 'mysterious_history_3_005', content: '丝绸之路的开辟和哪个朝代有关？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'汉朝',isCorrect:true},{text:'唐朝',isCorrect:false},{text:'明朝',isCorrect:false},{text:'宋朝',isCorrect:false}] },
  { id: 'mysterious_history_3_006', content: '玄奘取经发生在哪个朝代？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'汉朝',isCorrect:false},{text:'南北朝',isCorrect:false},{text:'唐朝',isCorrect:true},{text:'宋朝',isCorrect:false}] },
  { id: 'mysterious_history_3_007', content: '郑和下西洋最远到达哪里？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'非洲东海岸',isCorrect:true},{text:'欧洲',isCorrect:false},{text:'美洲',isCorrect:false},{text:'澳大利亚',isCorrect:false}] },
  { id: 'mysterious_history_3_008', content: '第一次鸦片战争爆发于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'1839年',isCorrect:false},{text:'1840年',isCorrect:true},{text:'1842年',isCorrect:false},{text:'1856年',isCorrect:false}] },
]

// === HISTORY D4 (35题, grade 8) - Sample 10题 ===
const historyD4Questions: Question[] = [
  { id: 'mysterious_history_4_001', content: '洋务运动的口号是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'自强、求富',isCorrect:true},{text:'民主、科学',isCorrect:false},{text:'救亡图存',isCorrect:false},{text:'中学为体，西学为用',isCorrect:false}] },
  { id: 'mysterious_history_4_002', content: '戊戌变法发生在哪个皇帝在位时？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'咸丰帝',isCorrect:false},{text:'光绪帝',isCorrect:true},{text:'宣统帝',isCorrect:false},{text:'慈禧太后',isCorrect:false}] },
  { id: 'mysterious_history_4_003', content: '辛亥革命的指导思想是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'三民主义',isCorrect:true},{text:'马克思主义',isCorrect:false},{text:'民主科学',isCorrect:false},{text:'社会主义',isCorrect:false}] },
  { id: 'mysterious_history_4_004', content: '中国同盟会成立于哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1894年',isCorrect:false},{text:'1905年',isCorrect:true},{text:'1911年',isCorrect:false},{text:'1919年',isCorrect:false}] },
  { id: 'mysterious_history_4_005', content: '新文化运动的主要阵地是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'《新青年》',isCorrect:true},{text:'《民报》',isCorrect:false},{text:'《时务报》',isCorrect:false},{text:'《国闻报》',isCorrect:false}] },
  { id: 'mysterious_history_4_006', content: '科举制度正式废除于哪个朝代？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'宋朝',isCorrect:false},{text:'明朝',isCorrect:false},{text:'清朝',isCorrect:true},{text:'元朝',isCorrect:false}] },
  { id: 'mysterious_history_4_007', content: '火烧圆明园发生在哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1856年',isCorrect:false},{text:'1860年',isCorrect:true},{text:'1864年',isCorrect:false},{text:'1870年',isCorrect:false}] },
  { id: 'mysterious_history_4_008', content: '《马关条约》签订于哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1894年',isCorrect:false},{text:'1895年',isCorrect:true},{text:'1896年',isCorrect:false},{text:'1897年',isCorrect:false}] },
  { id: 'mysterious_history_4_009', content: '戊戌六君子包括谭嗣同和？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'梁启超',isCorrect:false},{text:'康有为',isCorrect:false},{text:'杨锐',isCorrect:true},{text:'光绪帝',isCorrect:false}] },
  { id: 'mysterious_history_4_010', content: '《辛丑条约》签订后中国处于什么状态？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'完全独立',isCorrect:false},{text:'半殖民地半封建',isCorrect:true},{text:'殖民地',isCorrect:false},{text:'封建社会',isCorrect:false}] },
]

// === HISTORY D5 (25题, grade 9) - Sample 10题 ===
const historyD5Questions: Question[] = [
  { id: 'mysterious_history_5_001', content: '文艺复兴运动起源于哪个国家？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'法国',isCorrect:false},{text:'英国',isCorrect:false},{text:'意大利',isCorrect:true},{text:'西班牙',isCorrect:false}] },
  { id: 'mysterious_history_5_002', content: '法国大革命爆发的标志是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'攻占巴士底狱',isCorrect:true},{text:'《人权宣言》发表',isCorrect:false},{text:'拿破仑掌权',isCorrect:false},{text:'三级会议召开',isCorrect:false}] },
  { id: 'mysterious_history_5_003', content: '第一次世界大战的导火索是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'萨拉热窝事件',isCorrect:true},{text:'德国闪击波兰',isCorrect:false},{text:'俄国十月革命',isCorrect:false},{text:'凡尔登战役',isCorrect:false}] },
  { id: 'mysterious_history_5_004', content: '《凡尔赛和约》的主要内容是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'建立联合国',isCorrect:false},{text:'对德国进行惩罚和限制',isCorrect:true},{text:'瓜分德国殖民地',isCorrect:false},{text:'赔偿美国损失',isCorrect:false}] },
  { id: 'mysterious_history_5_005', content: '十月革命发生在哪一年？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'1914年',isCorrect:false},{text:'1917年',isCorrect:true},{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:false}] },
  { id: 'mysterious_history_5_006', content: '冷战后期的特点是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'美苏争霸',isCorrect:true},{text:'法西斯崛起',isCorrect:false},{text:'社会主义运动',isCorrect:false},{text:'殖民主义扩张',isCorrect:false}] },
  { id: 'mysterious_history_5_007', content: '布雷顿森林体系确立了什么的地位？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'英镑',isCorrect:false},{text:'美元',isCorrect:true},{text:'黄金',isCorrect:false},{text:'欧元',isCorrect:false}] },
  { id: 'mysterious_history_5_008', content: '什么是古巴导弹危机？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'美国和苏联在古巴的对峙',isCorrect:true},{text:'古巴的内战',isCorrect:false},{text:'古巴的独立战争',isCorrect:false},{text:'古巴与美国的关系危机',isCorrect:false}] },
  { id: 'mysterious_history_5_009', content: '联合国的创始国有多少？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'40个',isCorrect:false},{text:'50个',isCorrect:true},{text:'60个',isCorrect:false},{text:'51个',isCorrect:false}] },
  { id: 'mysterious_history_5_010', content: '什么是柏林墙？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'德国分裂的象征',isCorrect:true},{text:'德国的古城墙',isCorrect:false},{text:'柏林的城门',isCorrect:false},{text:'德国的边境墙',isCorrect:false}] },
]

// Combine all questions
export const mysteriousQuestions: Question[] = [
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
  ...historyD1Questions,
  ...historyD2Questions,
  ...historyD3Questions,
  ...historyD4Questions,
  ...historyD5Questions,
]

export const mysteriousQuestionBank = createMysteriousOceanQuestionBank('mysterious', mysteriousQuestions)