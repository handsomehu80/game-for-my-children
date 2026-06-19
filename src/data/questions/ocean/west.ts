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

// === MATH D1 (22 more, to reach 30 total) ===
const mathD1Questions: Question[] = [
  { id: 'west_math_1_001', content: '10 + 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'west_math_1_002', content: '8 - 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_1_003', content: '2 × 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_004', content: '16 ÷ 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_005', content: '25 + 14 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'37',isCorrect:false},{text:'38',isCorrect:false},{text:'39',isCorrect:true},{text:'40',isCorrect:false}] },
  { id: 'west_math_1_006', content: '50 - 23 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'25',isCorrect:false},{text:'26',isCorrect:false},{text:'27',isCorrect:true},{text:'28',isCorrect:false}] },
  { id: 'west_math_1_007', content: '3 × 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'18',isCorrect:false},{text:'20',isCorrect:false},{text:'21',isCorrect:true},{text:'24',isCorrect:false}] },
  { id: 'west_math_1_008', content: '42 ÷ 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'west_math_1_009', content: '6 + 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'west_math_1_010', content: '12 - 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_011', content: '3 × 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'12',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'west_math_1_012', content: '20 ÷ 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_1_013', content: '34 + 17 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'49',isCorrect:false},{text:'50',isCorrect:false},{text:'51',isCorrect:true},{text:'52',isCorrect:false}] },
  { id: 'west_math_1_014', content: '67 - 29 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'36',isCorrect:false},{text:'37',isCorrect:false},{text:'38',isCorrect:true},{text:'39',isCorrect:false}] },
  { id: 'west_math_1_015', content: '4 × 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'30',isCorrect:false},{text:'32',isCorrect:true},{text:'34',isCorrect:false},{text:'36',isCorrect:false}] },
  { id: 'west_math_1_016', content: '63 ÷ 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_017', content: '5 + 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'11',isCorrect:false},{text:'12',isCorrect:false},{text:'13',isCorrect:true},{text:'14',isCorrect:false}] },
  { id: 'west_math_1_018', content: '15 - 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_019', content: '4 × 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'14',isCorrect:false},{text:'15',isCorrect:false},{text:'16',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'west_math_1_020', content: '24 ÷ 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_1_021', content: '46 + 25 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'69',isCorrect:false},{text:'70',isCorrect:false},{text:'71',isCorrect:true},{text:'72',isCorrect:false}] },
  { id: 'west_math_1_022', content: '82 - 37 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'43',isCorrect:false},{text:'44',isCorrect:false},{text:'45',isCorrect:true},{text:'46',isCorrect:false}] },
  { id: 'west_math_1_023', content: '5 × 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'28',isCorrect:false},{text:'29',isCorrect:false},{text:'30',isCorrect:true},{text:'32',isCorrect:false}] },
  { id: 'west_math_1_024', content: '36 ÷ 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'west_math_1_025', content: '7 × 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'40',isCorrect:false},{text:'42',isCorrect:true},{text:'44',isCorrect:false},{text:'46',isCorrect:false}] },
  { id: 'west_math_1_026', content: '72 ÷ 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'west_math_1_027', content: '45 + 38 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'81',isCorrect:false},{text:'82',isCorrect:false},{text:'83',isCorrect:true},{text:'84',isCorrect:false}] },
  { id: 'west_math_1_028', content: '93 - 47 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'44',isCorrect:false},{text:'45',isCorrect:false},{text:'46',isCorrect:true},{text:'47',isCorrect:false}] },
  { id: 'west_math_1_029', content: '9 × 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'79',isCorrect:false},{text:'80',isCorrect:false},{text:'81',isCorrect:true},{text:'82',isCorrect:false}] },
  { id: 'west_math_1_030', content: '56 ÷ 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D2 (28题, grade 4-5) ===
const mathD2Questions: Question[] = [
  { id: 'west_math_2_001', content: '156 + 278 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'424',isCorrect:false},{text:'434',isCorrect:true},{text:'444',isCorrect:false},{text:'454',isCorrect:false}] },
  { id: 'west_math_2_002', content: '800 - 347 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'443',isCorrect:false},{text:'453',isCorrect:true},{text:'463',isCorrect:false},{text:'473',isCorrect:false}] },
  { id: 'west_math_2_003', content: '24 × 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'340',isCorrect:false},{text:'350',isCorrect:false},{text:'360',isCorrect:true},{text:'370',isCorrect:false}] },
  { id: 'west_math_2_004', content: '432 ÷ 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'52',isCorrect:false},{text:'53',isCorrect:false},{text:'54',isCorrect:true},{text:'55',isCorrect:false}] },
  { id: 'west_math_2_005', content: '3.5 + 2.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'5.3',isCorrect:false},{text:'6.2',isCorrect:false},{text:'6.3',isCorrect:true},{text:'7.2',isCorrect:false}] },
  { id: 'west_math_2_006', content: '7.6 - 3.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3.6',isCorrect:false},{text:'3.7',isCorrect:true},{text:'4.6',isCorrect:false},{text:'4.7',isCorrect:false}] },
  { id: 'west_math_2_007', content: '0.5 × 1.6 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'0.8',isCorrect:true},{text:'0.7',isCorrect:false},{text:'0.9',isCorrect:false},{text:'1.0',isCorrect:false}] },
  { id: 'west_math_2_008', content: '2.4 ÷ 0.6 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false},{text:'6',isCorrect:false}] },
  { id: 'west_math_2_009', content: '245 + 368 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'603',isCorrect:false},{text:'613',isCorrect:true},{text:'623',isCorrect:false},{text:'633',isCorrect:false}] },
  { id: 'west_math_2_010', content: '1000 - 583 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'407',isCorrect:false},{text:'417',isCorrect:true},{text:'427',isCorrect:false},{text:'437',isCorrect:false}] },
  { id: 'west_math_2_011', content: '18 × 23 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'404',isCorrect:false},{text:'414',isCorrect:true},{text:'424',isCorrect:false},{text:'434',isCorrect:false}] },
  { id: 'west_math_2_012', content: '756 ÷ 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'62',isCorrect:false},{text:'63',isCorrect:true},{text:'64',isCorrect:false},{text:'65',isCorrect:false}] },
  { id: 'west_math_2_013', content: '4.7 + 3.5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'7.2',isCorrect:false},{text:'8.0',isCorrect:false},{text:'8.2',isCorrect:true},{text:'8.4',isCorrect:false}] },
  { id: 'west_math_2_014', content: '9.8 - 4.3 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4.5',isCorrect:false},{text:'5.3',isCorrect:false},{text:'5.5',isCorrect:true},{text:'6.5',isCorrect:false}] },
  { id: 'west_math_2_015', content: '1.2 × 3.5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'3.8',isCorrect:false},{text:'4.0',isCorrect:false},{text:'4.2',isCorrect:true},{text:'4.4',isCorrect:false}] },
  { id: 'west_math_2_016', content: '5.6 ÷ 0.7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'west_math_2_017', content: '378 + 459 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'827',isCorrect:false},{text:'837',isCorrect:true},{text:'847',isCorrect:false},{text:'857',isCorrect:false}] },
  { id: 'west_math_2_018', content: '900 - 467 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'423',isCorrect:false},{text:'433',isCorrect:true},{text:'443',isCorrect:false},{text:'453',isCorrect:false}] },
  { id: 'west_math_2_019', content: '32 × 25 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'700',isCorrect:false},{text:'800',isCorrect:true},{text:'900',isCorrect:false},{text:'1000',isCorrect:false}] },
  { id: 'west_math_2_020', content: '960 ÷ 16 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'50',isCorrect:false},{text:'55',isCorrect:false},{text:'60',isCorrect:true},{text:'65',isCorrect:false}] },
  { id: 'west_math_2_021', content: '6.3 + 2.9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'8.2',isCorrect:false},{text:'9.0',isCorrect:false},{text:'9.2',isCorrect:true},{text:'9.4',isCorrect:false}] },
  { id: 'west_math_2_022', content: '8.5 - 3.7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'4.6',isCorrect:false},{text:'4.8',isCorrect:true},{text:'5.6',isCorrect:false},{text:'5.8',isCorrect:false}] },
  { id: 'west_math_2_023', content: '2.5 × 0.8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'1.8',isCorrect:false},{text:'2.0',isCorrect:true},{text:'2.2',isCorrect:false},{text:'2.4',isCorrect:false}] },
  { id: 'west_math_2_024', content: '7.2 ÷ 1.2 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'west_math_2_025', content: '567 + 289 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'846',isCorrect:false},{text:'856',isCorrect:true},{text:'866',isCorrect:false},{text:'876',isCorrect:false}] },
  { id: 'west_math_2_026', content: '1000 - 628 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'362',isCorrect:false},{text:'372',isCorrect:true},{text:'382',isCorrect:false},{text:'392',isCorrect:false}] },
  { id: 'west_math_2_027', content: '45 × 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'530',isCorrect:false},{text:'540',isCorrect:true},{text:'550',isCorrect:false},{text:'560',isCorrect:false}] },
  { id: 'west_math_2_028', content: '864 ÷ 24 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'34',isCorrect:false},{text:'36',isCorrect:true},{text:'38',isCorrect:false},{text:'40',isCorrect:false}] },
]

// === MATH D3 (25题, grade 6-7) ===
const mathD3Questions: Question[] = [
  { id: 'west_math_3_001', content: '-12 + 5 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-17',isCorrect:false},{text:'-7',isCorrect:true},{text:'7',isCorrect:false},{text:'17',isCorrect:false}] },
  { id: 'west_math_3_002', content: '(-3) × (-4) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-12',isCorrect:false},{text:'12',isCorrect:true},{text:'-7',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_3_003', content: '5² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'10',isCorrect:false},{text:'25',isCorrect:true},{text:'52',isCorrect:false},{text:'20',isCorrect:false}] },
  { id: 'west_math_3_004', content: '√81 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'west_math_3_005', content: '2x - 4 = 10, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'west_math_3_006', content: '3(x + 2) = 21, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'west_math_3_007', content: '40% of 150 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'50',isCorrect:false},{text:'55',isCorrect:false},{text:'60',isCorrect:true},{text:'65',isCorrect:false}] },
  { id: 'west_math_3_008', content: 'π ≈ ? (取两位小数)', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3.12',isCorrect:false},{text:'3.14',isCorrect:true},{text:'3.16',isCorrect:false},{text:'3.18',isCorrect:false}] },
  { id: 'west_math_3_009', content: '-8 + 3 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-11',isCorrect:false},{text:'-5',isCorrect:true},{text:'5',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'west_math_3_010', content: '(-5) × (-6) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-30',isCorrect:false},{text:'30',isCorrect:true},{text:'-11',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'west_math_3_011', content: '3² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'6',isCorrect:false},{text:'9',isCorrect:true},{text:'27',isCorrect:false},{text:'12',isCorrect:false}] },
  { id: 'west_math_3_012', content: '√49 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'west_math_3_013', content: '5x + 3 = 18, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'west_math_3_014', content: '2(3x - 1) = 16, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'west_math_3_015', content: '25% of 80 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'15',isCorrect:false},{text:'18',isCorrect:false},{text:'20',isCorrect:true},{text:'22',isCorrect:false}] },
  { id: 'west_math_3_016', content: '√121 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:true},{text:'12',isCorrect:false},{text:'13',isCorrect:false}] },
  { id: 'west_math_3_017', content: '(-9) - (-4) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-13',isCorrect:false},{text:'-5',isCorrect:true},{text:'5',isCorrect:false},{text:'13',isCorrect:false}] },
  { id: 'west_math_3_018', content: '(-2) × 7 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'-14',isCorrect:true},{text:'-9',isCorrect:false},{text:'9',isCorrect:false},{text:'14',isCorrect:false}] },
  { id: 'west_math_3_019', content: '4² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'8',isCorrect:false},{text:'16',isCorrect:true},{text:'24',isCorrect:false},{text:'32',isCorrect:false}] },
  { id: 'west_math_3_020', content: '√144 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
  { id: 'west_math_3_021', content: '4x - 7 = 13, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'west_math_3_022', content: '5(x + 3) = 25, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'west_math_3_023', content: '60% of 45 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'24',isCorrect:false},{text:'25',isCorrect:false},{text:'27',isCorrect:true},{text:'30',isCorrect:false}] },
  { id: 'west_math_3_024', content: '7² = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'14',isCorrect:false},{text:'49',isCorrect:true},{text:'77',isCorrect:false},{text:'42',isCorrect:false}] },
  { id: 'west_math_3_025', content: '√169 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'11',isCorrect:false},{text:'12',isCorrect:false},{text:'13',isCorrect:true},{text:'14',isCorrect:false}] },
]

// === MATH D4 (12题, grade 8) ===
const mathD4Questions: Question[] = [
  { id: 'west_math_4_001', content: 'x² - 4 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'±1',isCorrect:false},{text:'±2',isCorrect:true},{text:'±3',isCorrect:false},{text:'±4',isCorrect:false}] },
  { id: 'west_math_4_002', content: 'y = 2x + 1, when x = 3, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'west_math_4_003', content: 'cos(0°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'-1',isCorrect:false},{text:'√2/2',isCorrect:false}] },
  { id: 'west_math_4_004', content: 'a⁴ ÷ a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a²',isCorrect:true},{text:'a⁶',isCorrect:false},{text:'a⁸',isCorrect:false},{text:'1',isCorrect:false}] },
  { id: 'west_math_4_005', content: '(x+3)(x-3) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-9',isCorrect:true},{text:'x²+9',isCorrect:false},{text:'x²-6x+9',isCorrect:false},{text:'x²+6x-9',isCorrect:false}] },
  { id: 'west_math_4_006', content: '√72 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'6√2',isCorrect:true},{text:'3√6',isCorrect:false},{text:'2√18',isCorrect:false},{text:'8√3',isCorrect:false}] },
  { id: 'west_math_4_007', content: 'x² - 9 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'±2',isCorrect:false},{text:'±3',isCorrect:true},{text:'±4',isCorrect:false},{text:'±5',isCorrect:false}] },
  { id: 'west_math_4_008', content: 'y = 3x - 2, when x = 4, y = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'8',isCorrect:false},{text:'10',isCorrect:true},{text:'12',isCorrect:false},{text:'14',isCorrect:false}] },
  { id: 'west_math_4_009', content: 'sin(90°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'1',isCorrect:true},{text:'-1',isCorrect:false},{text:'√2/2',isCorrect:false}] },
  { id: 'west_math_4_010', content: 'a⁵ ÷ a³ = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a²',isCorrect:true},{text:'a⁸',isCorrect:false},{text:'a¹⁵',isCorrect:false},{text:'1',isCorrect:false}] },
  { id: 'west_math_4_011', content: '(x+2)(x-2) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-4',isCorrect:true},{text:'x²+4',isCorrect:false},{text:'x²-4x+4',isCorrect:false},{text:'x²+4x-4',isCorrect:false}] },
  { id: 'west_math_4_012', content: '√50 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5√2',isCorrect:true},{text:'2√5',isCorrect:false},{text:'5√3',isCorrect:false},{text:'3√5',isCorrect:false}] },
]

// === MATH D5 (5题, grade 9) ===
const mathD5Questions: Question[] = [
  { id: 'west_math_5_001', content: 'x² + 4x + 4 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'-2',isCorrect:true},{text:'2',isCorrect:false},{text:'-4',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'west_math_5_002', content: 'log₁₀(100) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'10',isCorrect:false},{text:'100',isCorrect:false}] },
  { id: 'west_math_5_003', content: 'sin(30°) = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:true},{text:'1',isCorrect:false},{text:'√2/2',isCorrect:false}] },
  { id: 'west_math_5_004', content: '袋中有 4 个红球和 6 个白球，摸到红球的概率是？', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'2/5',isCorrect:true},{text:'3/5',isCorrect:false},{text:'1/2',isCorrect:false},{text:'4/6',isCorrect:false}] },
  { id: 'west_math_5_005', content: '数据 1, 3, 5, 7, 9 的中位数是？', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'3',isCorrect:false},{text:'5',isCorrect:true},{text:'7',isCorrect:false},{text:'4',isCorrect:false}] },
]

// === CHINESE D1 (30题, grade 1-3) ===
const chineseD1Questions: Question[] = [
  { id: 'west_chinese_1_001', content: '"水"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'west_chinese_1_002', content: '"月"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'太阳',isCorrect:false},{text:'月亮',isCorrect:true},{text:'星星',isCorrect:false},{text:'云彩',isCorrect:false}] },
  { id: 'west_chinese_1_003', content: '下列哪个是动物？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'汽车',isCorrect:false},{text:'飞机',isCorrect:false},{text:'小狗',isCorrect:true},{text:'电脑',isCorrect:false}] },
  { id: 'west_chinese_1_004', content: '"大"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'小',isCorrect:true},{text:'高',isCorrect:false},{text:'长',isCorrect:false},{text:'胖',isCorrect:false}] },
  { id: 'west_chinese_1_005', content: '一周有几天？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'5天',isCorrect:false},{text:'6天',isCorrect:false},{text:'7天',isCorrect:true},{text:'8天',isCorrect:false}] },
  { id: 'west_chinese_1_006', content: '"人"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:true},{text:'3画',isCorrect:false},{text:'4画',isCorrect:false}] },
  { id: 'west_chinese_1_007', content: '哪个字是形容词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'跑',isCorrect:false},{text:'美丽',isCorrect:true},{text:'吃',isCorrect:false},{text:'想',isCorrect:false}] },
  { id: 'west_chinese_1_008', content: '"书"可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'书生',isCorrect:false},{text:'书包',isCorrect:true},{text:'书法',isCorrect:false},{text:'书架',isCorrect:false}] },
  { id: 'west_chinese_1_009', content: '"日"字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'west_chinese_1_010', content: '下列哪个是水果？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'白菜',isCorrect:false},{text:'苹果',isCorrect:true},{text:'萝卜',isCorrect:false},{text:'黄瓜',isCorrect:false}] },
  { id: 'west_chinese_1_011', content: '"上"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'下',isCorrect:true},{text:'前',isCorrect:false},{text:'左',isCorrect:false},{text:'高',isCorrect:false}] },
  { id: 'west_chinese_1_012', content: '"口"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false}] },
  { id: 'west_chinese_1_013', content: '哪个是动词？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'高',isCorrect:false},{text:'美丽',isCorrect:false},{text:'跳',isCorrect:true},{text:'快乐',isCorrect:false}] },
  { id: 'west_chinese_1_014', content: '"天"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false}] },
  { id: 'west_chinese_1_015', content: '一年有几个季节？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:false},{text:'4个',isCorrect:true},{text:'5个',isCorrect:false}] },
  { id: 'west_chinese_1_016', content: '"马"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'west_chinese_1_017', content: '哪个字是表示颜色的？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'跑',isCorrect:false},{text:'红',isCorrect:true},{text:'吃',isCorrect:false},{text:'走',isCorrect:false}] },
  { id: 'west_chinese_1_018', content: '"鸟"字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'鱼',isCorrect:false},{text:'鸟',isCorrect:true},{text:'虫',isCorrect:false},{text:'兽',isCorrect:false}] },
  { id: 'west_chinese_1_019', content: '下列哪个是学习用品？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'橡皮',isCorrect:true},{text:'苹果',isCorrect:false},{text:'汽车',isCorrect:false},{text:'桌子',isCorrect:false}] },
  { id: 'west_chinese_1_020', content: '"长"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'短',isCorrect:true},{text:'高',isCorrect:false},{text:'大',isCorrect:false},{text:'粗',isCorrect:false}] },
  { id: 'west_chinese_1_021', content: '"山"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false}] },
  { id: 'west_chinese_1_022', content: '哪个是量词？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'三',isCorrect:false},{text:'个',isCorrect:true},{text:'高',isCorrect:false},{text:'走',isCorrect:false}] },
  { id: 'west_chinese_1_023', content: '"火"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false}] },
  { id: 'west_chinese_1_024', content: '下列哪个是交通工具？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'火车',isCorrect:true},{text:'小狗',isCorrect:false},{text:'大树',isCorrect:false},{text:'白云',isCorrect:false}] },
  { id: 'west_chinese_1_025', content: '"快"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'慢',isCorrect:true},{text:'高',isCorrect:false},{text:'大',isCorrect:false},{text:'好',isCorrect:false}] },
  { id: 'west_chinese_1_026', content: '"鱼"字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'6画',isCorrect:false},{text:'7画',isCorrect:false},{text:'8画',isCorrect:true},{text:'9画',isCorrect:false}] },
  { id: 'west_chinese_1_027', content: '哪个字是表示天气的？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'雨',isCorrect:true},{text:'花',isCorrect:false},{text:'草',isCorrect:false},{text:'树',isCorrect:false}] },
  { id: 'west_chinese_1_028', content: '"白"可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'白菜',isCorrect:true},{text:'白跑',isCorrect:false},{text:'白吃',isCorrect:false},{text:'白想',isCorrect:false}] },
  { id: 'west_chinese_1_029', content: '"高"字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'低',isCorrect:true},{text:'长',isCorrect:false},{text:'大',isCorrect:false},{text:'粗',isCorrect:false}] },
  { id: 'west_chinese_1_030', content: '哪个字是名词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'飞',isCorrect:false},{text:'跑',isCorrect:false},{text:'学校',isCorrect:true},{text:'美丽',isCorrect:false}] },
]

// === CHINESE D2 (28题, grade 4-5) ===
const chineseD2Questions: Question[] = [
  { id: 'west_chinese_2_001', content: '《春晓》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'孟浩然',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_2_002', content: '"画蛇添足"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'做事要勇敢',isCorrect:false},{text:'多此一举反而弄巧成拙',isCorrect:true},{text:'要善于观察',isCorrect:false},{text:'团结合作很重要',isCorrect:false}] },
  { id: 'west_chinese_2_003', content: '下列哪个是褒义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'狡猾',isCorrect:false},{text:'虚伪',isCorrect:false},{text:'诚实',isCorrect:true},{text:'自私',isCorrect:false}] },
  { id: 'west_chinese_2_004', content: '"学而时习之"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'不亦说乎',isCorrect:true},{text:'温故知新',isCorrect:false},{text:'学而不厌',isCorrect:false},{text:'三人行必有我师',isCorrect:false}] },
  { id: 'west_chinese_2_005', content: '《三国演义》中诸葛亮是谁的军师？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'曹操',isCorrect:false},{text:'孙权',isCorrect:false},{text:'刘备',isCorrect:true},{text:'周瑜',isCorrect:false}] },
  { id: 'west_chinese_2_006', content: '"凸"字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:true},{text:'6画',isCorrect:false},{text:'7画',isCorrect:false}] },
  { id: 'west_chinese_2_007', content: '下列哪个不是唐诗？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'静夜思',isCorrect:false},{text:'春望',isCorrect:false},{text:'水调歌头',isCorrect:true},{text:'登鹳雀楼',isCorrect:false}] },
  { id: 'west_chinese_2_008', content: '"亡羊补牢"属于哪种文学常识？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
  { id: 'west_chinese_2_009', content: '《望庐山瀑布》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:false},{text:'李白',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_2_010', content: '"掩耳盗铃"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'要努力奋斗',isCorrect:false},{text:'自欺欺人没有用',isCorrect:true},{text:'要团结合作',isCorrect:false},{text:'要谦虚谨慎',isCorrect:false}] },
  { id: 'west_chinese_2_011', content: '下列哪个是贬义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'勇敢',isCorrect:false},{text:'善良',isCorrect:false},{text:'虚伪',isCorrect:true},{text:'勤劳',isCorrect:false}] },
  { id: 'west_chinese_2_012', content: '"读书破万卷"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'下笔如有神',isCorrect:true},{text:'书中自有黄金屋',isCorrect:false},{text:'书读百遍其义自见',isCorrect:false},{text:'腹有诗书气自华',isCorrect:false}] },
  { id: 'west_chinese_2_013', content: '《西游记》中唐僧的徒弟有几个？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:true},{text:'4个',isCorrect:false},{text:'5个',isCorrect:false}] },
  { id: 'west_chinese_2_014', content: '"鼎"字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'10画',isCorrect:false},{text:'11画',isCorrect:false},{text:'12画',isCorrect:true},{text:'13画',isCorrect:false}] },
  { id: 'west_chinese_2_015', content: '下列哪个不是元曲？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'窦娥冤',isCorrect:false},{text:'西厢记',isCorrect:false},{text:'牡丹亭',isCorrect:false},{text:'静夜思',isCorrect:true}] },
  { id: 'west_chinese_2_016', content: '"刻舟求剑"属于哪种文学常识？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'对偶',isCorrect:false}] },
  { id: 'west_chinese_2_017', content: '《枫桥夜泊》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'张继',isCorrect:true},{text:'白居易',isCorrect:false}] },
  { id: 'west_chinese_2_018', content: '"守株待兔"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'要努力工作',isCorrect:false},{text:'不主动努力而想靠运气',isCorrect:true},{text:'要坚持不懈',isCorrect:false},{text:'要善于观察',isCorrect:false}] },
  { id: 'west_chinese_2_019', content: '下列哪个是中性词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'英雄',isCorrect:false},{text:'狡猾',isCorrect:false},{text:'观察',isCorrect:true},{text:'虚伪',isCorrect:false}] },
  { id: 'west_chinese_2_020', content: '"少壮不努力"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'老大徒伤悲',isCorrect:true},{text:'老大徒悲伤',isCorrect:false},{text:'老大必伤悲',isCorrect:false},{text:'老大也伤悲',isCorrect:false}] },
  { id: 'west_chinese_2_021', content: '《红楼梦》中林黛玉的母亲是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'王夫人',isCorrect:false},{text:'贾母',isCorrect:false},{text:'薛姨妈',isCorrect:false},{text:'贾敏',isCorrect:true}] },
  { id: 'west_chinese_2_022', content: '"凹"字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:true},{text:'6画',isCorrect:false},{text:'7画',isCorrect:false}] },
  { id: 'west_chinese_2_023', content: '下列哪个不是宋词？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'静夜思',isCorrect:false},{text:'春晓',isCorrect:false},{text:'水调歌头',isCorrect:true},{text:'登鹳雀楼',isCorrect:false}] },
  { id: 'west_chinese_2_024', content: '"叶公好龙"属于哪种文学常识？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'排比',isCorrect:false}] },
  { id: 'west_chinese_2_025', content: '《悯农》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_2_026', content: '"狐假虎威"说的是什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'要独立自主',isCorrect:false},{text:'借别人的威风欺压人',isCorrect:true},{text:'要善于观察',isCorrect:false},{text:'要勇敢面对',isCorrect:false}] },
  { id: 'west_chinese_2_027', content: '下列哪个是形声字？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'人',isCorrect:false},{text:'日',isCorrect:false},{text:'河',isCorrect:true},{text:'火',isCorrect:false}] },
  { id: 'west_chinese_2_028', content: '"谁知盘中餐"的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'粒粒皆辛苦',isCorrect:true},{text:'皆从辛苦来',isCorrect:false},{text:'农夫心内如汤煮',isCorrect:false},{text:'汗滴禾下土',isCorrect:false}] },
]

// === CHINESE D3 (25题, grade 6-7) ===
const chineseD3Questions: Question[] = [
  { id: 'west_chinese_3_001', content: '《茅屋为秋风所破歌》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:true},{text:'白居易',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_3_002', content: '"出淤泥而不染"赞美的是哪种花？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'菊花',isCorrect:false},{text:'梅花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'牡丹',isCorrect:false}] },
  { id: 'west_chinese_3_003', content: '下列哪个是元曲？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'登鹳雀楼',isCorrect:false},{text:'春晓',isCorrect:false},{text:'天净沙·秋思',isCorrect:true},{text:'静夜思',isCorrect:false}] },
  { id: 'west_chinese_3_004', content: '"人生自古谁无死"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'留取丹心照汗青',isCorrect:true},{text:'天下兴亡匹夫有责',isCorrect:false},{text:'苟利国家生死以',isCorrect:false},{text:'山河破碎风飘絮',isCorrect:false}] },
  { id: 'west_chinese_3_005', content: '《背影》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'west_chinese_3_006', content: '"己所不欲，勿施于人"出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'west_chinese_3_007', content: '下列哪个是老舍的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'骆驼祥子',isCorrect:true},{text:'朝花夕拾',isCorrect:false},{text:'茶馆',isCorrect:false},{text:'四世同堂',isCorrect:false}] },
  { id: 'west_chinese_3_008', content: '"山重水复疑无路"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'柳暗花明又一村',isCorrect:true},{text:'桃花源里可耕田',isCorrect:false},{text:'春风得意马蹄疾',isCorrect:false},{text:'千树万树梨花开',isCorrect:false}] },
  { id: 'west_chinese_3_009', content: '《石壕吏》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:true},{text:'白居易',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_3_010', content: '"出塞"的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'王昌龄',isCorrect:true},{text:'王之涣',isCorrect:false},{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false}] },
  { id: 'west_chinese_3_011', content: '下列哪个是宋词？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'水调歌头',isCorrect:true},{text:'静夜思',isCorrect:false},{text:'春晓',isCorrect:false},{text:'登鹳雀楼',isCorrect:false}] },
  { id: 'west_chinese_3_012', content: '"但愿人长久"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'千里共婵娟',isCorrect:true},{text:'月有阴晴圆缺',isCorrect:false},{text:'此事古难全',isCorrect:false},{text:'何事长向别时圆',isCorrect:false}] },
  { id: 'west_chinese_3_013', content: '《从百草园到三味书屋》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:true},{text:'朱自清',isCorrect:false},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'west_chinese_3_014', content: '"先天下之忧而忧"出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《醉翁亭记》',isCorrect:false},{text:'《岳阳楼记》',isCorrect:true},{text:'《滕王阁序》',isCorrect:false},{text:'《赤壁赋》',isCorrect:false}] },
  { id: 'west_chinese_3_015', content: '《爱莲说》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'韩愈',isCorrect:false},{text:'周敦颐',isCorrect:true},{text:'柳宗元',isCorrect:false},{text:'欧阳修',isCorrect:false}] },
  { id: 'west_chinese_3_016', content: '"明月几时有"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'把酒问青天',isCorrect:true},{text:'不知天上宫阙',isCorrect:false},{text:'我欲乘风归去',isCorrect:false},{text:'起舞弄清影',isCorrect:false}] },
  { id: 'west_chinese_3_017', content: '《记承天寺夜游》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'苏轼',isCorrect:true},{text:'欧阳修',isCorrect:false},{text:'王安石',isCorrect:false},{text:'司马光',isCorrect:false}] },
  { id: 'west_chinese_3_018', content: '"春眠不觉晓"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'处处闻啼鸟',isCorrect:true},{text:'夜来风雨声',isCorrect:false},{text:'花落知多少',isCorrect:false},{text:'当春乃发生',isCorrect:false}] },
  { id: 'west_chinese_3_019', content: '下列哪个是清代作家？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'曹雪芹',isCorrect:true},{text:'罗贯中',isCorrect:false},{text:'施耐庵',isCorrect:false},{text:'吴承恩',isCorrect:false}] },
  { id: 'west_chinese_3_020', content: '"烽火连三月"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'家书抵万金',isCorrect:true},{text:'白头搔更短',isCorrect:false},{text:'浑欲不胜簪',isCorrect:false},{text:'感时花溅泪',isCorrect:false}] },
  { id: 'west_chinese_3_021', content: '《桃花源记》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'韩愈',isCorrect:false},{text:'陶渊明',isCorrect:true},{text:'谢灵运',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'west_chinese_3_022', content: '"枯藤老树昏鸦"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'小桥流水人家',isCorrect:true},{text:'古道西风瘦马',isCorrect:false},{text:'夕阳西下',isCorrect:false},{text:'断肠人在天涯',isCorrect:false}] },
  { id: 'west_chinese_3_023', content: '《最后一课》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'都德',isCorrect:true},{text:'莫泊桑',isCorrect:false},{text:'巴尔扎克',isCorrect:false},{text:'雨果',isCorrect:false}] },
  { id: 'west_chinese_3_024', content: '"大漠孤烟直"的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'长河落日圆',isCorrect:true},{text:'千里暮云平',isCorrect:false},{text:'征蓬出汉塞',isCorrect:false},{text:'归雁入胡天',isCorrect:false}] },
  { id: 'west_chinese_3_025', content: '《卖炭翁》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:true},{text:'王维',isCorrect:false}] },
]

// === CHINESE D4 (12题, grade 8) ===
const chineseD4Questions: Question[] = [
  { id: 'west_chinese_4_001', content: '《聊斋志异》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:false},{text:'吴承恩',isCorrect:false},{text:'蒲松龄',isCorrect:true},{text:'罗贯中',isCorrect:false}] },
  { id: 'west_chinese_4_002', content: '"富贵不能淫"下一句是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'贫贱不能移',isCorrect:false},{text:'贫贱不能移，威武不能屈',isCorrect:true},{text:'威武不能屈',isCorrect:false},{text:'此之谓大丈夫',isCorrect:false}] },
  { id: 'west_chinese_4_003', content: '下列哪个是清代小说？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《三国演义》',isCorrect:false},{text:'《水浒传》',isCorrect:false},{text:'《红楼梦》',isCorrect:true},{text:'《西游记》',isCorrect:false}] },
  { id: 'west_chinese_4_004', content: '"天人合一"是哪个学派的思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:true},{text:'儒家',isCorrect:false},{text:'法家',isCorrect:false},{text:'墨家',isCorrect:false}] },
  { id: 'west_chinese_4_005', content: '《诗经》共有多少篇？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'305篇',isCorrect:true},{text:'311篇',isCorrect:false},{text:'300篇',isCorrect:false},{text:'315篇',isCorrect:false}] },
  { id: 'west_chinese_4_006', content: '"杯弓蛇影"形容的是什么？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'美味佳肴',isCorrect:false},{text:'疑神疑鬼',isCorrect:true},{text:'技艺高超',isCorrect:false},{text:'文学才华',isCorrect:false}] },
  { id: 'west_chinese_4_007', content: '《尚书》属于什么经典？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《诗》《书》《礼》《易》《春秋》',isCorrect:true},{text:'《论语》《孟子》《大学》《中庸》',isCorrect:false},{text:'《道德经》《南华经》《易经》',isCorrect:false},{text:'《左传》《国语》《战国策》',isCorrect:false}] },
  { id: 'west_chinese_4_008', content: '"己饥己溺"出自哪里？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《论语》',isCorrect:false},{text:'《孟子》',isCorrect:true},{text:'《大学》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'west_chinese_4_009', content: '《儒林外史》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:false},{text:'蒲松龄',isCorrect:false},{text:'吴敬梓',isCorrect:true},{text:'罗贯中',isCorrect:false}] },
  { id: 'west_chinese_4_010', content: '"阴阳"属于哪个学派的思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:false},{text:'儒家',isCorrect:false},{text:'阴阳家',isCorrect:true},{text:'法家',isCorrect:false}] },
  { id: 'west_chinese_4_011', content: '《楚辞》的代表作品是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《离骚》',isCorrect:true},{text:'《诗经》',isCorrect:false},{text:'《论语》',isCorrect:false},{text:'《孟子》',isCorrect:false}] },
  { id: 'west_chinese_4_012', content: '"青出于蓝"形容什么？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'学生超过老师',isCorrect:true},{text:'颜色很美',isCorrect:false},{text:'事情很奇怪',isCorrect:false},{text:'技艺很高超',isCorrect:false}] },
]

// === CHINESE D5 (5题, grade 9) - Sample 5题 ===
const chineseD5Questions: Question[] = [
  { id: 'west_chinese_5_001', content: '"路漫漫其修远兮"的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'吾将上下而求索',isCorrect:true},{text:'虽九死其犹未悔',isCorrect:false},{text:'长太息以掩涕兮',isCorrect:false},{text:'哀民生之多艰',isCorrect:false}] },
  { id: 'west_chinese_5_002', content: '《梦溪笔谈》的作者是谁？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'徐光启',isCorrect:false},{text:'沈括',isCorrect:true},{text:'宋应星',isCorrect:false},{text:'李时珍',isCorrect:false}] },
  { id: 'west_chinese_5_003', content: '王国维《人间词话》中提到的"第三境界"是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'昨夜西风凋碧树',isCorrect:false},{text:'衣带渐宽终不悔',isCorrect:false},{text:'众里寻他千百度',isCorrect:true},{text:'那人却在灯火阑珊处',isCorrect:false}] },
  { id: 'west_chinese_5_004', content: '《太平广记》是什么类型的书？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'历史书',isCorrect:false},{text:'小说总集',isCorrect:true},{text:'哲学书',isCorrect:false},{text:'医学书',isCorrect:false}] },
  { id: 'west_chinese_5_005', content: '"茕茕孑立"出自哪篇文章？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'《出师表》',isCorrect:true},{text:'《陈情表》',isCorrect:false},{text:'《祭十二郎文》',isCorrect:false},{text:'《赤壁赋》',isCorrect:false}] },
]

// === ENGLISH D1 (30题, grade 1-3) ===
const englishD1Questions: Question[] = [
  { id: 'west_english_1_001', content: 'What is "书" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Pen',isCorrect:false},{text:'Book',isCorrect:true},{text:'Bag',isCorrect:false},{text:'Desk',isCorrect:false}] },
  { id: 'west_english_1_002', content: 'How do you spell "cat"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'c-a-t',isCorrect:true},{text:'k-a-t',isCorrect:false},{text:'c-o-t',isCorrect:false},{text:'c-e-t',isCorrect:false}] },
  { id: 'west_english_1_003', content: '"黄色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:true},{text:'Purple',isCorrect:false}] },
  { id: 'west_english_1_004', content: 'What number is "8"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Six',isCorrect:false},{text:'Seven',isCorrect:false},{text:'Eight',isCorrect:true},{text:'Nine',isCorrect:false}] },
  { id: 'west_english_1_005', content: 'What is "狗"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'west_english_1_006', content: 'Good morning! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:true},{text:'Command',isCorrect:false},{text:'Goodbye',isCorrect:false}] },
  { id: 'west_english_1_007', content: 'What color is grass?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:false},{text:'Green',isCorrect:true},{text:'Yellow',isCorrect:false}] },
  { id: 'west_english_1_008', content: '"月亮" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Star',isCorrect:false},{text:'Moon',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'west_english_1_009', content: 'What is "苹果" in English?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Banana',isCorrect:false},{text:'Apple',isCorrect:true},{text:'Orange',isCorrect:false},{text:'Grape',isCorrect:false}] },
  { id: 'west_english_1_010', content: 'How do you spell "dog"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'d-o-g',isCorrect:true},{text:'d-a-g',isCorrect:false},{text:'d-u-g',isCorrect:false},{text:'d-e-g',isCorrect:false}] },
  { id: 'west_english_1_011', content: '"红色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Red',isCorrect:true},{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false}] },
  { id: 'west_english_1_012', content: 'What number is "5"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Four',isCorrect:false},{text:'Five',isCorrect:true},{text:'Six',isCorrect:false},{text:'Seven',isCorrect:false}] },
  { id: 'west_english_1_013', content: 'What is "猫"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Cat',isCorrect:true},{text:'Dog',isCorrect:false},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'west_english_1_014', content: '"学校" is ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'School',isCorrect:true},{text:'House',isCorrect:false},{text:'Park',isCorrect:false},{text:'Store',isCorrect:false}] },
  { id: 'west_english_1_015', content: 'What color is the sky?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:true},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false}] },
  { id: 'west_english_1_016', content: '"太阳" is ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Moon',isCorrect:false},{text:'Star',isCorrect:false},{text:'Sun',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'west_english_1_017', content: 'What is "水"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Fire',isCorrect:false},{text:'Earth',isCorrect:false},{text:'Water',isCorrect:true},{text:'Air',isCorrect:false}] },
  { id: 'west_english_1_018', content: 'How do you spell "fish"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'f-i-s-h',isCorrect:true},{text:'f-i-s-h-h',isCorrect:false},{text:'f-i-s-e',isCorrect:false},{text:'f-i-s-h-e',isCorrect:false}] },
  { id: 'west_english_1_019', content: '"绿色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:true},{text:'Yellow',isCorrect:false},{text:'Purple',isCorrect:false}] },
  { id: 'west_english_1_020', content: 'What number is "10"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Eight',isCorrect:false},{text:'Nine',isCorrect:false},{text:'Ten',isCorrect:true},{text:'Eleven',isCorrect:false}] },
  { id: 'west_english_1_021', content: 'What is "鸟"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:false},{text:'Bird',isCorrect:true},{text:'Fish',isCorrect:false}] },
  { id: 'west_english_1_022', content: 'See you later! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:false},{text:'Farewell',isCorrect:true},{text:'Command',isCorrect:false}] },
  { id: 'west_english_1_023', content: 'What color is a lemon?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:true}] },
  { id: 'west_english_1_024', content: '"星星" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Moon',isCorrect:false},{text:'Star',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'west_english_1_025', content: 'What is "花"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Tree',isCorrect:false},{text:'Grass',isCorrect:false},{text:'Flower',isCorrect:true},{text:'Leaf',isCorrect:false}] },
  { id: 'west_english_1_026', content: 'How do you spell "sun"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'s-o-n',isCorrect:true},{text:'s-u-n',isCorrect:false},{text:'s-a-n',isCorrect:false},{text:'s-i-n',isCorrect:false}] },
  { id: 'west_english_1_027', content: '"蓝色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:true},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false}] },
  { id: 'west_english_1_028', content: 'What number is "3"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'One',isCorrect:false},{text:'Two',isCorrect:false},{text:'Three',isCorrect:true},{text:'Four',isCorrect:false}] },
  { id: 'west_english_1_029', content: 'What is "鱼"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Bird',isCorrect:false},{text:'Cat',isCorrect:false},{text:'Dog',isCorrect:false},{text:'Fish',isCorrect:true}] },
  { id: 'west_english_1_030', content: 'What is "天"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Earth',isCorrect:false},{text:'Sky',isCorrect:true},{text:'Sea',isCorrect:false},{text:'Mountain',isCorrect:false}] },
]

// === ENGLISH D2 (28题, grade 4-5) ===
const englishD2Questions: Question[] = [
  { id: 'west_english_2_001', content: 'What is the past tense of "eat"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Eated',isCorrect:false},{text:'Ate',isCorrect:true},{text:'Eaten',isCorrect:false},{text:'Eating',isCorrect:false}] },
  { id: 'west_english_2_002', content: 'He ___ football every Sunday.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'play',isCorrect:false},{text:'plays',isCorrect:true},{text:'playing',isCorrect:false},{text:'played',isCorrect:false}] },
  { id: 'west_english_2_003', content: 'What is the plural of "mouse"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Mouses',isCorrect:false},{text:'Mice',isCorrect:true},{text:'Mouse',isCorrect:false},{text:'Miesel',isCorrect:false}] },
  { id: 'west_english_2_004', content: 'I saw ___ elephant at the zoo.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'west_english_2_005', content: 'What time is it? 5:00', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:"Five o'clock",isCorrect:true},{text:'Five',isCorrect:false},{text:'Five hours',isCorrect:false},{text:'Five clock',isCorrect:false}] },
  { id: 'west_english_2_006', content: 'My father ___ reading newspapers.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'likes',isCorrect:true},{text:'like',isCorrect:false},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
  { id: 'west_english_2_007', content: 'There ___ a lot of milk in the fridge.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_2_008', content: 'The opposite of "easy" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'simple',isCorrect:false},{text:'hard',isCorrect:true},{text:'difficult',isCorrect:false},{text:'both B and C',isCorrect:false}] },
  { id: 'west_english_2_009', content: 'What is the past tense of "go"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Goed',isCorrect:false},{text:'Went',isCorrect:true},{text:'Gone',isCorrect:false},{text:'Going',isCorrect:false}] },
  { id: 'west_english_2_010', content: 'She ___ TV every evening.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'watch',isCorrect:false},{text:'watches',isCorrect:true},{text:'watching',isCorrect:false},{text:'watched',isCorrect:false}] },
  { id: 'west_english_2_011', content: 'What is the plural of "child"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Childs',isCorrect:false},{text:'Children',isCorrect:true},{text:'Childes',isCorrect:false},{text:'Child',isCorrect:false}] },
  { id: 'west_english_2_012', content: 'I need ___ apple.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'west_english_2_013', content: 'What time is it? 3:30', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Three thirty',isCorrect:true},{text:'Three fifteen',isCorrect:false},{text:'Three oclock',isCorrect:false},{text:'Half past three',isCorrect:false}] },
  { id: 'west_english_2_014', content: 'My mother ___ cooking dinner.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'likes',isCorrect:true},{text:'like',isCorrect:false},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
  { id: 'west_english_2_015', content: 'There ___ many books on the table.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:false},{text:'are',isCorrect:true},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_2_016', content: 'The opposite of "big" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Large',isCorrect:false},{text:'Huge',isCorrect:false},{text:'Small',isCorrect:true},{text:'Great',isCorrect:false}] },
  { id: 'west_english_2_017', content: 'What is the past tense of "see"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Seened',isCorrect:false},{text:'Saw',isCorrect:true},{text:'Seen',isCorrect:false},{text:'Seeing',isCorrect:false}] },
  { id: 'west_english_2_018', content: 'They ___ soccer after school.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'play',isCorrect:true},{text:'plays',isCorrect:false},{text:'playing',isCorrect:false},{text:'played',isCorrect:false}] },
  { id: 'west_english_2_019', content: 'What is the plural of "foot"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Foots',isCorrect:false},{text:'Feet',isCorrect:true},{text:'Footes',isCorrect:false},{text:'Foot',isCorrect:false}] },
  { id: 'west_english_2_020', content: 'She is ___ student.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'west_english_2_021', content: 'What time is it? 8:15', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Eight fifteen',isCorrect:false},{text:'Quarter past eight',isCorrect:true},{text:'Eight oclock',isCorrect:false},{text:'Quarter to eight',isCorrect:false}] },
  { id: 'west_english_2_022', content: 'The book ___ interesting.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_2_023', content: 'There ___ some water in the glass.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_2_024', content: 'The opposite of "happy" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Joyful',isCorrect:false},{text:'Sad',isCorrect:true},{text:'Glad',isCorrect:false},{text:'Pleasant',isCorrect:false}] },
  { id: 'west_english_2_025', content: 'What is the past tense of "run"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Runned',isCorrect:false},{text:'Ran',isCorrect:true},{text:'Run',isCorrect:false},{text:'Running',isCorrect:false}] },
  { id: 'west_english_2_026', content: 'We ___ English class every day.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'have',isCorrect:true},{text:'has',isCorrect:false},{text:'having',isCorrect:false},{text:'had',isCorrect:false}] },
  { id: 'west_english_2_027', content: 'What is the plural of "tooth"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Tooths',isCorrect:false},{text:'Teeth',isCorrect:true},{text:'Toothes',isCorrect:false},{text:'Tooth',isCorrect:false}] },
  { id: 'west_english_2_028', content: 'I see ___ UFO in the sky.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
]

// === ENGLISH D3 (25题, grade 6-7) ===
const englishD3Questions: Question[] = [
  { id: 'west_english_3_001', content: 'If I ___ you, I would accept the offer.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'west_english_3_002', content: 'She has ___ finished her project.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'west_english_3_003', content: 'The song ___ by the famous singer.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'sang',isCorrect:false},{text:'is sung',isCorrect:true},{text:'sings',isCorrect:false},{text:'singing',isCorrect:false}] },
  { id: 'west_english_3_004', content: 'Either you or I ___ responsible.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'west_english_3_005', content: 'I have been waiting for ___ two hours.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:false},{text:'for',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'west_english_3_006', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He do not understand',isCorrect:false},{text:'He does not understands',isCorrect:false},{text:'He does not understand',isCorrect:true},{text:'He do not understands',isCorrect:false}] },
  { id: 'west_english_3_007', content: 'The teacher told us ___ quietly.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'sit',isCorrect:false},{text:'to sit',isCorrect:true},{text:'sitting',isCorrect:false},{text:'sat',isCorrect:false}] },
  { id: 'west_english_3_008', content: 'By the time we arrived, the movie ___', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'started',isCorrect:false},{text:'had started',isCorrect:true},{text:'has started',isCorrect:false},{text:'was starting',isCorrect:false}] },
  { id: 'west_english_3_009', content: 'If he ___ here, he would help us.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'west_english_3_010', content: 'She ___ her homework already.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'finish',isCorrect:false},{text:'finishes',isCorrect:false},{text:'finished',isCorrect:false},{text:'has finished',isCorrect:true}] },
  { id: 'west_english_3_011', content: 'The letter ___ by Tom yesterday.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'write',isCorrect:false},{text:'writes',isCorrect:false},{text:'is written',isCorrect:false},{text:'was written',isCorrect:true}] },
  { id: 'west_english_3_012', content: 'Neither the students nor the teacher ___ happy.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'is',isCorrect:false},{text:'are',isCorrect:true},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'west_english_3_013', content: 'I have lived here ___ 2010.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:true},{text:'for',isCorrect:false},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'west_english_3_014', content: 'Which sentence uses the passive voice correctly?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'The cake ate by the children',isCorrect:false},{text:'The cake was eaten by the children',isCorrect:true},{text:'The cake is eating by the children',isCorrect:false},{text:'The cake eats by the children',isCorrect:false}] },
  { id: 'west_english_3_015', content: 'They asked me ___ at the party.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'sing',isCorrect:false},{text:'to sing',isCorrect:true},{text:'singing',isCorrect:false},{text:'sang',isCorrect:false}] },
  { id: 'west_english_3_016', content: 'When I arrived, they ___ the dinner.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'finish',isCorrect:false},{text:'finished',isCorrect:false},{text:'had finished',isCorrect:true},{text:'were finishing',isCorrect:false}] },
  { id: 'west_english_3_017', content: 'If I ___ more money, I would buy a car.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'have',isCorrect:false},{text:'had',isCorrect:true},{text:'would have',isCorrect:false},{text:'might have',isCorrect:false}] },
  { id: 'west_english_3_018', content: 'He has ___ gone to Beijing.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'west_english_3_019', content: 'The book ___ by millions of people.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'read',isCorrect:false},{text:'reads',isCorrect:false},{text:'is read',isCorrect:true},{text:'was reading',isCorrect:false}] },
  { id: 'west_english_3_020', content: 'Not only she ___ beautiful but also intelligent.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'was',isCorrect:false},{text:'seems',isCorrect:true}] },
  { id: 'west_english_3_021', content: 'I have been learning English ___ three years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:false},{text:'for',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'west_english_3_022', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He doesnt like coffee',isCorrect:false},{text:'He does not likes coffee',isCorrect:false},{text:'He does not like coffee',isCorrect:true},{text:'He does not liked coffee',isCorrect:false}] },
  { id: 'west_english_3_023', content: 'My father taught me ___自行车.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'ride',isCorrect:false},{text:'to ride',isCorrect:true},{text:'riding',isCorrect:false},{text:'rode',isCorrect:false}] },
  { id: 'west_english_3_024', content: 'By the time the teacher came, the students ___ their work.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'finish',isCorrect:false},{text:'finished',isCorrect:false},{text:'had finished',isCorrect:true},{text:'were finishing',isCorrect:false}] },
  { id: 'west_english_3_025', content: 'If we ___ earlier, we would have caught the train.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'leave',isCorrect:false},{text:'left',isCorrect:true},{text:'had left',isCorrect:false},{text:'would leave',isCorrect:false}] },
]

// === ENGLISH D4 (12题, grade 8) ===
const englishD4Questions: Question[] = [
  { id: 'west_english_4_001', content: 'The passive voice of "They built this house" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'This house is built',isCorrect:false},{text:'This house was built',isCorrect:true},{text:'This house is building',isCorrect:false},{text:'This house was building',isCorrect:false}] },
  { id: 'west_english_4_002', content: 'I insist that he ___ immediately.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'leave',isCorrect:true},{text:'to leave',isCorrect:false},{text:'leaving',isCorrect:false},{text:'left',isCorrect:false}] },
  { id: 'west_english_4_003', content: 'Which word is a preposition?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Quickly',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Under',isCorrect:true},{text:'Run',isCorrect:false}] },
  { id: 'west_english_4_004', content: '___ the noise, we could not sleep.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Because of',isCorrect:true},{text:'Since',isCorrect:false},{text:'As result',isCorrect:false}] },
  { id: 'west_english_4_005', content: 'He spoke ___ he knew everything.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'west_english_4_006', content: 'The word "responsibility" is a/an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'adjective',isCorrect:false},{text:'verb',isCorrect:false},{text:'noun',isCorrect:true},{text:'adverb',isCorrect:false}] },
  { id: 'west_english_4_007', content: 'The passive voice of "She wrote a letter" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'A letter was written',isCorrect:true},{text:'A letter is written',isCorrect:false},{text:'A letter writes',isCorrect:false},{text:'A letter wrote',isCorrect:false}] },
  { id: 'west_english_4_008', content: 'I demand that he ___ the truth.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'tell',isCorrect:true},{text:'tells',isCorrect:false},{text:'told',isCorrect:false},{text:'to tell',isCorrect:false}] },
  { id: 'west_english_4_009', content: 'Which word is an adverb?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Careful',isCorrect:false},{text:'Beautiful',isCorrect:false},{text:'Quickly',isCorrect:true},{text:'Happy',isCorrect:false}] },
  { id: 'west_english_4_010', content: '___ his help, I could not finish the project.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Without',isCorrect:true},{text:'With',isCorrect:false},{text:'But for',isCorrect:false},{text:'If not',isCorrect:false}] },
  { id: 'west_english_4_011', content: 'He acted ___ nothing had happened.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'what',isCorrect:false},{text:'that',isCorrect:false}] },
  { id: 'west_english_4_012', content: 'The word "unbelievable" is formed by ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'prefix + root + suffix',isCorrect:true},{text:'root + suffix',isCorrect:false},{text:'prefix + root',isCorrect:false},{text:'suffix + root',isCorrect:false}] },
]

// === ENGLISH D5 (5题, grade 9) - Sample 5题 ===
const englishD5Questions: Question[] = [
  { id: 'west_english_5_001', content: 'Had I known about the traffic, I ___ earlier.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'would leave',isCorrect:false},{text:'would have left',isCorrect:true},{text:'will leave',isCorrect:false},{text:'left',isCorrect:false}] },
  { id: 'west_english_5_002', content: 'Not only ___ the game, but she also won the trophy.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'she won',isCorrect:false},{text:'did she win',isCorrect:true},{text:'won she',isCorrect:false},{text:'she did win',isCorrect:false}] },
  { id: 'west_english_5_003', content: 'I would have succeeded ___ your help.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'but for',isCorrect:true},{text:'despite',isCorrect:false},{text:'without',isCorrect:false},{text:'if not for',isCorrect:false}] },
  { id: 'west_english_5_004', content: '___ hard, you would have passed.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'Study',isCorrect:false},{text:'Studied',isCorrect:false},{text:'Had you studied',isCorrect:true},{text:'If you studied',isCorrect:false}] },
  { id: 'west_english_5_005', content: 'The building ___ when the earthquake struck.', type: 'single', difficulty: 5, category: 'english', grade: 9, options: [{text:'was being built',isCorrect:true},{text:'was built',isCorrect:false},{text:'is built',isCorrect:false},{text:'has been built',isCorrect:false}] },
]

// === SCIENCE D1 (30题, grade 1-3) ===
const scienceD1Questions: Question[] = [
  { id: 'west_science_1_001', content: '水在什么温度会变成冰？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:true},{text:'100°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'-10°C',isCorrect:false}] },
  { id: 'west_science_1_002', content: '太阳从哪边升起？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'西边',isCorrect:false},{text:'东边',isCorrect:true},{text:'南边',isCorrect:false},{text:'北边',isCorrect:false}] },
  { id: 'west_science_1_003', content: '人体最大的器官是？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'心脏',isCorrect:false},{text:'大脑',isCorrect:false},{text:'皮肤',isCorrect:true},{text:'肝脏',isCorrect:false}] },
  { id: 'west_science_1_004', content: '植物需要什么才能生长？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'水和阳光',isCorrect:true},{text:'土壤和石头',isCorrect:false},{text:'空气和风',isCorrect:false},{text:'温度和冰',isCorrect:false}] },
  { id: 'west_science_1_005', content: '月亮会发光吗？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'会',isCorrect:false},{text:'不会，它反射太阳光',isCorrect:true},{text:'会发出蓝光',isCorrect:false},{text:'只在晚上发光',isCorrect:false}] },
  { id: 'west_science_1_006', content: '水的三种形态是？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'固体、液体、气体',isCorrect:true},{text:'水、冰、蒸汽',isCorrect:false},{text:'雨、雪、冰',isCorrect:false},{text:'河流、海洋、湖泊',isCorrect:false}] },
  { id: 'west_science_1_007', content: '什么动物会飞？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'狗',isCorrect:false},{text:'鸟',isCorrect:true},{text:'鱼',isCorrect:false},{text:'猫',isCorrect:false}] },
  { id: 'west_science_1_008', content: '地球的形状像什么？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'正方形',isCorrect:false},{text:'圆形',isCorrect:false},{text:'球形',isCorrect:true},{text:'三角形',isCorrect:false}] },
  { id: 'west_science_1_009', content: '水在什么温度会变成蒸汽？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'100°C',isCorrect:true},{text:'-10°C',isCorrect:false}] },
  { id: 'west_science_1_010', content: '太阳从哪边落下？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'东边',isCorrect:false},{text:'西边',isCorrect:true},{text:'南边',isCorrect:false},{text:'北边',isCorrect:false}] },
  { id: 'west_science_1_011', content: '人体有多少颗牙齿？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'20颗',isCorrect:false},{text:'28颗',isCorrect:false},{text:'32颗',isCorrect:true},{text:'36颗',isCorrect:false}] },
  { id: 'west_science_1_012', content: '植物的根有什么作用？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'吸收阳光',isCorrect:false},{text:'吸收水分和养分',isCorrect:true},{text:'进行光合作用',isCorrect:false},{text:'制造氧气',isCorrect:false}] },
  { id: 'west_science_1_013', content: '哪个是哺乳动物？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'鱼',isCorrect:false},{text:'鸟',isCorrect:false},{text:'狗',isCorrect:true},{text:'蛇',isCorrect:false}] },
  { id: 'west_science_1_014', content: '水在哪里会结冰？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'只有北极',isCorrect:false},{text:'只有南极',isCorrect:false},{text:'0°C以下',isCorrect:true},{text:'100°C以下',isCorrect:false}] },
  { id: 'west_science_1_015', content: '什么现象说明空气存在？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'风吹动树叶',isCorrect:true},{text:'水往低处流',isCorrect:false},{text:'太阳发光',isCorrect:false},{text:'月亮发光',isCorrect:false}] },
  { id: 'west_science_1_016', content: '人体血液是什么颜色？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'蓝色',isCorrect:false},{text:'绿色',isCorrect:false},{text:'红色',isCorrect:true},{text:'黄色',isCorrect:false}] },
  { id: 'west_science_1_017', content: '什么季节白天最短？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'春天',isCorrect:false},{text:'夏天',isCorrect:false},{text:'秋天',isCorrect:false},{text:'冬天',isCorrect:true}] },
  { id: 'west_science_1_018', content: '哪种动物是冷血动物？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'狗',isCorrect:false},{text:'猫',isCorrect:false},{text:'蛇',isCorrect:true},{text:'鸟',isCorrect:false}] },
  { id: 'west_science_1_019', content: '水的沸点是？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'0°C',isCorrect:false},{text:'50°C',isCorrect:false},{text:'100°C',isCorrect:true},{text:'200°C',isCorrect:false}] },
  { id: 'west_science_1_020', content: '影子是怎么形成的？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'光被物体挡住',isCorrect:true},{text:'光穿过物体',isCorrect:false},{text:'物体发光',isCorrect:false},{text:'物体吸收光',isCorrect:false}] },
  { id: 'west_science_1_021', content: '哪种器官帮助我们呼吸？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'心脏',isCorrect:false},{text:'肺',isCorrect:true},{text:'胃',isCorrect:false},{text:'肝脏',isCorrect:false}] },
  { id: 'west_science_1_022', content: '一年有多少天？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'300天',isCorrect:false},{text:'365天',isCorrect:true},{text:'400天',isCorrect:false},{text:'360天',isCorrect:false}] },
  { id: 'west_science_1_023', content: '哪种动物是卵生的？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'狗',isCorrect:false},{text:'猫',isCorrect:false},{text:'鸡',isCorrect:true},{text:'兔子',isCorrect:false}] },
  { id: 'west_science_1_024', content: '什么力让物体下落？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'推力',isCorrect:false},{text:'重力',isCorrect:true},{text:'风力',isCorrect:false},{text:'浮力',isCorrect:false}] },
  { id: 'west_science_1_025', content: '植物的叶子是什么颜色？', type: 'single', difficulty: 1, category: 'science', grade: 1, options: [{text:'只有绿色',isCorrect:false},{text:'只有红色',isCorrect:false},{text:'通常是绿色',isCorrect:true},{text:'只有黄色',isCorrect:false}] },
  { id: 'west_science_1_026', content: '哪个星球最大？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'地球',isCorrect:false},{text:'火星',isCorrect:false},{text:'木星',isCorrect:true},{text:'金星',isCorrect:false}] },
  { id: 'west_science_1_027', content: '什么现象说明水在蒸发？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'冰变成水',isCorrect:false},{text:'湿衣服变干',isCorrect:true},{text:'水结冰',isCorrect:false},{text:'下雨',isCorrect:false}] },
  { id: 'west_science_1_028', content: '人体有多少块骨头？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'106块',isCorrect:false},{text:'206块',isCorrect:true},{text:'306块',isCorrect:false},{text:'406块',isCorrect:false}] },
  { id: 'west_science_1_029', content: '磁铁能吸引什么？', type: 'single', difficulty: 1, category: 'science', grade: 2, options: [{text:'木头',isCorrect:false},{text:'塑料',isCorrect:false},{text:'铁',isCorrect:true},{text:'布',isCorrect:false}] },
  { id: 'west_science_1_030', content: '什么季节白天最长？', type: 'single', difficulty: 1, category: 'science', grade: 3, options: [{text:'春天',isCorrect:false},{text:'夏天',isCorrect:true},{text:'秋天',isCorrect:false},{text:'冬天',isCorrect:false}] },
]

// === SCIENCE D2 (28题, grade 4-5) ===
const scienceD2Questions: Question[] = [
  { id: 'west_science_2_001', content: '植物的光合作用需要什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'阳光、水、二氧化碳',isCorrect:true},{text:'阳光、水、氧气',isCorrect:false},{text:'水、土壤、阳光',isCorrect:false},{text:'二氧化碳、土壤、水',isCorrect:false}] },
  { id: 'west_science_2_002', content: '人体的血液是怎么循环的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'从心脏到肺再到全身',isCorrect:false},{text:'从心脏到全身再到肺然后回心脏',isCorrect:true},{text:'从肺到全身再到心脏',isCorrect:false},{text:'从全身到心脏再到肺',isCorrect:false}] },
  { id: 'west_science_2_003', content: '声音是怎么传播的？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'通过空气振动',isCorrect:true},{text:'通过光线',isCorrect:false},{text:'通过水',isCorrect:false},{text:'通过固体',isCorrect:false}] },
  { id: 'west_science_2_004', content: '什么是动物的冬眠？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物在冬天睡觉',isCorrect:true},{text:'动物在冬天吃东西',isCorrect:false},{text:'动物在冬天繁殖',isCorrect:false},{text:'动物在冬天迁徙',isCorrect:false}] },
  { id: 'west_science_2_005', content: '电路的基本组成部分是？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'电源、导线、开关',isCorrect:true},{text:'灯泡、电池、插座',isCorrect:false},{text:'电线、灯泡、墙壁',isCorrect:false},{text:'开关、电池、电动机',isCorrect:false}] },
  { id: 'west_science_2_006', content: '水的循环包括哪三个过程？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'蒸发、凝结、降水',isCorrect:true},{text:'融化、凝固、蒸发',isCorrect:false},{text:'蒸发、凝固、降水',isCorrect:false},{text:'凝结、融化、降水',isCorrect:false}] },
  { id: 'west_science_2_007', content: '磁铁能吸引什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'铜',isCorrect:false},{text:'铝',isCorrect:false},{text:'铁',isCorrect:true},{text:'锌',isCorrect:false}] },
  { id: 'west_science_2_008', content: '地球的自转导致什么现象？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'四季变化',isCorrect:false},{text:'昼夜交替',isCorrect:true},{text:'潮汐变化',isCorrect:false},{text:'气候变化',isCorrect:false}] },
  { id: 'west_science_2_009', content: '植物的光合作用产生什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'二氧化碳',isCorrect:false},{text:'氧气和有机物',isCorrect:true},{text:'水和矿物质',isCorrect:false},{text:'氮气',isCorrect:false}] },
  { id: 'west_science_2_010', content: '心脏的功能是什么？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'消化食物',isCorrect:false},{text:'泵血到全身',isCorrect:true},{text:'过滤血液',isCorrect:false},{text:'产生抗体',isCorrect:false}] },
  { id: 'west_science_2_011', content: '声音在什么中传播最快？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'空气',isCorrect:false},{text:'水',isCorrect:false},{text:'固体',isCorrect:true},{text:'真空',isCorrect:false}] },
  { id: 'west_science_2_012', content: '动物迁徙的主要原因是什么？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'寻找食物',isCorrect:true},{text:'玩耍',isCorrect:false},{text:'躲避捕食者',isCorrect:false},{text:'探索新地方',isCorrect:false}] },
  { id: 'west_science_2_013', content: '什么是导体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'能导电的物质',isCorrect:true},{text:'不能导电的物质',isCorrect:false},{text:'半导体',isCorrect:false},{text:'绝缘体',isCorrect:false}] },
  { id: 'west_science_2_014', content: '云是怎么形成的？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'水蒸发后凝结',isCorrect:true},{text:'空气压缩形成',isCorrect:false},{text:'灰尘聚集',isCorrect:false},{text:'温度升高',isCorrect:false}] },
  { id: 'west_science_2_015', content: '磁铁的同极会怎样？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'互相吸引',isCorrect:false},{text:'互相排斥',isCorrect:true},{text:'没有反应',isCorrect:false},{text:'停止运动',isCorrect:false}] },
  { id: 'west_science_2_016', content: '地球的公转导致什么现象？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'昼夜交替',isCorrect:false},{text:'四季变化',isCorrect:true},{text:'潮汐变化',isCorrect:false},{text:'星座变化',isCorrect:false}] },
  { id: 'west_science_2_017', content: '植物的蒸腾作用有什么作用？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'吸收二氧化碳',isCorrect:false},{text:'输送水分和矿物质',isCorrect:true},{text:'制造有机物',isCorrect:false},{text:'繁殖',isCorrect:false}] },
  { id: 'west_science_2_018', content: '人眼的哪个部分对光敏感？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'角膜',isCorrect:false},{text:'晶状体',isCorrect:false},{text:'视网膜',isCorrect:true},{text:'虹膜',isCorrect:false}] },
  { id: 'west_science_2_019', content: '什么决定了声音的高低？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'振幅',isCorrect:false},{text:'频率',isCorrect:true},{text:'传播速度',isCorrect:false},{text:'介质',isCorrect:false}] },
  { id: 'west_science_2_020', content: '什么是动物的迁徙？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'动物搬家',isCorrect:false},{text:'动物随季节变化移动',isCorrect:true},{text:'动物寻找配偶',isCorrect:false},{text:'动物冬眠',isCorrect:false}] },
  { id: 'west_science_2_021', content: '什么是绝缘体？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'能导电的物质',isCorrect:false},{text:'不能导电的物质',isCorrect:true},{text:'半导体',isCorrect:false},{text:'超导体',isCorrect:false}] },
  { id: 'west_science_2_022', content: '下雨是什么物态变化？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'蒸发',isCorrect:false},{text:'凝固',isCorrect:false},{text:'凝结',isCorrect:true},{text:'升华',isCorrect:false}] },
  { id: 'west_science_2_023', content: '磁铁的异极会怎样？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'互相排斥',isCorrect:false},{text:'互相吸引',isCorrect:true},{text:'没有反应',isCorrect:false},{text:'停止运动',isCorrect:false}] },
  { id: 'west_science_2_024', content: '月亮圆缺是什么原因？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'地球遮挡阳光',isCorrect:false},{text:'月球围绕地球公转',isCorrect:false},{text:'月球被地球遮挡阳光',isCorrect:true},{text:'月球自转',isCorrect:false}] },
  { id: 'west_science_2_025', content: '植物的根尖有什么作用？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'进行光合作用',isCorrect:false},{text:'吸收水分和无机盐',isCorrect:true},{text:'制造有机物',isCorrect:false},{text:'繁殖',isCorrect:false}] },
  { id: 'west_science_2_026', content: '什么是反射？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'光进入物体',isCorrect:false},{text:'光返回原介质',isCorrect:true},{text:'光穿透物体',isCorrect:false},{text:'光被吸收',isCorrect:false}] },
  { id: 'west_science_2_027', content: '什么决定了声音的响度？', type: 'single', difficulty: 2, category: 'science', grade: 4, options: [{text:'频率',isCorrect:false},{text:'振幅',isCorrect:true},{text:'波长',isCorrect:false},{text:'速度',isCorrect:false}] },
  { id: 'west_science_2_028', content: '什么是食物链？', type: 'single', difficulty: 2, category: 'science', grade: 5, options: [{text:'生物之间的关系网',isCorrect:false},{text:'生物之间的吃与被吃关系',isCorrect:true},{text:'生物之间的合作',isCorrect:false},{text:'生物之间的竞争',isCorrect:false}] },
]

// === SCIENCE D3 (25题, grade 6-7) ===
const scienceD3Questions: Question[] = [
  { id: 'west_science_3_001', content: '植物细胞的基本结构包括？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'细胞壁、细胞膜、细胞核',isCorrect:true},{text:'细胞膜、细胞质、叶绿体',isCorrect:false},{text:'细胞核、线粒体、叶绿体',isCorrect:false},{text:'细胞壁、细胞质、线粒体',isCorrect:false}] },
  { id: 'west_science_3_002', content: '光的折射发生在什么情况下？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'光从空气进入水或玻璃时',isCorrect:true},{text:'光在空气中传播时',isCorrect:false},{text:'光被镜子反射时',isCorrect:false},{text:'光穿过真空时',isCorrect:false}] },
  { id: 'west_science_3_003', content: '地球公转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一天',isCorrect:false},{text:'一个月',isCorrect:false},{text:'一年',isCorrect:true},{text:'一周',isCorrect:false}] },
  { id: 'west_science_3_004', content: '什么是新陈代谢？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'生物体内化学反应的总和',isCorrect:true},{text:'细胞的分裂过程',isCorrect:false},{text:'能量转换的过程',isCorrect:false},{text:'营养物质的吸收',isCorrect:false}] },
  { id: 'west_science_3_005', content: '力的三要素是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'大小、方向、作用点',isCorrect:true},{text:'质量、速度、加速度',isCorrect:false},{text:'长度、宽度、高度',isCorrect:false},{text:'重力、摩擦力、弹力',isCorrect:false}] },
  { id: 'west_science_3_006', content: '什么是消化系统的主要功能？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'分解食物并吸收营养',isCorrect:true},{text:'运输氧气',isCorrect:false},{text:'排出废物',isCorrect:false},{text:'调节体温',isCorrect:false}] },
  { id: 'west_science_3_007', content: '大气层的主要成分是？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'氮气和氧气',isCorrect:true},{text:'氧气和二氧化碳',isCorrect:false},{text:'氮气和二氧化碳',isCorrect:false},{text:'氢气和氧气',isCorrect:false}] },
  { id: 'west_science_3_008', content: '什么是反射定律？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'入射角等于反射角',isCorrect:true},{text:'入射角大于反射角',isCorrect:false},{text:'入射角小于反射角',isCorrect:false},{text:'入射角与反射角互补',isCorrect:false}] },
  { id: 'west_science_3_009', content: '动物细胞和植物细胞有什么区别？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'动物细胞有细胞壁',isCorrect:false},{text:'植物细胞有叶绿体和细胞壁',isCorrect:true},{text:'动物细胞有叶绿体',isCorrect:false},{text:'没有区别',isCorrect:false}] },
  { id: 'west_science_3_010', content: '光的折射定律是什么？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'入射角等于折射角',isCorrect:false},{text:'入射角与折射角成正比',isCorrect:false},{text:'入射角的正弦与折射角的正弦之比为常数',isCorrect:true},{text:'入射角与折射角互补',isCorrect:false}] },
  { id: 'west_science_3_011', content: '月球公转一周是多少时间？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'一天',isCorrect:false},{text:'一周',isCorrect:false},{text:'一个月',isCorrect:true},{text:'一年',isCorrect:false}] },
  { id: 'west_science_3_012', content: '什么是光合作用？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'植物吸收氧气的过程',isCorrect:false},{text:'植物制造有机物的过程',isCorrect:true},{text:'植物呼吸的过程',isCorrect:false},{text:'植物吸收水分的过程',isCorrect:false}] },
  { id: 'west_science_3_013', content: '什么是动能？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物体由于运动而具有的能量',isCorrect:true},{text:'物体由于位置而具有的能量',isCorrect:false},{text:'物体由于形状而具有的能量',isCorrect:false},{text:'物体由于温度而具有的能量',isCorrect:false}] },
  { id: 'west_science_3_014', content: '什么是重力？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物体之间的吸引力',isCorrect:false},{text:'地球对物体的吸引力',isCorrect:true},{text:'物体之间的排斥力',isCorrect:false},{text:'空气对物体的力',isCorrect:false}] },
  { id: 'west_science_3_015', content: '呼吸系统包括哪些器官？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'鼻、咽、喉、气管、支气管、肺',isCorrect:true},{text:'鼻、咽、喉、食管、胃',isCorrect:false},{text:'口腔、咽、食管、胃、小肠',isCorrect:false},{text:'心脏、肺、血管',isCorrect:false}] },
  { id: 'west_science_3_016', content: '什么是质量？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'物体所含物质的多少',isCorrect:true},{text:'物体的重量',isCorrect:false},{text:'物体的大小',isCorrect:false},{text:'物体的形状',isCorrect:false}] },
  { id: 'west_science_3_017', content: '什么是密度？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'质量与体积的比值',isCorrect:true},{text:'体积与质量的比值',isCorrect:false},{text:'质量与重量的比值',isCorrect:false},{text:'重量与体积的比值',isCorrect:false}] },
  { id: 'west_science_3_018', content: '什么是能量守恒定律？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'能量可以创造也可以消失',isCorrect:false},{text:'能量不会消失也不会创造，只能转换',isCorrect:true},{text:'能量会不断增加',isCorrect:false},{text:'能量会不断减少',isCorrect:false}] },
  { id: 'west_science_3_019', content: '什么是比热容？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质吸收热量的能力',isCorrect:false},{text:'单位质量物质升高1°C所需热量',isCorrect:true},{text:'物质的温度',isCorrect:false},{text:'物质的热量',isCorrect:false}] },
  { id: 'west_science_3_020', content: '什么是溶解度？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'物质在溶剂中的含量',isCorrect:false},{text:'物质在一定温度下溶于溶剂的最大量',isCorrect:true},{text:'物质溶解的速度',isCorrect:false},{text:'物质溶解的比例',isCorrect:false}] },
  { id: 'west_science_3_021', content: '什么是化学变化？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'物质形态的变化',isCorrect:false},{text:'物质产生新属性的变化',isCorrect:true},{text:'物质位置的变化',isCorrect:false},{text:'物质大小的变化',isCorrect:false}] },
  { id: 'west_science_3_022', content: '什么是物理变化？', type: 'single', difficulty: 3, category: 'science', grade: 6, options: [{text:'物质产生新属性',isCorrect:false},{text:'物质不产生新属性',isCorrect:true},{text:'物质燃烧',isCorrect:false},{text:'物质生锈',isCorrect:false}] },
  { id: 'west_science_3_023', content: '什么是PH值？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质的温度',isCorrect:false},{text:'物质的酸碱度',isCorrect:true},{text:'物质的质量',isCorrect:false},{text:'物质的浓度',isCorrect:false}] },
  { id: 'west_science_3_024', content: '什么是氧化反应？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'物质与氧气结合的反应',isCorrect:true},{text:'物质失去氧气的反应',isCorrect:false},{text:'物质与氢气结合的反应',isCorrect:false},{text:'物质分解的反应',isCorrect:false}] },
  { id: 'west_science_3_025', content: '什么是血液循环？', type: 'single', difficulty: 3, category: 'science', grade: 7, options: [{text:'血液从心脏到肺再到全身',isCorrect:false},{text:'血液从心脏到全身再到肺然后回心脏',isCorrect:true},{text:'血液从肺到心脏再到全身',isCorrect:false},{text:'血液从全身到肺再到心脏',isCorrect:false}] },
]

// === SCIENCE D4 (12题, grade 8) ===
const scienceD4Questions: Question[] = [
  { id: 'west_science_4_001', content: '欧姆定律的公式是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'V = IR',isCorrect:true},{text:'V = I/R',isCorrect:false},{text:'V = R/I',isCorrect:false},{text:'V = I + R',isCorrect:false}] },
  { id: 'west_science_4_002', content: '加速度的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'m/s',isCorrect:false},{text:'m/s²',isCorrect:true},{text:'kg·m/s',isCorrect:false},{text:'N/kg',isCorrect:false}] },
  { id: 'west_science_4_003', content: 'DNA的中文名称是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'核糖核酸',isCorrect:false},{text:'脱氧核糖核酸',isCorrect:true},{text:'蛋白质',isCorrect:false},{text:'氨基酸',isCorrect:false}] },
  { id: 'west_science_4_004', content: '地球内部结构包括？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地壳、地幔、地核',isCorrect:true},{text:'地壳、地核、海洋',isCorrect:false},{text:'地幔、外核、内核',isCorrect:false},{text:'大陆、海洋、地核',isCorrect:false}] },
  { id: 'west_science_4_005', content: '什么是能量守恒定律？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'能量不会消失也不会创造，只能转换',isCorrect:true},{text:'能量可以创造也可以消失',isCorrect:false},{text:'能量在封闭系统中会减少',isCorrect:false},{text:'能量在开放系统中会减少',isCorrect:false}] },
  { id: 'west_science_4_006', content: '遗传的基本单位是？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'染色体',isCorrect:false},{text:'基因',isCorrect:true},{text:'DNA',isCorrect:false},{text:'细胞',isCorrect:false}] },
  { id: 'west_science_4_007', content: '电流的单位是什么？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'伏特',isCorrect:false},{text:'安培',isCorrect:true},{text:'欧姆',isCorrect:false},{text:'瓦特',isCorrect:false}] },
  { id: 'west_science_4_008', content: '什么是基因突变？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'基因结构改变',isCorrect:true},{text:'基因数量改变',isCorrect:false},{text:'基因位置改变',isCorrect:false},{text:'基因丢失',isCorrect:false}] },
  { id: 'west_science_4_009', content: '地球的磁场来源于哪里？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'地核',isCorrect:true},{text:'地壳',isCorrect:false},{text:'地幔',isCorrect:false},{text:'海洋',isCorrect:false}] },
  { id: 'west_science_4_010', content: '什么是进化论？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'生物由简单到复杂的发展',isCorrect:true},{text:'生物由复杂到简单的发展',isCorrect:false},{text:'生物不会变化',isCorrect:false},{text:'生物突然出现',isCorrect:false}] },
  { id: 'west_science_4_011', content: '什么是染色体？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'DNA的载体',isCorrect:true},{text:'基因的载体',isCorrect:false},{text:'蛋白质的载体',isCorrect:false},{text:'细胞的载体',isCorrect:false}] },
  { id: 'west_science_4_012', content: '什么是反射？', type: 'single', difficulty: 4, category: 'science', grade: 8, options: [{text:'光从一种介质进入另一种介质',isCorrect:false},{text:'光返回原介质',isCorrect:true},{text:'光穿透介质',isCorrect:false},{text:'光被介质吸收',isCorrect:false}] },
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