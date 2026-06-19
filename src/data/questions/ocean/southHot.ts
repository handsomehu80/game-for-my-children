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
  { id: 'southHot_math_1_009', content: '9 + 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'15',isCorrect:false},{text:'16',isCorrect:false},{text:'17',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'southHot_math_1_010', content: '14 - 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'southHot_math_1_011', content: '2 × 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'12',isCorrect:false},{text:'14',isCorrect:true},{text:'16',isCorrect:false},{text:'18',isCorrect:false}] },
  { id: 'southHot_math_1_012', content: '72 ÷ 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'southHot_math_1_013', content: '38 + 47 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'83',isCorrect:false},{text:'84',isCorrect:false},{text:'85',isCorrect:true},{text:'86',isCorrect:false}] },
  { id: 'southHot_math_1_014', content: '95 - 58 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'35',isCorrect:false},{text:'36',isCorrect:false},{text:'37',isCorrect:true},{text:'38',isCorrect:false}] },
  { id: 'southHot_math_1_015', content: '6 × 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'42',isCorrect:false},{text:'46',isCorrect:false},{text:'48',isCorrect:true},{text:'52',isCorrect:false}] },
  { id: 'southHot_math_1_016', content: '81 ÷ 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'southHot_math_1_017', content: '7 × 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'42',isCorrect:false},{text:'47',isCorrect:false},{text:'49',isCorrect:true},{text:'56',isCorrect:false}] },
  { id: 'southHot_math_1_018', content: '63 ÷ 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'southHot_math_1_019', content: '5 × 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'28',isCorrect:false},{text:'30',isCorrect:true},{text:'32',isCorrect:false},{text:'35',isCorrect:false}] },
  { id: 'southHot_math_1_020', content: '11 - 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false}] },
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
  { id: 'southHot_math_2_009', content: '125 × 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'900',isCorrect:false},{text:'1000',isCorrect:true},{text:'1100',isCorrect:false},{text:'1200',isCorrect:false}] },
  { id: 'southHot_math_2_010', content: '2400 ÷ 24 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'90',isCorrect:false},{text:'100',isCorrect:true},{text:'110',isCorrect:false},{text:'120',isCorrect:false}] },
  { id: 'southHot_math_2_011', content: '3.5 + 2.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'6.2',isCorrect:false},{text:'6.3',isCorrect:true},{text:'6.4',isCorrect:false},{text:'6.5',isCorrect:false}] },
  { id: 'southHot_math_2_012', content: '8.6 - 3.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4.5',isCorrect:false},{text:'4.6',isCorrect:false},{text:'4.7',isCorrect:true},{text:'4.8',isCorrect:false}] },
  { id: 'southHot_math_2_013', content: '25 × 16 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'375',isCorrect:false},{text:'400',isCorrect:true},{text:'425',isCorrect:false},{text:'450',isCorrect:false}] },
  { id: 'southHot_math_2_014', content: '567 + 289 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'846',isCorrect:false},{text:'856',isCorrect:true},{text:'866',isCorrect:false},{text:'876',isCorrect:false}] },
  { id: 'southHot_math_2_015', content: '1000 - 673 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'317',isCorrect:false},{text:'327',isCorrect:true},{text:'337',isCorrect:false},{text:'347',isCorrect:false}] },
  { id: 'southHot_math_2_016', content: '42 × 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'610',isCorrect:false},{text:'620',isCorrect:false},{text:'630',isCorrect:true},{text:'640',isCorrect:false}] },
  { id: 'southHot_math_2_017', content: '144 ÷ 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
  { id: 'southHot_math_2_018', content: '1.2 × 3.5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4.0',isCorrect:false},{text:'4.1',isCorrect:false},{text:'4.2',isCorrect:true},{text:'4.3',isCorrect:false}] },
  { id: 'southHot_math_2_019', content: '7.5 ÷ 1.5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'southHot_math_2_020', content: '456 + 378 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'824',isCorrect:false},{text:'834',isCorrect:true},{text:'844',isCorrect:false},{text:'854',isCorrect:false}] },
  { id: 'southHot_math_2_021', content: '800 - 247 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'543',isCorrect:false},{text:'553',isCorrect:true},{text:'563',isCorrect:false},{text:'573',isCorrect:false}] },
  { id: 'southHot_math_2_022', content: '18 × 25 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'440',isCorrect:false},{text:'450',isCorrect:true},{text:'460',isCorrect:false},{text:'470',isCorrect:false}] },
  { id: 'southHot_math_2_023', content: '288 ÷ 18 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'14',isCorrect:false},{text:'15',isCorrect:false},{text:'16',isCorrect:true},{text:'17',isCorrect:false}] },
  { id: 'southHot_math_2_024', content: '5.6 + 3.7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'9.1',isCorrect:false},{text:'9.2',isCorrect:false},{text:'9.3',isCorrect:true},{text:'9.4',isCorrect:false}] },
  { id: 'southHot_math_2_025', content: '12.5 - 4.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'7.5',isCorrect:false},{text:'7.6',isCorrect:false},{text:'7.7',isCorrect:true},{text:'7.8',isCorrect:false}] },
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
  { id: 'southHot_math_3_009', content: '-12 + 5 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-17',isCorrect:false},{text:'-7',isCorrect:true},{text:'7',isCorrect:false},{text:'17',isCorrect:false}] },
  { id: 'southHot_math_3_010', content: '(-3) × (-7) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-21',isCorrect:false},{text:'21',isCorrect:true},{text:'-10',isCorrect:false},{text:'10',isCorrect:false}] },
  { id: 'southHot_math_3_011', content: '(-20) ÷ (-4) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-5',isCorrect:false},{text:'5',isCorrect:true},{text:'-8',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'southHot_math_3_012', content: '5² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'10',isCorrect:false},{text:'25',isCorrect:true},{text:'52',isCorrect:false},{text:'20',isCorrect:false}] },
  { id: 'southHot_math_3_013', content: '∛8 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'southHot_math_3_014', content: '√144 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'14',isCorrect:false}] },
  { id: 'southHot_math_3_015', content: '2x + 9 = 19, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'southHot_math_3_016', content: '3(x + 1) = 12, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'southHot_math_3_017', content: '40% of 80 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'28',isCorrect:false},{text:'30',isCorrect:false},{text:'32',isCorrect:true},{text:'36',isCorrect:false}] },
  { id: 'southHot_math_3_018', content: '√225 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'southHot_math_3_019', content: '4² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'8',isCorrect:false},{text:'16',isCorrect:true},{text:'24',isCorrect:false},{text:'42',isCorrect:false}] },
  { id: 'southHot_math_3_020', content: '(-4) + (-6) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-2',isCorrect:false},{text:'2',isCorrect:false},{text:'-10',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'southHot_math_3_021', content: '(-8) - (-3) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-11',isCorrect:false},{text:'-5',isCorrect:true},{text:'5',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'southHot_math_3_022', content: '7² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'14',isCorrect:false},{text:'49',isCorrect:true},{text:'56',isCorrect:false},{text:'72',isCorrect:false}] },
  { id: 'southHot_math_3_023', content: '∛64 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'2',isCorrect:false},{text:'4',isCorrect:true},{text:'8',isCorrect:false},{text:'16',isCorrect:false}] },
  { id: 'southHot_math_3_024', content: '4x - 5 = 15, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'southHot_math_3_025', content: '2(x - 3) = 10, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'southHot_math_3_026', content: '75% of 200 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'140',isCorrect:false},{text:'150',isCorrect:true},{text:'160',isCorrect:false},{text:'170',isCorrect:false}] },
  { id: 'southHot_math_3_027', content: '√81 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'southHot_math_3_028', content: '8² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'16',isCorrect:false},{text:'64',isCorrect:true},{text:'72',isCorrect:false},{text:'88',isCorrect:false}] },
  { id: 'southHot_math_3_029', content: '∛125 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'southHot_math_3_030', content: '√196 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'12',isCorrect:false},{text:'13',isCorrect:false},{text:'14',isCorrect:true},{text:'15',isCorrect:false}] },
]

// === MATH D4 (18题, grade 8) - Sample 6题 ===
const mathD4Questions: Question[] = [
  { id: 'southHot_math_4_001', content: 'x² - 5x + 6 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'1, 6',isCorrect:false},{text:'2, 3',isCorrect:true},{text:'-2, -3',isCorrect:false},{text:'-1, -6',isCorrect:false}] },
  { id: 'southHot_math_4_002', content: 'y = 3x - 2, when x = 4, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'8',isCorrect:false},{text:'10',isCorrect:true},{text:'12',isCorrect:false},{text:'14',isCorrect:false}] },
  { id: 'southHot_math_4_003', content: 'tan(45°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'√3',isCorrect:false}] },
  { id: 'southHot_math_4_004', content: 'a³ × a⁴ = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a⁷',isCorrect:true},{text:'a¹²',isCorrect:false},{text:'a⁸',isCorrect:false},{text:'3a⁷',isCorrect:false}] },
  { id: 'southHot_math_4_005', content: '(2x+3)(2x-3) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'4x²-9',isCorrect:true},{text:'4x²+9',isCorrect:false},{text:'4x²-12x+9',isCorrect:false},{text:'4x²+12x-9',isCorrect:false}] },
  { id: 'southHot_math_4_006', content: '√48 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'4√3',isCorrect:true},{text:'2√12',isCorrect:false},{text:'3√4',isCorrect:false},{text:'6√2',isCorrect:false}] },
  { id: 'southHot_math_4_007', content: 'x² - 4x - 5 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'-1, 5',isCorrect:true},{text:'1, -5',isCorrect:false},{text:'2, -3',isCorrect:false},{text:'-2, 3',isCorrect:false}] },
  { id: 'southHot_math_4_008', content: 'y = 2x + 1, when x = 5, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:true},{text:'12',isCorrect:false},{text:'13',isCorrect:false}] },
  { id: 'southHot_math_4_009', content: 'sin(30°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:true},{text:'√2/2',isCorrect:false},{text:'√3/2',isCorrect:false}] },
  { id: 'southHot_math_4_010', content: 'a⁵ ÷ a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a³',isCorrect:true},{text:'a⁷',isCorrect:false},{text:'a²',isCorrect:false},{text:'5a³',isCorrect:false}] },
  { id: 'southHot_math_4_011', content: '(x+2)² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²+4',isCorrect:false},{text:'x²+4x+4',isCorrect:true},{text:'x²+2x+4',isCorrect:false},{text:'x²+4x+2',isCorrect:false}] },
  { id: 'southHot_math_4_012', content: '√75 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'3√5',isCorrect:false},{text:'5√3',isCorrect:true},{text:'5√5',isCorrect:false},{text:'3√3',isCorrect:false}] },
  { id: 'southHot_math_4_013', content: 'x² + 6x + 9 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'3',isCorrect:false},{text:'-3',isCorrect:true},{text:'3, -3',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'southHot_math_4_014', content: 'y = -x + 3, when x = -2, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5',isCorrect:true},{text:'1',isCorrect:false},{text:'-5',isCorrect:false},{text:'3',isCorrect:false}] },
  { id: 'southHot_math_4_015', content: 'cot(45°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'√3',isCorrect:false},{text:'undefined',isCorrect:false}] },
  { id: 'southHot_math_4_016', content: '(ab)³ = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'ab³',isCorrect:false},{text:'a³b³',isCorrect:true},{text:'a³b',isCorrect:false},{text:'3ab',isCorrect:false}] },
  { id: 'southHot_math_4_017', content: '(3x-1)(x+2) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'3x²+5x-2',isCorrect:true},{text:'3x²+6x-2',isCorrect:false},{text:'3x²+5x+2',isCorrect:false},{text:'3x²-5x-2',isCorrect:false}] },
  { id: 'southHot_math_4_018', content: '√200 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'10√2',isCorrect:true},{text:'20√2',isCorrect:false},{text:'2√50',isCorrect:false},{text:'5√8',isCorrect:false}] },
]

// === MATH D5 (7题, grade 9) ===
const mathD5Questions: Question[] = [
  { id: 'southHot_math_5_001', content: '2x² - 8 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'±2',isCorrect:true},{text:'±4',isCorrect:false},{text:'±8',isCorrect:false},{text:'±16',isCorrect:false}] },
  { id: 'southHot_math_5_002', content: 'log₂(32) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'southHot_math_5_003', content: 'cos(60°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:true},{text:'√2/2',isCorrect:false},{text:'√3/2',isCorrect:false}] },
  { id: 'southHot_math_5_004', content: 'If sin(θ) = 0.5, θ = ? (0° < θ < 90°)', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'30°',isCorrect:true},{text:'45°',isCorrect:false},{text:'60°',isCorrect:false},{text:'90°',isCorrect:false}] },
  { id: 'southHot_math_5_005', content: 'ln(e²) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'e',isCorrect:false},{text:'2e',isCorrect:false}] },
  { id: 'southHot_math_5_006', content: 'x² - 6x + 9 = 0 的解是？', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'x = 3',isCorrect:true},{text:'x = -3',isCorrect:false},{text:'x = 6',isCorrect:false},{text:'x = ±3',isCorrect:false}] },
  { id: 'southHot_math_5_007', content: '袋子里有红色和蓝色球共10个，红球有3个，摸到红球的概率是？', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'3/10',isCorrect:true},{text:'3/7',isCorrect:false},{text:'7/10',isCorrect:false},{text:'1/3',isCorrect:false}] },
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
  { id: 'southHot_chinese_1_009', content: '"日"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'southHot_chinese_1_010', content: '下列哪个是水果？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'白菜',isCorrect:false},{text:'苹果',isCorrect:true},{text:'萝卜',isCorrect:false},{text:'青菜',isCorrect:false}] },
  { id: 'southHot_chinese_1_011', content: '"大"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'高',isCorrect:false},{text:'小',isCorrect:true},{text:'长',isCorrect:false},{text:'宽',isCorrect:false}] },
  { id: 'southHot_chinese_1_012', content: '"人"字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:true},{text:'3画',isCorrect:false},{text:'4画',isCorrect:false}] },
  { id: 'southHot_chinese_1_013', content: '哪个是动物？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'树木',isCorrect:false},{text:'小狗',isCorrect:true},{text:'花朵',isCorrect:false},{text:'小草',isCorrect:false}] },
  { id: 'southHot_chinese_1_014', content: '"上"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'下',isCorrect:true},{text:'前',isCorrect:false},{text:'左',isCorrect:false},{text:'东',isCorrect:false}] },
  { id: 'southHot_chinese_1_015', content: '一周有几天？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'5天',isCorrect:false},{text:'6天',isCorrect:false},{text:'7天',isCorrect:true},{text:'8天',isCorrect:false}] },
  { id: 'southHot_chinese_1_016', content: '"月"字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'southHot_chinese_1_017', content: '哪个字是动词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'美丽',isCorrect:false},{text:'跑',isCorrect:true},{text:'高兴',isCorrect:false},{text:'蓝色',isCorrect:false}] },
  { id: 'southHot_chinese_1_018', content: '"红"可以组什么词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'红花',isCorrect:true},{text:'红走',isCorrect:false},{text:'红桌子',isCorrect:false},{text:'红椅子',isCorrect:false}] },
  { id: 'southHot_chinese_1_019', content: '下列哪个是天气？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'下雨',isCorrect:true},{text:'桌子',isCorrect:false},{text:'书本',isCorrect:false},{text:'汽车',isCorrect:false}] },
  { id: 'southHot_chinese_1_020', content: '"天"字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false}] },
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
  { id: 'southHot_chinese_2_008', content: '"掩耳盗铃"属于哪种文学常识？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
  { id: 'southHot_chinese_2_009', content: '《春晓》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'王维',isCorrect:false},{text:'孟浩然',isCorrect:true},{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:false}] },
  { id: 'southHot_chinese_2_010', content: '"狐假虎威"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'狐狸很聪明',isCorrect:false},{text:'借着别人的势力来欺压人',isCorrect:true},{text:'老虎很厉害',isCorrect:false},{text:'动物要团结',isCorrect:false}] },
  { id: 'southHot_chinese_2_011', content: '《静夜思》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:false},{text:'李白',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'southHot_chinese_2_012', content: '下列哪个是唐代诗人？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'苏轼',isCorrect:false},{text:'李清照',isCorrect:false},{text:'辛弃疾',isCorrect:false},{text:'王昌龄',isCorrect:true}] },
  { id: 'southHot_chinese_2_013', content: '"刻舟求剑"出自哪里？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'《韩非子》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《庄子》',isCorrect:false},{text:'《论语》',isCorrect:false}] },
  { id: 'southHot_chinese_2_014', content: '《咏鹅》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'骆宾王',isCorrect:true},{text:'王勃',isCorrect:false},{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false}] },
  { id: 'southHot_chinese_2_015', content: '"买椟还珠"的意思是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'买珍珠还盒子',isCorrect:false},{text:'取舍不当',isCorrect:true},{text:'喜欢盒子不喜欢珠子',isCorrect:false},{text:'商人很诚实',isCorrect:false}] },
  { id: 'southHot_chinese_2_016', content: '《游子吟》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'杜甫',isCorrect:false},{text:'孟郊',isCorrect:true},{text:'韩愈',isCorrect:false},{text:'柳宗元',isCorrect:false}] },
  { id: 'southHot_chinese_2_017', content: '下列哪个不是送别诗？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'《送元二使安西》',isCorrect:false},{text:'《九月九日忆山东兄弟》',isCorrect:true},{text:'《白雪歌送武判官归京》',isCorrect:false},{text:'《芙蓉楼送辛渐》',isCorrect:false}] },
  { id: 'southHot_chinese_2_018', content: '"亡羊补牢"的意思是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'羊死了要补牢',isCorrect:false},{text:'出了问题后及时补救',isCorrect:true},{text:'羊圈坏了要修',isCorrect:false},{text:'要保护动物',isCorrect:false}] },
  { id: 'southHot_chinese_2_019', content: '《江雪》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'王维',isCorrect:false},{text:'柳宗元',isCorrect:true},{text:'韩愈',isCorrect:false},{text:'白居易',isCorrect:false}] },
  { id: 'southHot_chinese_2_020', content: '下列哪个是中性词？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'杰出',isCorrect:false},{text:'卓越',isCorrect:true},{text:'狡猾',isCorrect:false},{text:'虚伪',isCorrect:false}] },
  { id: 'southHot_chinese_2_021', content: '"画蛇添足"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'画蛇要画脚',isCorrect:false},{text:'做多余的事反而不好',isCorrect:true},{text:'蛇没有脚',isCorrect:false},{text:'要仔细观察',isCorrect:false}] },
  { id: 'southHot_chinese_2_022', content: '《回乡偶书》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'孟浩然',isCorrect:false},{text:'贺知章',isCorrect:true},{text:'王之涣',isCorrect:false},{text:'王昌龄',isCorrect:false}] },
  { id: 'southHot_chinese_2_023', content: '下列哪个词是贬义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'勇敢',isCorrect:false},{text:'果断',isCorrect:false},{text:'狡猾',isCorrect:true},{text:'勤奋',isCorrect:false}] },
  { id: 'southHot_chinese_2_024', content: '"塞翁失马"出自哪里？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'《韩非子》',isCorrect:false},{text:'《淮南子》',isCorrect:true},{text:'《列子》',isCorrect:false},{text:'《庄子》',isCorrect:false}] },
  { id: 'southHot_chinese_2_025', content: '《草》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'白居易',isCorrect:true},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false},{text:'李商隐',isCorrect:false}] },
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
  { id: 'southHot_chinese_3_009', content: '《背影》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'老舍',isCorrect:false},{text:'郁达夫',isCorrect:false}] },
  { id: 'southHot_chinese_3_010', content: '"但愿人长久"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'千里共婵娟',isCorrect:true},{text:'月有阴晴圆缺',isCorrect:false},{text:'起舞弄清影',isCorrect:false},{text:'何似在人间',isCorrect:false}] },
  { id: 'southHot_chinese_3_011', content: '《三国演义》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'施耐庵',isCorrect:false},{text:'罗贯中',isCorrect:true},{text:'吴承恩',isCorrect:false},{text:'曹雪芹',isCorrect:false}] },
  { id: 'southHot_chinese_3_012', content: '"大漠孤烟直"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'长河落日圆',isCorrect:true},{text:'西出阳关无故人',isCorrect:false},{text:'春风度玉门',isCorrect:false},{text:'万里长征人未还',isCorrect:false}] },
  { id: 'southHot_chinese_3_013', content: '《醉翁亭记》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'范仲淹',isCorrect:false},{text:'欧阳修',isCorrect:true},{text:'王安石',isCorrect:false},{text:'苏轼',isCorrect:false}] },
  { id: 'southHot_chinese_3_014', content: '"日出江花红胜火"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'春来江水绿如蓝',isCorrect:true},{text:'能不忆江南',isCorrect:false},{text:'山寺月中寻桂子',isCorrect:false},{text:'郡亭枕上看潮头',isCorrect:false}] },
  { id: 'southHot_chinese_3_015', content: '下列哪个是鲁迅的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《繁星》',isCorrect:false},{text:'《春》',isCorrect:false},{text:'《狂人日记》',isCorrect:true},{text:'《城南旧事》',isCorrect:false}] },
  { id: 'southHot_chinese_3_016', content: '"两岸猿声啼不住"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'千里江陵一日还',isCorrect:true},{text:'轻舟已过万重山',isCorrect:false},{text:'两岸青山相对出',isCorrect:false},{text:'孤帆远影碧空尽',isCorrect:false}] },
  { id: 'southHot_chinese_3_017', content: '《岳阳楼记》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'欧阳修',isCorrect:false},{text:'范仲淹',isCorrect:true},{text:'王安石',isCorrect:false},{text:'苏轼',isCorrect:false}] },
  { id: 'southHot_chinese_3_018', content: '"落红不是无情物"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'化作春泥更护花',isCorrect:true},{text:'人生何处不相逢',isCorrect:false},{text:'天涯何处无芳草',isCorrect:false},{text:'却话巴山夜雨时',isCorrect:false}] },
  { id: 'southHot_chinese_3_019', content: '《骆驼祥子》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'老舍',isCorrect:true},{text:'鲁迅',isCorrect:false},{text:'茅盾',isCorrect:false},{text:'巴金',isCorrect:false}] },
  { id: 'southHot_chinese_3_020', content: '"海内存知己"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'天涯若比邻',isCorrect:true},{text:'儿女共沾巾',isCorrect:false},{text:'无为在歧路',isCorrect:false},{text:'烟波江上使人愁',isCorrect:false}] },
  { id: 'southHot_chinese_3_021', content: '《爱莲说》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'周敦颐',isCorrect:true},{text:'朱熹',isCorrect:false},{text:'程颐',isCorrect:false},{text:'王阳明',isCorrect:false}] },
  { id: 'southHot_chinese_3_022', content: '"明月松间照"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'清泉石上流',isCorrect:true},{text:'天气晚来秋',isCorrect:false},{text:'空山新雨后',isCorrect:false},{text:'随意春芳歇',isCorrect:false}] },
  { id: 'southHot_chinese_3_023', content: '《石灰吟》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'于谦',isCorrect:true},{text:'文天祥',isCorrect:false},{text:'岳飞',isCorrect:false},{text:'戚继光',isCorrect:false}] },
  { id: 'southHot_chinese_3_024', content: '"独在异乡为异客"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'每逢佳节倍思亲',isCorrect:true},{text:'遍插茱萸少一人',isCorrect:false},{text:'遥知兄弟登高处',isCorrect:false},{text:'何当共剪西窗烛',isCorrect:false}] },
  { id: 'southHot_chinese_3_025', content: '《观沧海》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'曹操',isCorrect:true},{text:'曹丕',isCorrect:false},{text:'曹植',isCorrect:false},{text:'刘邦',isCorrect:false}] },
  { id: 'southHot_chinese_3_026', content: '"随风潜入夜"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'润物细无声',isCorrect:true},{text:'野径云俱黑',isCorrect:false},{text:'晓看红湿处',isCorrect:false},{text:'花重锦官城',isCorrect:false}] },
  { id: 'southHot_chinese_3_027', content: '《假如生活欺骗了你》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'普希金',isCorrect:true},{text:'托尔斯泰',isCorrect:false},{text:'高尔基',isCorrect:false},{text:'屠格涅夫',isCorrect:false}] },
  { id: 'southHot_chinese_3_028', content: '"不识庐山真面目"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'只缘身在此山中',isCorrect:true},{text:'日照香炉生紫烟',isCorrect:false},{text:'飞流直下三千尺',isCorrect:false},{text:'疑是银河落九天',isCorrect:false}] },
  { id: 'southHot_chinese_3_029', content: '《天上的街市》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'郭沫若',isCorrect:true},{text:'徐志摩',isCorrect:false},{text:'闻一多',isCorrect:false},{text:'戴望舒',isCorrect:false}] },
  { id: 'southHot_chinese_3_030', content: '"春蚕到死丝方尽"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'蜡炬成灰泪始干',isCorrect:true},{text:'相见时难别亦难',isCorrect:false},{text:'东风无力百花残',isCorrect:false},{text:'晓镜但愁云鬓改',isCorrect:false}] },
]

// === CHINESE D4 (18题, grade 8) - Sample 6题 ===
const chineseD4Questions: Question[] = [
  { id: 'southHot_chinese_4_001', content: '《西厢记》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'关汉卿',isCorrect:false},{text:'王实甫',isCorrect:true},{text:'马致远',isCorrect:false},{text:'郑光祖',isCorrect:false}] },
  { id: 'southHot_chinese_4_002', content: '"学，然后知不足"下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'教，然后知困',isCorrect:true},{text:'思，然后知惑',isCorrect:false},{text:'行，然后知远',isCorrect:false},{text:'习，然后知新',isCorrect:false}] },
  { id: 'southHot_chinese_4_003', content: '下列哪个是清代戏剧？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《牡丹亭》',isCorrect:false},{text:'《桃花扇》',isCorrect:true},{text:'《西厢记》',isCorrect:false},{text:'《长生殿》',isCorrect:false}] },
  { id: 'southHot_chinese_4_004', content: '"天下兴亡，匹夫有责"是谁说的？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'顾炎武',isCorrect:true},{text:'黄宗羲',isCorrect:false},{text:'王夫之',isCorrect:false},{text:'龚自珍',isCorrect:false}] },
  { id: 'southHot_chinese_4_005', content: '《文心雕龙》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'刘勰',isCorrect:true},{text:'钟嵘',isCorrect:false},{text:'萧统',isCorrect:false},{text:'韩愈',isCorrect:false}] },
  { id: 'southHot_chinese_4_006', content: '"锲而不舍"出自哪篇文章？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《劝学》',isCorrect:true},{text:'《师说》',isCorrect:false},{text:'《送东阳马生序》',isCorrect:false},{text:'《为学》',isCorrect:false}] },
  { id: 'southHot_chinese_4_007', content: '《聊斋志异》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'吴承恩',isCorrect:false},{text:'蒲松龄',isCorrect:true},{text:'曹雪芹',isCorrect:false},{text:'罗贯中',isCorrect:false}] },
  { id: 'southHot_chinese_4_008', content: '《儒林外史》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'吴敬梓',isCorrect:true},{text:'蒲松龄',isCorrect:false},{text:'曹雪芹',isCorrect:false},{text:'施耐庵',isCorrect:false}] },
  { id: 'southHot_chinese_4_009', content: '《红楼梦》的主要作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:true},{text:'高鹗',isCorrect:false},{text:'吴敬梓',isCorrect:false},{text:'蒲松龄',isCorrect:false}] },
  { id: 'southHot_chinese_4_010', content: '"先天下之忧而忧"是谁说的？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'欧阳修',isCorrect:false},{text:'范仲淹',isCorrect:true},{text:'王安石',isCorrect:false},{text:'司马光',isCorrect:false}] },
  { id: 'southHot_chinese_4_011', content: '《梦溪笔谈》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'沈括',isCorrect:true},{text:'宋应星',isCorrect:false},{text:'徐光启',isCorrect:false},{text:'李时珍',isCorrect:false}] },
  { id: 'southHot_chinese_4_012', content: '"业精于勤"的下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'荒于嬉',isCorrect:true},{text:'成于思',isCorrect:false},{text:'毁于随',isCorrect:false},{text:'行成于思',isCorrect:false}] },
  { id: 'southHot_chinese_4_013', content: '《霸王别姬》属于哪种戏曲？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'京剧',isCorrect:true},{text:'越剧',isCorrect:false},{text:'黄梅戏',isCorrect:false},{text:'豫剧',isCorrect:false}] },
  { id: 'southHot_chinese_4_014', content: '"桃李不言"的下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'下自成蹊',isCorrect:true},{text:'花香自飘零',isCorrect:false},{text:'春风化雨时',isCorrect:false},{text:'秋实自满枝',isCorrect:false}] },
  { id: 'southHot_chinese_4_015', content: '《满江红》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'岳飞',isCorrect:true},{text:'辛弃疾',isCorrect:false},{text:'陆游',isCorrect:false},{text:'文天祥',isCorrect:false}] },
  { id: 'southHot_chinese_4_016', content: '"海上生明月"的下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'天涯共此时',isCorrect:true},{text:'月是故乡明',isCorrect:false},{text:'千里共婵娟',isCorrect:false},{text:'月圆人团圆',isCorrect:false}] },
  { id: 'southHot_chinese_4_017', content: '《杨家将》讲述的是哪个朝代的故事？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'唐朝',isCorrect:false},{text:'宋朝',isCorrect:true},{text:'明朝',isCorrect:false},{text:'清朝',isCorrect:false}] },
  { id: 'southHot_chinese_4_018', content: '"不入虎穴"的下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'焉得虎子',isCorrect:true},{text:'焉能虎变',isCorrect:false},{text:'焉有虎威',isCorrect:false},{text:'焉识虎踪',isCorrect:false}] },
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
  { id: 'southHot_english_1_009', content: 'What is "狗" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'southHot_english_1_010', content: 'How do you spell "cat"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'k-a-t',isCorrect:false},{text:'c-a-t',isCorrect:true},{text:'c-o-t',isCorrect:false},{text:'k-o-t',isCorrect:false}] },
  { id: 'southHot_english_1_011', content: '"蓝色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Red',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Blue',isCorrect:true}] },
  { id: 'southHot_english_1_012', content: 'What number is "7"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Six',isCorrect:false},{text:'Seven',isCorrect:true},{text:'Eight',isCorrect:false},{text:'Nine',isCorrect:false}] },
  { id: 'southHot_english_1_013', content: 'What is "书"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Book',isCorrect:true},{text:'Look',isCorrect:false},{text:'Cook',isCorrect:false},{text:'Hook',isCorrect:false}] },
  { id: 'southHot_english_1_014', content: 'Good morning! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:true},{text:'Command',isCorrect:false},{text:'Exclamation',isCorrect:false}] },
  { id: 'southHot_english_1_015', content: 'What color is the sky?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Blue',isCorrect:true},{text:'Brown',isCorrect:false}] },
  { id: 'southHot_english_1_016', content: '"月亮" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Star',isCorrect:false},{text:'Moon',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'southHot_english_1_017', content: 'What is "猫"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'southHot_english_1_018', content: 'How do you spell "red"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'r-a-d',isCorrect:false},{text:'r-e-d',isCorrect:true},{text:'r-i-d',isCorrect:false},{text:'r-o-d',isCorrect:false}] },
  { id: 'southHot_english_1_019', content: '"红色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Red',isCorrect:true}] },
  { id: 'southHot_english_1_020', content: 'What number is "5"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Four',isCorrect:false},{text:'Five',isCorrect:true},{text:'Six',isCorrect:false},{text:'Seven',isCorrect:false}] },
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
  { id: 'southHot_english_2_009', content: 'What is the past tense of "go"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Goed',isCorrect:false},{text:'Gone',isCorrect:false},{text:'Went',isCorrect:true},{text:'Going',isCorrect:false}] },
  { id: 'southHot_english_2_010', content: 'She ___ TV last night.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'watch',isCorrect:false},{text:'watches',isCorrect:false},{text:'watched',isCorrect:true},{text:'watching',isCorrect:false}] },
  { id: 'southHot_english_2_011', content: 'What is the plural of "child"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Childs',isCorrect:false},{text:'Childrens',isCorrect:false},{text:'Children',isCorrect:true},{text:'Childes',isCorrect:false}] },
  { id: 'southHot_english_2_012', content: 'There are ___ students in the class.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'much',isCorrect:false},{text:'any',isCorrect:false},{text:'many',isCorrect:true},{text:'little',isCorrect:false}] },
  { id: 'southHot_english_2_013', content: 'What time is it? 3:15', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Three',isCorrect:false},{text:'Three fifteen',isCorrect:true},{text:'Three and quarter',isCorrect:false},{text:'Quarter past three',isCorrect:false}] },
  { id: 'southHot_english_2_014', content: 'My father ___ reading newspaper now.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'was',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'southHot_english_2_015', content: 'He has ___ finished his lunch.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'never',isCorrect:false}] },
  { id: 'southHot_english_2_016', content: 'The opposite of "old" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'young',isCorrect:true},{text:'big',isCorrect:false},{text:'tall',isCorrect:false},{text:'long',isCorrect:false}] },
  { id: 'southHot_english_2_017', content: 'What is the past tense of "eat"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Eated',isCorrect:false},{text:'Ate',isCorrect:true},{text:'Eaten',isCorrect:false},{text:'Eating',isCorrect:false}] },
  { id: 'southHot_english_2_018', content: 'They ___ football yesterday.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'play',isCorrect:false},{text:'plays',isCorrect:false},{text:'played',isCorrect:true},{text:'playing',isCorrect:false}] },
  { id: 'southHot_english_2_019', content: 'What is the plural of "mouse"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Mouses',isCorrect:false},{text:'Mice',isCorrect:true},{text:'Mouse',isCorrect:false},{text:'Meese',isCorrect:false}] },
  { id: 'southHot_english_2_020', content: 'Is there ___ milk in the fridge?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:false},{text:'some',isCorrect:true},{text:'many',isCorrect:false}] },
  { id: 'southHot_english_2_021', content: 'What time is it? 8:45', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Eight',isCorrect:false},{text:'Eight forty-five',isCorrect:true},{text:'Eight past forty-five',isCorrect:false},{text:'Forty-five eight',isCorrect:false}] },
  { id: 'southHot_english_2_022', content: 'The teacher ___ explaining the lesson now.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:false}] },
  { id: 'southHot_english_2_023', content: 'I have ___ visited Beijing.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'southHot_english_2_024', content: 'The opposite of "happy" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'sad',isCorrect:true},{text:'glad',isCorrect:false},{text:'pleased',isCorrect:false},{text:'excited',isCorrect:false}] },
  { id: 'southHot_english_2_025', content: 'What is the past tense of "write"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Writed',isCorrect:false},{text:'Wrote',isCorrect:true},{text:'Written',isCorrect:false},{text:'Writing',isCorrect:false}] },
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
  { id: 'southHot_english_3_009', content: 'If I ___ you, I would accept the offer.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'southHot_english_3_010', content: 'The letter ___ yesterday.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'sent',isCorrect:false},{text:'was sent',isCorrect:true},{text:'is sent',isCorrect:false},{text:'has sent',isCorrect:false}] },
  { id: 'southHot_english_3_011', content: 'Neither the students nor the teacher ___ happy.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'are',isCorrect:false},{text:'is',isCorrect:true},{text:'were',isCorrect:false},{text:'was',isCorrect:false}] },
  { id: 'southHot_english_3_012', content: 'I have been learning English ___ three years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'for',isCorrect:true},{text:'since',isCorrect:false},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'southHot_english_3_013', content: 'Which sentence uses the conditional correctly?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'If it rains, I will stay home',isCorrect:true},{text:'If it rain, I will stay home',isCorrect:false},{text:'If it will rain, I stay home',isCorrect:false},{text:'If it rains, I would stay home',isCorrect:false}] },
  { id: 'southHot_english_3_014', content: 'He suggested ___ the plan.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'change',isCorrect:false},{text:'to change',isCorrect:true},{text:'changing',isCorrect:false},{text:'changed',isCorrect:false}] },
  { id: 'southHot_english_3_015', content: 'By 2030, they ___ the project.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'will complete',isCorrect:false},{text:'will have completed',isCorrect:true},{text:'will be completing',isCorrect:false},{text:'complete',isCorrect:false}] },
  { id: 'southHot_english_3_016', content: 'Seldom ___ such a beautiful view.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'I see',isCorrect:false},{text:'do I see',isCorrect:true},{text:'I saw',isCorrect:false},{text:'did I saw',isCorrect:false}] },
  { id: 'southHot_english_3_017', content: 'If I ___ the truth, I would have apologized.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'knew',isCorrect:true},{text:'know',isCorrect:false},{text:'had known',isCorrect:false},{text:'would know',isCorrect:false}] },
  { id: 'southHot_english_3_018', content: 'The book ___ by children all over the world.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is loved',isCorrect:true},{text:'loves',isCorrect:false},{text:'loved',isCorrect:false},{text:'has loved',isCorrect:false}] },
  { id: 'southHot_english_3_019', content: 'Not only ___ study hard, but also work hard.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'students should',isCorrect:false},{text:'should students',isCorrect:true},{text:'do students',isCorrect:false},{text:'students do',isCorrect:false}] },
  { id: 'southHot_english_3_020', content: 'I wish I ___ more money.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'have',isCorrect:false},{text:'had',isCorrect:true},{text:'would have',isCorrect:false},{text:'will have',isCorrect:false}] },
  { id: 'southHot_english_3_021', content: 'The teacher ___ the students to finish the test.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'told',isCorrect:false},{text:'asked',isCorrect:true},{text:'said',isCorrect:false},{text:'spoke',isCorrect:false}] },
  { id: 'southHot_english_3_022', content: '___ I study hard, I cannot pass the exam.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'Though',isCorrect:false},{text:'Even though',isCorrect:true},{text:'Because',isCorrect:false},{text:'If',isCorrect:false}] },
  { id: 'southHot_english_3_023', content: 'Hardly ___ when the bell rang.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'I had sat down',isCorrect:false},{text:'had I sat down',isCorrect:true},{text:'I sat down',isCorrect:false},{text:'did I sit down',isCorrect:false}] },
  { id: 'southHot_english_3_024', content: 'If he ___ harder, he would succeed.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'work',isCorrect:false},{text:'works',isCorrect:false},{text:'worked',isCorrect:true},{text:'working',isCorrect:false}] },
  { id: 'southHot_english_3_025', content: 'The news ___ encouraging.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'are',isCorrect:false},{text:'is',isCorrect:true},{text:'were',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'southHot_english_3_026', content: 'I would have gone to the party ___ I was busy.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'if',isCorrect:false},{text:'unless',isCorrect:false},{text:'because',isCorrect:false},{text:'though',isCorrect:true}] },
  { id: 'southHot_english_3_027', content: 'She acts as if she ___ the owner.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'is',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'southHot_english_3_028', content: 'It is essential that everyone ___ on time.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'arrive',isCorrect:true},{text:'arrives',isCorrect:false},{text:'arriving',isCorrect:false},{text:'arrived',isCorrect:false}] },
  { id: 'southHot_english_3_029', content: 'Only then ___ realize the mistake.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'I did',isCorrect:false},{text:'did I',isCorrect:true},{text:'I had',isCorrect:false},{text:'had I',isCorrect:false}] },
  { id: 'southHot_english_3_030', content: 'Had I known, I ___ you.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'helped',isCorrect:false},{text:'would help',isCorrect:false},{text:'would have helped',isCorrect:true},{text:'had helped',isCorrect:false}] },
]

// === ENGLISH D4 (18题, grade 8) - Sample 6题 ===
const englishD4Questions: Question[] = [
  { id: 'southHot_english_4_001', content: 'The passive voice of "Someone is helping them" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'They are being helped',isCorrect:true},{text:'They is being helped',isCorrect:false},{text:'They are helped',isCorrect:false},{text:'They was being helped',isCorrect:false}] },
  { id: 'southHot_english_4_002', content: 'It is essential that he ___ on time.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'arrive',isCorrect:true},{text:'arrives',isCorrect:false},{text:'arriving',isCorrect:false},{text:'arrived',isCorrect:false}] },
  { id: 'southHot_english_4_003', content: 'Which word is a conjunction?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Although',isCorrect:true},{text:'Run',isCorrect:false}] },
  { id: 'southHot_english_4_004', content: '___ he was tired, he continued walking.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Despite',isCorrect:false},{text:'Although',isCorrect:true},{text:'Since of',isCorrect:false}] },
  { id: 'southHot_english_4_005', content: 'He acted ___ nothing had happened.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'southHot_english_4_006', content: 'The word "unbelievable" has ___ prefix(es).', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'one',isCorrect:true},{text:'two',isCorrect:false},{text:'three',isCorrect:false},{text:'none',isCorrect:false}] },
  { id: 'southHot_english_4_007', content: 'The sentence "The cake was eaten by the dog" is in ___ voice.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'active',isCorrect:false},{text:'passive',isCorrect:true},{text:'reflexive',isCorrect:false},{text:'negative',isCorrect:false}] },
  { id: 'southHot_english_4_008', content: 'It is vital that the report ___ submitted today.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'be',isCorrect:true},{text:'is',isCorrect:false},{text:'was',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'southHot_english_4_009', content: 'Which word is a preposition?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Between',isCorrect:true},{text:'Run',isCorrect:false}] },
  { id: 'southHot_english_4_010', content: '___ the weather was bad, we still went out.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Despite',isCorrect:false},{text:'Although',isCorrect:true},{text:'Because of',isCorrect:false},{text:'Since',isCorrect:false}] },
  { id: 'southHot_english_4_011', content: 'He speaks English ___ he were British.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as',isCorrect:false},{text:'like',isCorrect:false},{text:'as if',isCorrect:true},{text:'that',isCorrect:false}] },
  { id: 'southHot_english_4_012', content: 'The word "disability" has ___ prefix(es).', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'one',isCorrect:false},{text:'two',isCorrect:true},{text:'three',isCorrect:false},{text:'none',isCorrect:false}] },
  { id: 'southHot_english_4_013', content: 'Not until midnight ___ the solution.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'I found',isCorrect:false},{text:'did I find',isCorrect:true},{text:'found I',isCorrect:false},{text:'I had found',isCorrect:false}] },
  { id: 'southHot_english_4_014', content: 'It is necessary that all students ___ the exam.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'take',isCorrect:true},{text:'takes',isCorrect:false},{text:'took',isCorrect:false},{text:'taking',isCorrect:false}] },
  { id: 'southHot_english_4_015', content: '___ hard, success will come.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Work',isCorrect:false},{text:'Working',isCorrect:true},{text:'If you work',isCorrect:false},{text:'Because you work',isCorrect:false}] },
  { id: 'southHot_english_4_016', content: 'The word "carefully" is an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'noun',isCorrect:false},{text:'verb',isCorrect:false},{text:'adverb',isCorrect:true},{text:'adjective',isCorrect:false}] },
  { id: 'southHot_english_4_017', content: 'Had I been there, I ___ the problem.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'solved',isCorrect:false},{text:'would solve',isCorrect:false},{text:'would have solved',isCorrect:true},{text:'had solved',isCorrect:false}] },
  { id: 'southHot_english_4_018', content: 'The phrase "once in a blue moon" is an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'proverb',isCorrect:false},{text:'idiom',isCorrect:true},{text:'metaphor',isCorrect:false},{text:'simile',isCorrect:false}] },
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
  { id: 'southHot_science_1_009', content: '太阳从哪里升起？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'西方',isCorrect:false},{text:'东方',isCorrect:true},{text:'北方',isCorrect:false},{text:'南方',isCorrect:false}] },
  { id: 'southHot_science_1_010', content: '什么器官帮我们呼吸？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'心脏',isCorrect:false},{text:'肺',isCorrect:true},{text:'胃',isCorrect:false},{text:'肝脏',isCorrect:false}] },
  { id: 'southHot_science_1_011', content: '植物的根长在哪里？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'空中',isCorrect:false},{text:'土壤里',isCorrect:true},{text:'水中',isCorrect:false},{text:'阳光里',isCorrect:false}] },
  { id: 'southHot_science_1_012', content: '什么会发光？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'月亮',isCorrect:false},{text:'星星',isCorrect:false},{text:'太阳',isCorrect:true},{text:'地球',isCorrect:false}] },
  { id: 'southHot_science_1_013', content: '水在什么温度会结冰？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:true},{text:'50°C',isCorrect:false},{text:'100°C',isCorrect:false},{text:'-10°C',isCorrect:false}] },
  { id: 'southHot_science_1_014', content: '什么颜色是天空的颜色？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'绿色',isCorrect:false},{text:'蓝色',isCorrect:true},{text:'红色',isCorrect:false},{text:'黄色',isCorrect:false}] },
  { id: 'southHot_science_1_015', content: '什么能让我们看见东西？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'耳朵',isCorrect:false},{text:'眼睛',isCorrect:true},{text:'鼻子',isCorrect:false},{text:'嘴巴',isCorrect:false}] },
  { id: 'southHot_science_1_016', content: '一年有几个季节？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'两个',isCorrect:false},{text:'三个',isCorrect:false},{text:'四个',isCorrect:true},{text:'五个',isCorrect:false}] },
  { id: 'southHot_science_1_017', content: '什么动物会飞？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'狗',isCorrect:false},{text:'鱼',isCorrect:false},{text:'蝴蝶',isCorrect:true},{text:'猫',isCorrect:false}] },
  { id: 'southHot_science_1_018', content: '雨是怎么形成的？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'从太阳来',isCorrect:false},{text:'从云里来',isCorrect:true},{text:'从风里来',isCorrect:false},{text:'从地里来',isCorrect:false}] },
  { id: 'southHot_science_1_019', content: '什么能导电？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'塑料',isCorrect:false},{text:'木头',isCorrect:false},{text:'金属',isCorrect:true},{text:'橡胶',isCorrect:false}] },
  { id: 'southHot_science_1_020', content: '动物和植物都需要什么？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'泥土',isCorrect:false},{text:'阳光和水',isCorrect:true},{text:'石头',isCorrect:false},{text:'风',isCorrect:false}] },
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
  { id: 'southHot_science_2_009', content: '植物的光合作用需要什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'只有水',isCorrect:false},{text:'阳光、水和二氧化碳',isCorrect:true},{text:'只有阳光',isCorrect:false},{text:'土壤和水分',isCorrect:false}] },
  { id: 'southHot_science_2_010', content: '声音是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'通过光',isCorrect:false},{text:'通过空气振动',isCorrect:true},{text:'通过水',isCorrect:false},{text:'不能传播',isCorrect:false}] },
  { id: 'southHot_science_2_011', content: '什么是动物的冬眠？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在冬天繁殖',isCorrect:false},{text:'动物在冬天睡觉减少活动',isCorrect:true},{text:'动物在冬天迁徙',isCorrect:false},{text:'动物在冬天吃东西',isCorrect:false}] },
  { id: 'southHot_science_2_012', content: '什么是绝缘体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'容易导电的物质',isCorrect:false},{text:'不容易导电的物质',isCorrect:true},{text:'只有塑料是绝缘体',isCorrect:false},{text:'所有金属都是绝缘体',isCorrect:false}] },
  { id: 'southHot_science_2_013', content: '水的沸点是？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'0°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'100°C',isCorrect:true},{text:'200°C',isCorrect:false}] },
  { id: 'southHot_science_2_014', content: '磁铁能吸引什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'塑料',isCorrect:false},{text:'木头',isCorrect:false},{text:'铁',isCorrect:true},{text:'布',isCorrect:false}] },
  { id: 'southHot_science_2_015', content: '地球自转一周大约是？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'一小时',isCorrect:false},{text:'一天',isCorrect:true},{text:'一个月',isCorrect:false},{text:'一年',isCorrect:false}] },
  { id: 'southHot_science_2_016', content: '植物的种子由什么传播？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'只有风',isCorrect:false},{text:'风、水、动物等多种方式',isCorrect:true},{text:'只有水',isCorrect:false},{text:'只有动物',isCorrect:false}] },
  { id: 'southHot_science_2_017', content: '什么是溶解？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'把东西变小',isCorrect:false},{text:'物质均匀分布在水中',isCorrect:true},{text:'把东西变大',isCorrect:false},{text:'把东西变硬',isCorrect:false}] },
  { id: 'southHot_science_2_018', content: '月亮的圆缺变化叫什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'月食',isCorrect:false},{text:'月相',isCorrect:true},{text:'月光',isCorrect:false},{text:'月动',isCorrect:false}] },
  { id: 'southHot_science_2_019', content: '声音不能在什么中传播？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'空气',isCorrect:false},{text:'水',isCorrect:false},{text:'真空',isCorrect:true},{text:'固体',isCorrect:false}] },
  { id: 'southHot_science_2_020', content: '什么是热胀冷缩？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'东西变重变轻',isCorrect:false},{text:'东西受热变大遇冷变小',isCorrect:true},{text:'东西变形',isCorrect:false},{text:'东西变色',isCorrect:false}] },
  { id: 'southHot_science_2_021', content: '一年中影子最短的时候是？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'早晨',isCorrect:false},{text:'中午',isCorrect:true},{text:'傍晚',isCorrect:false},{text:'深夜',isCorrect:false}] },
  { id: 'southHot_science_2_022', content: '什么是导体和绝缘体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'导体是金属，绝缘体是塑料',isCorrect:false},{text:'导体容易导电，绝缘体不容易导电',isCorrect:true},{text:'绝缘体容易导电，导体不容易',isCorrect:false},{text:'两者都能导电',isCorrect:false}] },
  { id: 'southHot_science_2_023', content: '水的三态变化是？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'雨、雪、冰雹',isCorrect:false},{text:'冰、水、水蒸气',isCorrect:true},{text:'云、雨、雪',isCorrect:false},{text:'河流、湖泊、海洋',isCorrect:false}] },
  { id: 'southHot_science_2_024', content: '太阳系中最大的行星是？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'地球',isCorrect:false},{text:'土星',isCorrect:false},{text:'木星',isCorrect:true},{text:'火星',isCorrect:false}] },
  { id: 'southHot_science_2_025', content: '什么东西能让磁铁失去磁性？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'铁',isCorrect:false},{text:'高温',isCorrect:true},{text:'铝',isCorrect:false},{text:'铜',isCorrect:false}] },
]

// === SCIENCE D3 (30题, grade 6-7) - Sample 8题 ===
const scienceD3Questions: Question[] = [
  { id: 'southHot_science_3_001', content: '植物细胞特有的结构是？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'细胞壁、叶绿体、液泡',isCorrect:true},{text:'细胞膜、细胞核、细胞质',isCorrect:false},{text:'线粒体、叶绿体、细胞核',isCorrect:false},{text:'细胞壁、线粒体、液泡',isCorrect:false}] },
  { id: 'southHot_science_3_002', content: '光的反射定律是什么？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'入射角与反射角无关',isCorrect:false}] },
  { id: 'southHot_science_3_003', content: '地球自转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一年',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一天',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'southHot_science_3_004', content: '什么是呼吸作用？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'吸收氧气释放二氧化碳',isCorrect:true},{text:'吸收二氧化碳释放氧气',isCorrect:false},{text:'只吸收氧气',isCorrect:false},{text:'只释放二氧化碳',isCorrect:false}] },
  { id: 'southHot_science_3_005', content: '大气压强通常用什么单位表示？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'牛顿',isCorrect:false},{text:'帕斯卡',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'安培',isCorrect:false}] },
  { id: 'southHot_science_3_006', content: '什么是免疫系统？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'抵抗疾病的身体防御系统',isCorrect:true},{text:'消化食物的系统',isCorrect:false},{text:'运输血液的系统',isCorrect:false},{text:'呼吸空气的系统',isCorrect:false}] },
  { id: 'southHot_science_3_007', content: '大气层的作用是什么？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'只有保护作用',isCorrect:false},{text:'调节气候、阻挡紫外线、保温',isCorrect:true},{text:'只提供氧气',isCorrect:false},{text:'没有任何作用',isCorrect:false}] },
  { id: 'southHot_science_3_008', content: '什么是化学变化？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质形状改变但本质不变',isCorrect:false},{text:'物质本质改变生成新物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质位置改变',isCorrect:false}] },
  { id: 'southHot_science_3_009', content: '什么是光合作用？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'植物吸收阳光制造食物',isCorrect:true},{text:'植物吸收水分',isCorrect:false},{text:'植物呼出氧气',isCorrect:false},{text:'植物吸收二氧化碳',isCorrect:false}] },
  { id: 'southHot_science_3_010', content: '声音的音调与什么有关？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'音量',isCorrect:false},{text:'振动频率',isCorrect:true},{text:'传播速度',isCorrect:false},{text:'振动幅度',isCorrect:false}] },
  { id: 'southHot_science_3_011', content: '地球公转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一天',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一年',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'southHot_science_3_012', content: '什么是动物的行为？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'动物的外形',isCorrect:false},{text:'动物对外界刺激的反应',isCorrect:true},{text:'动物的身体结构',isCorrect:false},{text:'动物的种类',isCorrect:false}] },
  { id: 'southHot_science_3_013', content: '燃烧需要什么条件？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'只需要火',isCorrect:false},{text:'可燃物、氧气、达到燃点',isCorrect:true},{text:'只需要氧气',isCorrect:false},{text:'只需要可燃物',isCorrect:false}] },
  { id: 'southHot_science_3_014', content: '什么是密度？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质的重量',isCorrect:false},{text:'单位体积的质量',isCorrect:true},{text:'物质的大小',isCorrect:false},{text:'物质的数量',isCorrect:false}] },
  { id: 'southHot_science_3_015', content: '太阳的主要成分是什么？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'氢和氦',isCorrect:true},{text:'氧和碳',isCorrect:false},{text:'铁和镁',isCorrect:false},{text:'铜和锌',isCorrect:false}] },
  { id: 'southHot_science_3_016', content: '什么是PH值？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'水的温度',isCorrect:false},{text:'溶液的酸碱度',isCorrect:true},{text:'水的硬度',isCorrect:false},{text:'水的纯度',isCorrect:false}] },
  { id: 'southHot_science_3_017', content: '声音的响度与什么有关？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'音调',isCorrect:false},{text:'振动幅度',isCorrect:true},{text:'振动频率',isCorrect:false},{text:'传播介质',isCorrect:false}] },
  { id: 'southHot_science_3_018', content: '什么是生物的多样性？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'同一种生物的数量',isCorrect:false},{text:'地球上各种生物及其生态系统',isCorrect:true},{text:'动物的种类',isCorrect:false},{text:'植物的数量',isCorrect:false}] },
  { id: 'southHot_science_3_019', content: '什么是杠杆原理？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'省力的机械原理',isCorrect:false},{text:'用力点、支点、阻力点的平衡原理',isCorrect:true},{text:'省距离的原理',isCorrect:false},{text:'增加速度的原理',isCorrect:false}] },
  { id: 'southHot_science_3_020', content: '什么是能量守恒定律？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'能量可以随意创造',isCorrect:false},{text:'能量既不会凭空产生也不会凭空消失',isCorrect:true},{text:'能量会逐渐减少',isCorrect:false},{text:'能量可以消失',isCorrect:false}] },
  { id: 'southHot_science_3_021', content: '植物的蒸腾作用是什么？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'植物吸收水分',isCorrect:false},{text:'植物通过叶片释放水蒸气',isCorrect:true},{text:'植物储存水分',isCorrect:false},{text:'植物运输水分',isCorrect:false}] },
  { id: 'southHot_science_3_022', content: '什么是反射？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光穿过物体',isCorrect:false},{text:'光遇到物体表面返回',isCorrect:true},{text:'光被物体吸收',isCorrect:false},{text:'光改变方向但不返回',isCorrect:false}] },
  { id: 'southHot_science_3_023', content: '什么是质量？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物体的重量',isCorrect:false},{text:'物体所含物质的量',isCorrect:true},{text:'物体的大小',isCorrect:false},{text:'物体的形状',isCorrect:false}] },
  { id: 'southHot_science_3_024', content: '血液的功能是什么？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'只有运输氧气',isCorrect:false},{text:'运输物质和调节体温',isCorrect:true},{text:'只有防御作用',isCorrect:false},{text:'只有调节体温',isCorrect:false}] },
  { id: 'southHot_science_3_025', content: '什么是折射？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光反射回来',isCorrect:false},{text:'光从一种介质进入另一种介质时方向改变',isCorrect:true},{text:'光被吸收',isCorrect:false},{text:'光沿直线传播',isCorrect:false}] },
  { id: 'southHot_science_3_026', content: '什么是遗传？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'后代与亲代完全相同',isCorrect:false},{text:'生物亲代传给子代的特征',isCorrect:true},{text:'生物变异的现象',isCorrect:false},{text:'生物进化的过程',isCorrect:false}] },
  { id: 'southHot_science_3_027', content: '什么是化合反应？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'一种物质分解成多种物质',isCorrect:false},{text:'多种物质反应生成一种物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质颜色改变',isCorrect:false}] },
  { id: 'southHot_science_3_028', content: '什么是分解反应？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'多种物质生成一种物质',isCorrect:false},{text:'一种物质分解成多种物质',isCorrect:true},{text:'物质状态改变',isCorrect:false},{text:'物质燃烧',isCorrect:false}] },
  { id: 'southHot_science_3_029', content: '声音的传播速度与什么有关？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'声音的音调',isCorrect:false},{text:'传播介质和温度',isCorrect:true},{text:'声音的响度',isCorrect:false},{text:'振动幅度',isCorrect:false}] },
  { id: 'southHot_science_3_030', content: '什么是生态系统？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'只有动物的环境',isCorrect:false},{text:'生物和它们所处环境的统一整体',isCorrect:true},{text:'只有植物的环境',isCorrect:false},{text:'一个独立的生物',isCorrect:false}] },
]

// === SCIENCE D4 (18题, grade 8) - Sample 6题 ===
const scienceD4Questions: Question[] = [
  { id: 'southHot_science_4_001', content: '电流的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'伏特',isCorrect:false},{text:'安培',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'欧姆',isCorrect:false}] },
  { id: 'southHot_science_4_002', content: '太阳系中离太阳最近的行星是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'金星',isCorrect:false},{text:'水星',isCorrect:true},{text:'火星',isCorrect:false},{text:'木星',isCorrect:false}] },
  { id: 'southHot_science_4_003', content: '染色体由什么组成？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'蛋白质',isCorrect:false},{text:'DNA和蛋白质',isCorrect:true},{text:'RNA和蛋白质',isCorrect:false},{text:'只有DNA',isCorrect:false}] },
  { id: 'southHot_science_4_004', content: '太阳系中有多少颗行星？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'7颗',isCorrect:false},{text:'8颗',isCorrect:true},{text:'9颗',isCorrect:false},{text:'10颗',isCorrect:false}] },
  { id: 'southHot_science_4_005', content: '什么是基因？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'DNA的全部序列',isCorrect:false},{text:'有遗传效应的DNA片段',isCorrect:true},{text:'染色体的别称',isCorrect:false},{text:'蛋白质的编码',isCorrect:false}] },
  { id: 'southHot_science_4_006', content: '什么是显性基因？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'在杂交中表现出来的基因',isCorrect:true},{text:'在杂交中隐藏的基因',isCorrect:false},{text:'不能表达性状的基因',isCorrect:false},{text:'只存在于男性的基因',isCorrect:false}] },
  { id: 'southHot_science_4_007', content: '电压的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'安培',isCorrect:false},{text:'伏特',isCorrect:true},{text:'瓦特',isCorrect:false},{text:'欧姆',isCorrect:false}] },
  { id: 'southHot_science_4_008', content: '太阳系中离太阳最远的行星是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地球',isCorrect:false},{text:'火星',isCorrect:false},{text:'海王星',isCorrect:true},{text:'木星',isCorrect:false}] },
  { id: 'southHot_science_4_009', content: 'DNA的全称是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'脱氧核糖核酸',isCorrect:true},{text:'核糖核酸',isCorrect:false},{text:'蛋白质',isCorrect:false},{text:'氨基酸',isCorrect:false}] },
  { id: 'southHot_science_4_010', content: '什么是基因突变？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'基因数量增加',isCorrect:false},{text:'基因分子结构的改变',isCorrect:true},{text:'基因消失',isCorrect:false},{text:'基因复制',isCorrect:false}] },
  { id: 'southHot_science_4_011', content: '欧姆定律的内容是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'电压=电流×电阻',isCorrect:true},{text:'电压=电流/电阻',isCorrect:false},{text:'电压=电流+电阻',isCorrect:false},{text:'电压=电阻/电流',isCorrect:false}] },
  { id: 'southHot_science_4_012', content: '植物的有性生殖细胞是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'根和茎',isCorrect:false},{text:'花粉和卵细胞',isCorrect:true},{text:'叶和花',isCorrect:false},{text:'果实和种子',isCorrect:false}] },
  { id: 'southHot_science_4_013', content: '什么是自然选择？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'人工选择生物品种',isCorrect:false},{text:'适者生存不适者淘汰',isCorrect:true},{text:'生物主动改变环境',isCorrect:false},{text:'所有生物都能生存',isCorrect:false}] },
  { id: 'southHot_science_4_014', content: '人体细胞中有多少条染色体？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'23条',isCorrect:false},{text:'46条',isCorrect:true},{text:'48条',isCorrect:false},{text:'44条',isCorrect:false}] },
  { id: 'southHot_science_4_015', content: '什么是PH值等于7？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'酸性',isCorrect:false},{text:'碱性',isCorrect:false},{text:'中性',isCorrect:true},{text:'弱酸性',isCorrect:false}] },
  { id: 'southHot_science_4_016', content: '串联电路中电流的特点是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'各处电流相等',isCorrect:true},{text:'各处电流不等',isCorrect:false},{text:'电流越来越小',isCorrect:false},{text:'电流越来越大',isCorrect:false}] },
  { id: 'southHot_science_4_017', content: '什么是光年？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'时间单位',isCorrect:false},{text:'距离单位',isCorrect:true},{text:'速度单位',isCorrect:false},{text:'质量单位',isCorrect:false}] },
  { id: 'southHot_science_4_018', content: '人体最大的内分泌腺是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'垂体',isCorrect:false},{text:'甲状腺',isCorrect:true},{text:'胰岛',isCorrect:false},{text:'肾上腺',isCorrect:false}] },
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
  { id: 'southHot_history_1_002', content: '秦始皇下令修建的是什么工程？', type: 'single', difficulty: 1, category: 'history', grade: 1, options: [{text:'长城',isCorrect:true},{text:'故宫',isCorrect:false},{text:'兵马俑',isCorrect:false},{text:'都江堰',isCorrect:false}] },
  { id: 'southHot_history_1_003', content: '三国是指哪三个国家？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'秦、楚、汉',isCorrect:false},{text:'魏、蜀、吴',isCorrect:true},{text:'赵、燕、齐',isCorrect:false},{text:'晋、宋、齐',isCorrect:false}] },
  { id: 'southHot_history_1_004', content: '《西游记》中的唐僧取经去哪里？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'日本',isCorrect:false},{text:'印度',isCorrect:true},{text:'韩国',isCorrect:false},{text:'泰国',isCorrect:false}] },
  { id: 'southHot_history_1_005', content: '造纸术是谁发明的？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'张衡',isCorrect:false},{text:'蔡伦',isCorrect:true},{text:'毕昇',isCorrect:false},{text:'华佗',isCorrect:false}] },
  { id: 'southHot_history_1_006', content: '指南针最早叫什么？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'司南',isCorrect:true},{text:'罗盘',isCorrect:false},{text:'指南车',isCorrect:false},{text:'指南针',isCorrect:false}] },
  { id: 'southHot_history_1_007', content: '唐朝的开国皇帝是？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'李世民',isCorrect:false},{text:'李渊',isCorrect:true},{text:'李隆基',isCorrect:false},{text:'李建成',isCorrect:false}] },
  { id: 'southHot_history_1_008', content: '南宋的第一个皇帝是？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'赵构',isCorrect:true},{text:'赵匡胤',isCorrect:false},{text:'赵鼎',isCorrect:false},{text:'赵昚',isCorrect:false}] },
  { id: 'southHot_history_1_009', content: '三国时期吴国的都城在哪里？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'洛阳',isCorrect:false},{text:'成都',isCorrect:false},{text:'建业',isCorrect:true},{text:'长安',isCorrect:false}] },
  { id: 'southHot_history_1_010', content: '《西游记》中的主角是谁？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'唐僧',isCorrect:true},{text:'曹操',isCorrect:false},{text:'诸葛亮',isCorrect:false},{text:'孙悟空',isCorrect:false}] },
  { id: 'southHot_history_1_011', content: '火药是谁发明的？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'蔡伦',isCorrect:false},{text:'孙思邈',isCorrect:true},{text:'张衡',isCorrect:false},{text:'华佗',isCorrect:false}] },
  { id: 'southHot_history_1_012', content: '印刷术最早是谁改进的？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'蔡伦',isCorrect:false},{text:'毕昇',isCorrect:true},{text:'沈括',isCorrect:false},{text:'张衡',isCorrect:false}] },
  { id: 'southHot_history_1_013', content: '唐朝最繁荣的时期叫什么？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'贞观之治',isCorrect:false},{text:'开元盛世',isCorrect:true},{text:'文景之治',isCorrect:false},{text:'康乾盛世',isCorrect:false}] },
  { id: 'southHot_history_1_014', content: '明代郑和下西洋最远到哪里？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'印度洋',isCorrect:false},{text:'大西洋',isCorrect:false},{text:'非洲东海岸',isCorrect:true},{text:'欧洲',isCorrect:false}] },
  { id: 'southHot_history_1_015', content: '秦朝的都城是？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'洛阳',isCorrect:false},{text:'长安',isCorrect:false},{text:'咸阳',isCorrect:true},{text:'许昌',isCorrect:false}] },
  { id: 'southHot_history_1_016', content: '赤壁之战发生在哪两个国家之间？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'魏和蜀',isCorrect:false},{text:'吴和蜀',isCorrect:false},{text:'魏和吴',isCorrect:true},{text:'魏和燕',isCorrect:false}] },
  { id: 'southHot_history_1_017', content: '活字印刷术用什么材料？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'泥',isCorrect:true},{text:'铁',isCorrect:false},{text:'铜',isCorrect:false},{text:'木',isCorrect:false}] },
  { id: 'southHot_history_1_018', content: '指南针最早出现在哪个朝代？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'汉朝',isCorrect:false},{text:'唐朝',isCorrect:false},{text:'宋朝',isCorrect:true},{text:'明朝',isCorrect:false}] },
  { id: 'southHot_history_1_019', content: '《三国演义》属于什么小说？', type: 'single', difficulty: 1, category: 'history', grade: 2, options: [{text:'历史小说',isCorrect:true},{text:'武侠小说',isCorrect:false},{text:'科幻小说',isCorrect:false},{text:'神话小说',isCorrect:false}] },
  { id: 'southHot_history_1_020', content: '我国第一个统一的多民族国家是？', type: 'single', difficulty: 1, category: 'history', grade: 3, options: [{text:'夏朝',isCorrect:false},{text:'商朝',isCorrect:false},{text:'秦朝',isCorrect:true},{text:'汉朝',isCorrect:false}] },
]

// === HISTORY D2 (25题, grade 4-5) - Sample 8题 ===
const historyD2Questions: Question[] = [
  { id: 'southHot_history_2_001', content: '《史记》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'司马光',isCorrect:false},{text:'司马迁',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
  { id: 'southHot_history_2_002', content: '唐朝著名诗人李白被称为什么？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'诗圣',isCorrect:false},{text:'诗仙',isCorrect:true},{text:'诗佛',isCorrect:false},{text:'诗鬼',isCorrect:false}] },
  { id: 'southHot_history_2_003', content: '北宋的第一个皇帝是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'赵匡胤',isCorrect:true},{text:'赵构',isCorrect:false},{text:'赵鼎',isCorrect:false},{text:'赵昚',isCorrect:false}] },
  { id: 'southHot_history_2_004', content: '明代著名航海家是谁？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'张骞',isCorrect:false},{text:'郑和',isCorrect:true},{text:'鉴真',isCorrect:false},{text:'玄奘',isCorrect:false}] },
  { id: 'southHot_history_2_005', content: '活字印刷术是谁发明的？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'蔡伦',isCorrect:false},{text:'毕昇',isCorrect:true},{text:'沈括',isCorrect:false},{text:'宋应星',isCorrect:false}] },
  { id: 'southHot_history_2_006', content: '《资治通鉴》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'司马迁',isCorrect:false},{text:'司马光',isCorrect:true},{text:'班固',isCorrect:false},{text:'陈寿',isCorrect:false}] },
  { id: 'southHot_history_2_007', content: '清朝的建立者是谁？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'乾隆',isCorrect:false},{text:'康熙',isCorrect:false},{text:'皇太极',isCorrect:true},{text:'努尔哈赤',isCorrect:false}] },
  { id: 'southHot_history_2_008', content: '甲午战争发生在哪一年？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'1840年',isCorrect:false},{text:'1894年',isCorrect:true},{text:'1900年',isCorrect:false},{text:'1911年',isCorrect:false}] },
  { id: 'southHot_history_2_009', content: '《黄庭经》是谁的作品？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'王羲之',isCorrect:true},{text:'王献之',isCorrect:false},{text:'王羲之',isCorrect:false},{text:'苏轼',isCorrect:false}] },
  { id: 'southHot_history_2_010', content: '明代戚继光抗的是什么？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'英国',isCorrect:false},{text:'荷兰',isCorrect:false},{text:'倭寇',isCorrect:true},{text:'葡萄牙',isCorrect:false}] },
  { id: 'southHot_history_2_011', content: '《天工开物》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'李时珍',isCorrect:false},{text:'徐光启',isCorrect:false},{text:'宋应星',isCorrect:true},{text:'徐霞客',isCorrect:false}] },
  { id: 'southHot_history_2_012', content: '清朝乾隆年间的文字狱因什么而兴起？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'经济发展',isCorrect:false},{text:'加强专制',isCorrect:true},{text:'文化繁荣',isCorrect:false},{text:'科技进步',isCorrect:false}] },
  { id: 'southHot_history_2_013', content: '唐朝著名诗人杜甫被称为什么？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'诗仙',isCorrect:false},{text:'诗圣',isCorrect:true},{text:'诗佛',isCorrect:false},{text:'诗鬼',isCorrect:false}] },
  { id: 'southHot_history_2_014', content: '《农政全书》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'徐光启',isCorrect:true},{text:'宋应星',isCorrect:false},{text:'李时珍',isCorrect:false},{text:'徐霞客',isCorrect:false}] },
  { id: 'southHot_history_2_015', content: '明代流行的四大声腔不包括哪个？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'昆腔',isCorrect:false},{text:'弋阳腔',isCorrect:false},{text:'梆子腔',isCorrect:true},{text:'余姚腔',isCorrect:false}] },
  { id: 'southHot_history_2_016', content: '《梦溪笔谈》属于什么类别的书？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'文学',isCorrect:false},{text:'历史',isCorrect:false},{text:'科学技术',isCorrect:true},{text:'哲学',isCorrect:false}] },
  { id: 'southHot_history_2_017', content: '《红楼梦》的别称是什么？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'《石头记》',isCorrect:true},{text:'《金陵记》',isCorrect:false},{text:'《情僧录》',isCorrect:false},{text:'《风月宝鉴》',isCorrect:false}] },
  { id: 'southHot_history_2_018', content: '《西游记》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'施耐庵',isCorrect:false},{text:'罗贯中',isCorrect:false},{text:'吴承恩',isCorrect:true},{text:'曹雪芹',isCorrect:false}] },
  { id: 'southHot_history_2_019', content: '明代八股文的考试形式出现在哪个皇帝时期？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'朱元璋',isCorrect:true},{text:'朱棣',isCorrect:false},{text:'康熙',isCorrect:false},{text:'乾隆',isCorrect:false}] },
  { id: 'southHot_history_2_020', content: '《牡丹亭》的作者是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'关汉卿',isCorrect:false},{text:'汤显祖',isCorrect:true},{text:'王实甫',isCorrect:false},{text:'马致远',isCorrect:false}] },
  { id: 'southHot_history_2_021', content: '明代长城的东端起点是？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'山海关',isCorrect:true},{text:'嘉峪关',isCorrect:false},{text:'居庸关',isCorrect:false},{text:'玉门关',isCorrect:false}] },
  { id: 'southHot_history_2_022', content: '清朝初期实行了什么政策限制对外贸易？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'海禁政策',isCorrect:true},{text:'开放政策',isCorrect:false},{text:'鼓励贸易',isCorrect:false},{text:'自由贸易',isCorrect:false}] },
  { id: 'southHot_history_2_023', content: '《聊斋志异》是什么类型的作品？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'长篇小说',isCorrect:false},{text:'短篇小说集',isCorrect:true},{text:'诗歌集',isCorrect:false},{text:'戏剧',isCorrect:false}] },
  { id: 'southHot_history_2_024', content: '明代郑和是什么职业？', type: 'single', difficulty: 2, category: 'history', grade: 4, options: [{text:'商人',isCorrect:false},{text:'外交官和航海家',isCorrect:true},{text:'将军',isCorrect:false},{text:'学者',isCorrect:false}] },
  { id: 'southHot_history_2_025', content: '清朝统治中国共多少年？', type: 'single', difficulty: 2, category: 'history', grade: 5, options: [{text:'200多年',isCorrect:false},{text:'267年',isCorrect:false},{text:'276年',isCorrect:true},{text:'268年',isCorrect:false}] },
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
  { id: 'southHot_history_3_008', content: '第一次鸦片战争正式开始于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'1839年',isCorrect:false},{text:'1840年',isCorrect:true},{text:'1842年',isCorrect:false},{text:'1856年',isCorrect:false}] },
  { id: 'southHot_history_3_009', content: '火烧圆明园发生在哪次战争期间？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'鸦片战争',isCorrect:false},{text:'第二次鸦片战争',isCorrect:true},{text:'甲午战争',isCorrect:false},{text:'八国联军侵华',isCorrect:false}] },
  { id: 'southHot_history_3_010', content: '《马关条约》是在哪次战争后签订的？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'鸦片战争',isCorrect:false},{text:'第二次鸦片战争',isCorrect:false},{text:'甲午战争',isCorrect:true},{text:'八国联军侵华',isCorrect:false}] },
  { id: 'southHot_history_3_011', content: '中国同盟会的革命纲领是？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'民族、民权、民生',isCorrect:true},{text:'民主、科学',isCorrect:false},{text:'自强、求富',isCorrect:false},{text:'救亡图存',isCorrect:false}] },
  { id: 'southHot_history_3_012', content: '洋务运动的主要代表人物有？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'康有为、梁启超',isCorrect:false},{text:'李鸿章、左宗棠',isCorrect:true},{text:'孙中山、黄兴',isCorrect:false},{text:'陈独秀、胡适',isCorrect:false}] },
  { id: 'southHot_history_3_013', content: '戊戌变法因何而失败？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'没有军事力量',isCorrect:false},{text:'依靠封建官僚',isCorrect:false},{text:'触犯顽固派利益且力量弱小',isCorrect:true},{text:'外国干涉',isCorrect:false}] },
  { id: 'southHot_history_3_014', content: '《辛丑条约》签订于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1895年',isCorrect:false},{text:'1900年',isCorrect:false},{text:'1901年',isCorrect:true},{text:'1911年',isCorrect:false}] },
  { id: 'southHot_history_3_015', content: '公车上书发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'1894年',isCorrect:false},{text:'1895年',isCorrect:true},{text:'1898年',isCorrect:false},{text:'1900年',isCorrect:false}] },
  { id: 'southHot_history_3_016', content: '三民主义是指什么？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'民主、民权、民生',isCorrect:false},{text:'民族、民权、民生',isCorrect:true},{text:'民族、民权、民主',isCorrect:false},{text:'民主、自由、民生',isCorrect:false}] },
  { id: 'southHot_history_3_017', content: '黄花岗起义发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'1905年',isCorrect:false},{text:'1911年',isCorrect:true},{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:false}] },
  { id: 'southHot_history_3_018', content: '《中华民国临时约法》颁布于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1911年',isCorrect:false},{text:'1912年',isCorrect:true},{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:false}] },
  { id: 'southHot_history_3_019', content: '新文化运动的主要内容不包括？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'提倡民主',isCorrect:false},{text:'提倡科学',isCorrect:false},{text:'提倡新文学',isCorrect:false},{text:'提倡武力革命',isCorrect:true}] },
  { id: 'southHot_history_3_020', content: '五四运动的主力是？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'商人',isCorrect:false},{text:'学生',isCorrect:true},{text:'工人',isCorrect:false},{text:'农民',isCorrect:false}] },
  { id: 'southHot_history_3_021', content: '中国共产党第一次全国代表大会在哪召开？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'北京',isCorrect:false},{text:'上海',isCorrect:true},{text:'广州',isCorrect:false},{text:'武汉',isCorrect:false}] },
  { id: 'southHot_history_3_022', content: '北伐战争的主要对象是？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'清朝政府',isCorrect:false},{text:'北洋军阀',isCorrect:true},{text:'日本侵略者',isCorrect:false},{text:'国民党反动派',isCorrect:false}] },
  { id: 'southHot_history_3_023', content: '南昌起义发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1921年',isCorrect:false},{text:'1927年',isCorrect:true},{text:'1935年',isCorrect:false},{text:'1949年',isCorrect:false}] },
  { id: 'southHot_history_3_024', content: '遵义会议召开于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1934年',isCorrect:false},{text:'1935年',isCorrect:true},{text:'1936年',isCorrect:false},{text:'1937年',isCorrect:false}] },
  { id: 'southHot_history_3_025', content: '九一八事变发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1929年',isCorrect:false},{text:'1931年',isCorrect:true},{text:'1937年',isCorrect:false},{text:'1945年',isCorrect:false}] },
  { id: 'southHot_history_3_026', content: '七七事变发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1931年',isCorrect:false},{text:'1935年',isCorrect:false},{text:'1937年',isCorrect:true},{text:'1945年',isCorrect:false}] },
  { id: 'southHot_history_3_027', content: '南京大屠杀发生在哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1931年',isCorrect:false},{text:'1937年',isCorrect:true},{text:'1945年',isCorrect:false},{text:'1949年',isCorrect:false}] },
  { id: 'southHot_history_3_028', content: '抗日战争胜利后国共两党进行了什么谈判？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'和平谈判',isCorrect:true},{text:'战争谈判',isCorrect:false},{text:'分裂谈判',isCorrect:false},{text:'投降谈判',isCorrect:false}] },
  { id: 'southHot_history_3_029', content: '解放战争三大战役不包括？', type: 'single', difficulty: 3, category: 'history', grade: 7, options: [{text:'辽沈战役',isCorrect:false},{text:'淮海战役',isCorrect:false},{text:'平津战役',isCorrect:false},{text:'台儿庄战役',isCorrect:true}] },
  { id: 'southHot_history_3_030', content: '中华人民共和国成立于哪一年？', type: 'single', difficulty: 3, category: 'history', grade: 6, options: [{text:'1945年',isCorrect:false},{text:'1949年',isCorrect:true},{text:'1950年',isCorrect:false},{text:'1951年',isCorrect:false}] },
]

// === HISTORY D4 (18题, grade 8) - Sample 6题 ===
const historyD4Questions: Question[] = [
  { id: 'southHot_history_4_001', content: '洋务运动的口号是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'自强、求富',isCorrect:true},{text:'民主、科学',isCorrect:false},{text:'救亡图存',isCorrect:false},{text:'中学为体，西学为用',isCorrect:false}] },
  { id: 'southHot_history_4_002', content: '戊戌变法发生在哪个皇帝在位时？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'咸丰帝',isCorrect:false},{text:'光绪帝',isCorrect:true},{text:'宣统帝',isCorrect:false},{text:'慈禧太后',isCorrect:false}] },
  { id: 'southHot_history_4_003', content: '辛亥革命的指导思想是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'三民主义',isCorrect:true},{text:'马克思主义',isCorrect:false},{text:'民主科学',isCorrect:false},{text:'社会主义',isCorrect:false}] },
  { id: 'southHot_history_4_004', content: '中国同盟会成立于哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1894年',isCorrect:false},{text:'1905年',isCorrect:true},{text:'1911年',isCorrect:false},{text:'1919年',isCorrect:false}] },
  { id: 'southHot_history_4_005', content: '新文化运动的主要阵地是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'《新青年》',isCorrect:true},{text:'《民报》',isCorrect:false},{text:'《时务报》',isCorrect:false},{text:'《国闻报》',isCorrect:false}] },
  { id: 'southHot_history_4_006', content: '科举制度正式废除于哪个朝代？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'宋朝',isCorrect:false},{text:'明朝',isCorrect:false},{text:'清朝',isCorrect:true},{text:'元朝',isCorrect:false}] },
  { id: 'southHot_history_4_007', content: '百日维新持续了多少天？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'99天',isCorrect:false},{text:'103天',isCorrect:true},{text:'120天',isCorrect:false},{text:'150天',isCorrect:false}] },
  { id: 'southHot_history_4_008', content: '《新青年》杂志最初叫什么？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'《青年杂志》',isCorrect:true},{text:'《新青年》',isCorrect:false},{text:'《新潮》',isCorrect:false},{text:'《新报》',isCorrect:false}] },
  { id: 'southHot_history_4_009', content: '洋务运动兴办的军工企业不包括？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'江南制造总局',isCorrect:false},{text:'福州船政局',isCorrect:false},{text:'轮船招商局',isCorrect:true},{text:'天津机器局',isCorrect:false}] },
  { id: 'southHot_history_4_010', content: '中国近代不平等条约中赔款最多的是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'《南京条约》',isCorrect:false},{text:'《马关条约》',isCorrect:false},{text:'《辛丑条约》',isCorrect:true},{text:'《北京条约》',isCorrect:false}] },
  { id: 'southHot_history_4_011', content: '戊戌变法时维新派创办的学会不包括？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'强学会',isCorrect:false},{text:'南学会',isCorrect:false},{text:'保国会',isCorrect:false},{text:'兴学会',isCorrect:true}] },
  { id: 'southHot_history_4_012', content: '洋务运动中创办的民用工业有？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'轮船招商局',isCorrect:true},{text:'江南制造总局',isCorrect:false},{text:'福州船政局',isCorrect:false},{text:'天津机器局',isCorrect:false}] },
  { id: 'southHot_history_4_013', content: '《中华民国临时约法》的性质是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'封建制法律',isCorrect:false},{text:'资产阶级民主共和宪法',isCorrect:true},{text:'君主立宪制法律',isCorrect:false},{text:'社会主义法律',isCorrect:false}] },
  { id: 'southHot_history_4_014', content: '第一次国共合作的政治基础是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'三民主义',isCorrect:true},{text:'马克思主义',isCorrect:false},{text:'资本主义',isCorrect:false},{text:'社会主义',isCorrect:false}] },
  { id: 'southHot_history_4_015', content: '北伐战争结束于哪一年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'1926年',isCorrect:false},{text:'1927年',isCorrect:false},{text:'1928年',isCorrect:true},{text:'1930年',isCorrect:false}] },
  { id: 'southHot_history_4_016', content: '张学良和杨虎城发动了什么事变？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'九一八事变',isCorrect:false},{text:'西安事变',isCorrect:true},{text:'七七事变',isCorrect:false},{text:'皖南事变',isCorrect:false}] },
  { id: 'southHot_history_4_017', content: '全面抗战开始的标志是？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'九一八事变',isCorrect:false},{text:'西安事变',isCorrect:false},{text:'七七事变',isCorrect:true},{text:'八一三事变',isCorrect:false}] },
  { id: 'southHot_history_4_018', content: '抗战胜利后台湾被日本占领了多少年？', type: 'single', difficulty: 4, category: 'history', grade: 8, options: [{text:'40年',isCorrect:false},{text:'50年',isCorrect:true},{text:'60年',isCorrect:false},{text:'70年',isCorrect:false}] },
]

// === HISTORY D5 (7题, grade 9) - Sample 5题 ===
const historyD5Questions: Question[] = [
  { id: 'southHot_history_5_001', content: '文艺复兴运动起源于哪个国家？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'法国',isCorrect:false},{text:'英国',isCorrect:false},{text:'意大利',isCorrect:true},{text:'西班牙',isCorrect:false}] },
  { id: 'southHot_history_5_002', content: '法国大革命爆发的标志是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'攻占巴士底狱',isCorrect:true},{text:'《人权宣言》发表',isCorrect:false},{text:'拿破仑掌权',isCorrect:false},{text:'三级会议召开',isCorrect:false}] },
  { id: 'southHot_history_5_003', content: '第一次世界大战的导火索是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'萨拉热窝事件',isCorrect:true},{text:'德国闪击波兰',isCorrect:false},{text:'俄国十月革命',isCorrect:false},{text:'凡尔登战役',isCorrect:false}] },
  { id: 'southHot_history_5_004', content: '《凡尔赛和约》的主要内容是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'建立联合国',isCorrect:false},{text:'对德国进行惩罚和限制',isCorrect:true},{text:'瓜分德国殖民地',isCorrect:false},{text:'赔偿美国损失',isCorrect:false}] },
  { id: 'southHot_history_5_005', content: '十月革命发生在哪一年？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'1914年',isCorrect:false},{text:'1917年',isCorrect:true},{text:'1919年',isCorrect:false},{text:'1921年',isCorrect:false}] },
  { id: 'southHot_history_5_006', content: '冷战结束的标志性事件是？', type: 'single', difficulty: 5, category: 'history', grade: 9, options: [{text:'苏联解体',isCorrect:true},{text:'柏林墙倒塌',isCorrect:false},{text:'经互会解散',isCorrect:false},{text:'华约解散',isCorrect:false}] },
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