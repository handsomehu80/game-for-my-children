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

// === MATH D1 (40题, grade 1-3) ===
const mathD1Questions: Question[] = [
  { id: 'east_math_1_001', content: '1 + 1 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'east_math_1_002', content: '2 + 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_003', content: '5 - 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'east_math_1_004', content: '4 + 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_005', content: '9 - 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_006', content: '3 × 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_007', content: '12 + 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'15',isCorrect:false},{text:'16',isCorrect:false},{text:'17',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'east_math_1_008', content: '15 - 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_009', content: '6 + 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'8',isCorrect:false},{text:'9',isCorrect:false},{text:'10',isCorrect:true},{text:'11',isCorrect:false}] },
  { id: 'east_math_1_010', content: '8 - 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:true},{text:'4',isCorrect:false},{text:'5',isCorrect:false}] },
  { id: 'east_math_1_011', content: '2 + 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false},{text:'11',isCorrect:false}] },
  { id: 'east_math_1_012', content: '10 - 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_013', content: '3 + 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_014', content: '7 - 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'east_math_1_015', content: '4 × 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_016', content: '16 - 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
  { id: 'east_math_1_017', content: '5 + 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:true},{text:'12',isCorrect:false},{text:'13',isCorrect:false}] },
  { id: 'east_math_1_018', content: '11 - 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_019', content: '3 × 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
  { id: 'east_math_1_020', content: '20 - 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [{text:'9',isCorrect:false},{text:'10',isCorrect:false},{text:'11',isCorrect:true},{text:'12',isCorrect:false}] },
  { id: 'east_math_1_021', content: '8 + 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'east_math_1_022', content: '18 - 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'east_math_1_023', content: '4 × 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'18',isCorrect:false},{text:'19',isCorrect:false},{text:'20',isCorrect:true},{text:'21',isCorrect:false}] },
  { id: 'east_math_1_024', content: '25 ÷ 5 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'east_math_1_025', content: '14 + 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'20',isCorrect:false},{text:'21',isCorrect:false},{text:'22',isCorrect:true},{text:'23',isCorrect:false}] },
  { id: 'east_math_1_026', content: '17 - 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'east_math_1_027', content: '6 × 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'16',isCorrect:false},{text:'17',isCorrect:false},{text:'18',isCorrect:true},{text:'19',isCorrect:false}] },
  { id: 'east_math_1_028', content: '36 ÷ 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_029', content: '9 + 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'15',isCorrect:false},{text:'16',isCorrect:false},{text:'17',isCorrect:true},{text:'18',isCorrect:false}] },
  { id: 'east_math_1_030', content: '13 - 6 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_031', content: '5 × 4 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'18',isCorrect:false},{text:'19',isCorrect:false},{text:'20',isCorrect:true},{text:'21',isCorrect:false}] },
  { id: 'east_math_1_032', content: '42 ÷ 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_033', content: '11 + 9 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'18',isCorrect:false},{text:'19',isCorrect:false},{text:'20',isCorrect:true},{text:'21',isCorrect:false}] },
  { id: 'east_math_1_034', content: '16 - 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'7',isCorrect:false},{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false}] },
  { id: 'east_math_1_035', content: '7 × 2 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'12',isCorrect:false},{text:'13',isCorrect:false},{text:'14',isCorrect:true},{text:'15',isCorrect:false}] },
  { id: 'east_math_1_036', content: '48 ÷ 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:true},{text:'7',isCorrect:false},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_037', content: '6 + 8 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'12',isCorrect:false},{text:'13',isCorrect:false},{text:'14',isCorrect:true},{text:'15',isCorrect:false}] },
  { id: 'east_math_1_038', content: '19 - 12 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'east_math_1_039', content: '8 × 3 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'22',isCorrect:false},{text:'23',isCorrect:false},{text:'24',isCorrect:true},{text:'25',isCorrect:false}] },
  { id: 'east_math_1_040', content: '56 ÷ 7 = ?', type: 'single', difficulty: 1, category: 'math', grade: 3, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false}] },
]

// === MATH D2 (30题, grade 4-5) ===
const mathD2Questions: Question[] = [
  { id: 'east_math_2_001', content: '25 + 37 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'52',isCorrect:false},{text:'62',isCorrect:true},{text:'72',isCorrect:false},{text:'42',isCorrect:false}] },
  { id: 'east_math_2_002', content: '84 - 29 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'45',isCorrect:false},{text:'55',isCorrect:true},{text:'65',isCorrect:false},{text:'35',isCorrect:false}] },
  { id: 'east_math_2_003', content: '7 × 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'54',isCorrect:false},{text:'56',isCorrect:true},{text:'58',isCorrect:false},{text:'48',isCorrect:false}] },
  { id: 'east_math_2_004', content: '63 ÷ 9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false},{text:'9',isCorrect:false}] },
  { id: 'east_math_2_005', content: '234 + 156 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'380',isCorrect:false},{text:'390',isCorrect:true},{text:'400',isCorrect:false},{text:'410',isCorrect:false}] },
  { id: 'east_math_2_006', content: '500 - 178 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'312',isCorrect:false},{text:'322',isCorrect:true},{text:'332',isCorrect:false},{text:'342',isCorrect:false}] },
  { id: 'east_math_2_007', content: '12 × 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'160',isCorrect:false},{text:'170',isCorrect:false},{text:'180',isCorrect:true},{text:'190',isCorrect:false}] },
  { id: 'east_math_2_008', content: '144 ÷ 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
  { id: 'east_math_2_009', content: '36 × 5 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'170',isCorrect:false},{text:'175',isCorrect:false},{text:'180',isCorrect:true},{text:'185',isCorrect:false}] },
  { id: 'east_math_2_010', content: '450 ÷ 9 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'45',isCorrect:false},{text:'50',isCorrect:true},{text:'55',isCorrect:false},{text:'60',isCorrect:false}] },
  { id: 'east_math_2_011', content: '127 + 258 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'375',isCorrect:false},{text:'385',isCorrect:true},{text:'395',isCorrect:false},{text:'405',isCorrect:false}] },
  { id: 'east_math_2_012', content: '600 - 347 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'243',isCorrect:false},{text:'253',isCorrect:true},{text:'263',isCorrect:false},{text:'273',isCorrect:false}] },
  { id: 'east_math_2_013', content: '18 × 7 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'116',isCorrect:false},{text:'126',isCorrect:true},{text:'136',isCorrect:false},{text:'146',isCorrect:false}] },
  { id: 'east_math_2_014', content: '96 ÷ 8 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'13',isCorrect:false}] },
  { id: 'east_math_2_015', content: '356 + 189 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'535',isCorrect:false},{text:'545',isCorrect:true},{text:'555',isCorrect:false},{text:'565',isCorrect:false}] },
  { id: 'east_math_2_016', content: '800 - 456 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [{text:'334',isCorrect:false},{text:'344',isCorrect:true},{text:'354',isCorrect:false},{text:'364',isCorrect:false}] },
  { id: 'east_math_2_017', content: '14 × 12 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'158',isCorrect:false},{text:'168',isCorrect:true},{text:'178',isCorrect:false},{text:'188',isCorrect:false}] },
  { id: 'east_math_2_018', content: '225 ÷ 15 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'13',isCorrect:false},{text:'14',isCorrect:false},{text:'15',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'east_math_2_019', content: '478 + 267 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'735',isCorrect:false},{text:'745',isCorrect:true},{text:'755',isCorrect:false},{text:'765',isCorrect:false}] },
  { id: 'east_math_2_020', content: '1000 - 583 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'407',isCorrect:false},{text:'417',isCorrect:true},{text:'427',isCorrect:false},{text:'437',isCorrect:false}] },
  { id: 'east_math_2_021', content: '16 × 25 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'390',isCorrect:false},{text:'400',isCorrect:true},{text:'410',isCorrect:false},{text:'420',isCorrect:false}] },
  { id: 'east_math_2_022', content: '360 ÷ 18 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'18',isCorrect:false},{text:'20',isCorrect:true},{text:'22',isCorrect:false},{text:'24',isCorrect:false}] },
  { id: 'east_math_2_023', content: '189 + 456 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'635',isCorrect:false},{text:'645',isCorrect:true},{text:'655',isCorrect:false},{text:'665',isCorrect:false}] },
  { id: 'east_math_2_024', content: '723 - 389 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'324',isCorrect:false},{text:'334',isCorrect:true},{text:'344',isCorrect:false},{text:'354',isCorrect:false}] },
  { id: 'east_math_2_025', content: '13 × 13 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'159',isCorrect:false},{text:'169',isCorrect:true},{text:'179',isCorrect:false},{text:'189',isCorrect:false}] },
  { id: 'east_math_2_026', content: '432 ÷ 24 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'16',isCorrect:false},{text:'17',isCorrect:false},{text:'18',isCorrect:true},{text:'19',isCorrect:false}] },
  { id: 'east_math_2_027', content: '256 + 378 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'624',isCorrect:false},{text:'634',isCorrect:true},{text:'644',isCorrect:false},{text:'654',isCorrect:false}] },
  { id: 'east_math_2_028', content: '900 - 467 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'423',isCorrect:false},{text:'433',isCorrect:true},{text:'443',isCorrect:false},{text:'453',isCorrect:false}] },
  { id: 'east_math_2_029', content: '17 × 11 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'177',isCorrect:false},{text:'187',isCorrect:true},{text:'197',isCorrect:false},{text:'207',isCorrect:false}] },
  { id: 'east_math_2_030', content: '585 ÷ 13 = ?', type: 'single', difficulty: 2, category: 'math', grade: 5, options: [{text:'43',isCorrect:false},{text:'44',isCorrect:false},{text:'45',isCorrect:true},{text:'46',isCorrect:false}] },
]

// === MATH D3 (20题, grade 6-7) ===
const mathD3Questions: Question[] = [
  { id: 'east_math_3_001', content: '3.14 × 10 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'31.4',isCorrect:true},{text:'314',isCorrect:false},{text:'3.14',isCorrect:false},{text:'0.314',isCorrect:false}] },
  { id: 'east_math_3_002', content: '(3 + 5) × 2 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'13',isCorrect:false},{text:'16',isCorrect:true},{text:'18',isCorrect:false},{text:'20',isCorrect:false}] },
  { id: 'east_math_3_003', content: '48 ÷ (12 ÷ 3) = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'4',isCorrect:false},{text:'8',isCorrect:false},{text:'12',isCorrect:true},{text:'16',isCorrect:false}] },
  { id: 'east_math_3_004', content: '2³ = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'6',isCorrect:false},{text:'8',isCorrect:true},{text:'9',isCorrect:false},{text:'16',isCorrect:false}] },
  { id: 'east_math_3_005', content: '√144 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'10',isCorrect:false},{text:'11',isCorrect:false},{text:'12',isCorrect:true},{text:'14',isCorrect:false}] },
  { id: 'east_math_3_006', content: '-5 + 8 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'-13',isCorrect:false},{text:'3',isCorrect:true},{text:'13',isCorrect:false},{text:'-3',isCorrect:false}] },
  { id: 'east_math_3_007', content: '3x + 5 = 20, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'3',isCorrect:false},{text:'4',isCorrect:false},{text:'5',isCorrect:true},{text:'6',isCorrect:false}] },
  { id: 'east_math_3_008', content: '25% of 80 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'15',isCorrect:false},{text:'20',isCorrect:true},{text:'25',isCorrect:false},{text:'30',isCorrect:false}] },
  { id: 'east_math_3_009', content: '0.5 × 2.6 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'1.2',isCorrect:false},{text:'1.3',isCorrect:true},{text:'1.4',isCorrect:false},{text:'1.5',isCorrect:false}] },
  { id: 'east_math_3_010', content: '(2 + 3)² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'25',isCorrect:true},{text:'20',isCorrect:false},{text:'30',isCorrect:false},{text:'10',isCorrect:false}] },
  { id: 'east_math_3_011', content: '5² + 12² = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'169',isCorrect:true},{text:'144',isCorrect:false},{text:'156',isCorrect:false},{text:'180',isCorrect:false}] },
  { id: 'east_math_3_012', content: '-7 - 3 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'-10',isCorrect:true},{text:'10',isCorrect:false},{text:'-4',isCorrect:false},{text:'4',isCorrect:false}] },
  { id: 'east_math_3_013', content: '4x - 7 = 9, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false}] },
  { id: 'east_math_3_014', content: '75% of 200 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'140',isCorrect:false},{text:'150',isCorrect:true},{text:'160',isCorrect:false},{text:'170',isCorrect:false}] },
  { id: 'east_math_3_015', content: '3⁴ = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'64',isCorrect:false},{text:'81',isCorrect:true},{text:'60',isCorrect:false},{text:'90',isCorrect:false}] },
  { id: 'east_math_3_016', content: '√81 = ?', type: 'single', difficulty: 3, category: 'math', grade: 6, options: [{text:'8',isCorrect:false},{text:'9',isCorrect:true},{text:'10',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'east_math_3_017', content: '5x = 35, x = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'5',isCorrect:false},{text:'6',isCorrect:false},{text:'7',isCorrect:true},{text:'8',isCorrect:false}] },
  { id: 'east_math_3_018', content: '(-3) × (-4) = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'-12',isCorrect:false},{text:'12',isCorrect:true},{text:'-7',isCorrect:false},{text:'7',isCorrect:false}] },
  { id: 'east_math_3_019', content: '20% of 150 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'25',isCorrect:false},{text:'30',isCorrect:true},{text:'35',isCorrect:false},{text:'40',isCorrect:false}] },
  { id: 'east_math_3_020', content: '√169 = ?', type: 'single', difficulty: 3, category: 'math', grade: 7, options: [{text:'11',isCorrect:false},{text:'12',isCorrect:false},{text:'13',isCorrect:true},{text:'14',isCorrect:false}] },
]

// === MATH D4 (8题, grade 8) ===
const mathD4Questions: Question[] = [
  { id: 'east_math_4_001', content: 'x² - 9 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'±2',isCorrect:false},{text:'±3',isCorrect:true},{text:'±4',isCorrect:false},{text:'±5',isCorrect:false}] },
  { id: 'east_math_4_002', content: '2x + y = 10, x - y = 2, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'2',isCorrect:false},{text:'3',isCorrect:false},{text:'4',isCorrect:true},{text:'5',isCorrect:false}] },
  { id: 'east_math_4_003', content: 'sin(90°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'√2/2',isCorrect:false}] },
  { id: 'east_math_4_004', content: 'a³ × a² = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'a⁵',isCorrect:true},{text:'a⁶',isCorrect:false},{text:'a⁹',isCorrect:false},{text:'2a⁵',isCorrect:false}] },
  { id: 'east_math_4_005', content: '(x+2)(x-2) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'x²-4',isCorrect:true},{text:'x²+4',isCorrect:false},{text:'x²-2x+4',isCorrect:false},{text:'x²+2x-4',isCorrect:false}] },
  { id: 'east_math_4_006', content: '√50 = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'5√2',isCorrect:true},{text:'2√5',isCorrect:false},{text:'25',isCorrect:false},{text:'10√5',isCorrect:false}] },
  { id: 'east_math_4_007', content: 'x² + 5x + 6 = 0, x = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'-1, -6',isCorrect:false},{text:'-2, -3',isCorrect:true},{text:'2, 3',isCorrect:false},{text:'-2, 3',isCorrect:false}] },
  { id: 'east_math_4_008', content: 'cos(0°) = ?', type: 'single', difficulty: 4, category: 'math', grade: 8, options: [{text:'0',isCorrect:false},{text:'0.5',isCorrect:false},{text:'1',isCorrect:true},{text:'-1',isCorrect:false}] },
]

// === MATH D5 (25题, grade 9) ===
const mathD5Questions: Question[] = [
  { id: 'east_math_5_001', content: 'x² - 5x + 6 = 0, x = ?', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'2, 3',isCorrect:true},{text:'1, 6',isCorrect:false},{text:'-2, -3',isCorrect:false},{text:'2, -3',isCorrect:false}] },
  { id: 'east_math_5_002', content: '一元二次方程 x² = 9 的解是？', type: 'single', difficulty: 5, category: 'math', grade: 9, options: [{text:'x = 3',isCorrect:false},{text:'x = ±3',isCorrect:true},{text:'x = -3',isCorrect:false},{text:'x = 9',isCorrect:false}] },
]

// === CHINESE D1 (40题, grade 1-3) ===
const chineseD1Questions: Question[] = [
  { id: 'east_chinese_1_001', content: '”大”字有多少笔画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_002', content: '”日”字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'月亮',isCorrect:false},{text:'太阳',isCorrect:true},{text:'星星',isCorrect:false},{text:'云彩',isCorrect:false}] },
  { id: 'east_chinese_1_003', content: '下列哪个是水果？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'白菜',isCorrect:false},{text:'苹果',isCorrect:true},{text:'萝卜',isCorrect:false},{text:'青菜',isCorrect:false}] },
  { id: 'east_chinese_1_004', content: '”上”字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'左',isCorrect:false},{text:'下',isCorrect:true},{text:'前',isCorrect:false},{text:'高',isCorrect:false}] },
  { id: 'east_chinese_1_005', content: '一年有几个季节？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:false},{text:'4个',isCorrect:true},{text:'5个',isCorrect:false}] },
  { id: 'east_chinese_1_006', content: '”天”字共有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'east_chinese_1_007', content: '哪个字是动词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'美丽',isCorrect:false},{text:'跑步',isCorrect:true},{text:'高兴',isCorrect:false},{text:'红色',isCorrect:false}] },
  { id: 'east_chinese_1_008', content: '”鸟”可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'鲜花',isCorrect:false},{text:'小鸟',isCorrect:true},{text:'大树',isCorrect:false},{text:'小河',isCorrect:false}] },
  { id: 'east_chinese_1_009', content: '”人”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'1画',isCorrect:false},{text:'2画',isCorrect:true},{text:'3画',isCorrect:false},{text:'4画',isCorrect:false}] },
  { id: 'east_chinese_1_010', content: '下列哪个是动物？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'树木',isCorrect:false},{text:'小鱼',isCorrect:true},{text:'花朵',isCorrect:false},{text:'小草',isCorrect:false}] },
  { id: 'east_chinese_1_011', content: '”水”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'east_chinese_1_012', content: '”月”字的意思是？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'太阳',isCorrect:false},{text:'月亮',isCorrect:true},{text:'星星',isCorrect:false},{text:'云',isCorrect:false}] },
  { id: 'east_chinese_1_013', content: '哪个是方向词？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'高兴',isCorrect:false},{text:'东',isCorrect:true},{text:'美丽',isCorrect:false},{text:'快乐',isCorrect:false}] },
  { id: 'east_chinese_1_014', content: '”山”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 1, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_015', content: '下列哪个是蔬菜？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'苹果',isCorrect:false},{text:'香蕉',isCorrect:false},{text:'白菜',isCorrect:true},{text:'葡萄',isCorrect:false}] },
  { id: 'east_chinese_1_016', content: '”小”字的反义词是？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'少',isCorrect:false},{text:'大',isCorrect:true},{text:'矮',isCorrect:false},{text:'短',isCorrect:false}] },
  { id: 'east_chinese_1_017', content: '”长”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false},{text:'6画',isCorrect:false}] },
  { id: 'east_chinese_1_018', content: '哪个字是形容词？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'跑',isCorrect:false},{text:'跳',isCorrect:false},{text:'高',isCorrect:true},{text:'吃',isCorrect:false}] },
  { id: 'east_chinese_1_019', content: '一个星期有几天？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'5天',isCorrect:false},{text:'6天',isCorrect:false},{text:'7天',isCorrect:true},{text:'8天',isCorrect:false}] },
  { id: 'east_chinese_1_020', content: '”目”字可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 2, options: [{text:'目光',isCorrect:true},{text:'日光',isCorrect:false},{text:'月光',isCorrect:false},{text:'星光',isCorrect:false}] },
  { id: 'east_chinese_1_021', content: '哪个字是量词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'个',isCorrect:true},{text:'跑',isCorrect:false},{text:'高',isCorrect:false},{text:'红',isCorrect:false}] },
  { id: 'east_chinese_1_022', content: '”口”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_023', content: '下列哪个是时间词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'昨天',isCorrect:true},{text:'高大',isCorrect:false},{text:'快乐',isCorrect:false},{text:'跑步',isCorrect:false}] },
  { id: 'east_chinese_1_024', content: '”耳”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:false},{text:'6画',isCorrect:true},{text:'7画',isCorrect:false}] },
  { id: 'east_chinese_1_025', content: '哪个字是代词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'我',isCorrect:true},{text:'跑',isCorrect:false},{text:'高',isCorrect:false},{text:'红',isCorrect:false}] },
  { id: 'east_chinese_1_026', content: '一年有几个月？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'10个月',isCorrect:false},{text:'11个月',isCorrect:false},{text:'12个月',isCorrect:true},{text:'13个月',isCorrect:false}] },
  { id: 'east_chinese_1_027', content: '”手”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_028', content: '下列哪个是动作词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'美丽',isCorrect:false},{text:'唱歌',isCorrect:true},{text:'高兴',isCorrect:false},{text:'善良',isCorrect:false}] },
  { id: 'east_chinese_1_029', content: '”足”字可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'足球',isCorrect:true},{text:'网球',isCorrect:false},{text:'排球',isCorrect:false},{text:'篮球',isCorrect:false}] },
  { id: 'east_chinese_1_030', content: '哪个字是颜色词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'跑',isCorrect:false},{text:'跳',isCorrect:false},{text:'黄',isCorrect:true},{text:'高',isCorrect:false}] },
  { id: 'east_chinese_1_031', content: '”虫”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:false},{text:'6画',isCorrect:true},{text:'7画',isCorrect:false}] },
  { id: 'east_chinese_1_032', content: '下列哪个是食品？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'衣服',isCorrect:false},{text:'米饭',isCorrect:true},{text:'桌子',isCorrect:false},{text:'书本',isCorrect:false}] },
  { id: 'east_chinese_1_033', content: '”田”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'4画',isCorrect:false},{text:'5画',isCorrect:true},{text:'6画',isCorrect:false},{text:'7画',isCorrect:false}] },
  { id: 'east_chinese_1_034', content: '”日”字可组词为？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'日子',isCorrect:true},{text:'月光',isCorrect:false},{text:'星光',isCorrect:false},{text:'目光',isCorrect:false}] },
  { id: 'east_chinese_1_035', content: '哪个是疑问词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'吗',isCorrect:true},{text:'的',isCorrect:false},{text:'了',isCorrect:false},{text:'着',isCorrect:false}] },
  { id: 'east_chinese_1_036', content: '”石”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'3画',isCorrect:false},{text:'4画',isCorrect:false},{text:'5画',isCorrect:true},{text:'6画',isCorrect:false}] },
  { id: 'east_chinese_1_037', content: '下列哪个是自然现象？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'雨',isCorrect:true},{text:'桌子',isCorrect:false},{text:'书本',isCorrect:false},{text:'汽车',isCorrect:false}] },
  { id: 'east_chinese_1_038', content: '”火”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:false},{text:'4画',isCorrect:true},{text:'5画',isCorrect:false}] },
  { id: 'east_chinese_1_039', content: '哪个字是数词？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'三',isCorrect:true},{text:'跑',isCorrect:false},{text:'高',isCorrect:false},{text:'红',isCorrect:false}] },
  { id: 'east_chinese_1_040', content: '”土”字有几画？', type: 'single', difficulty: 1, category: 'chinese', grade: 3, options: [{text:'2画',isCorrect:false},{text:'3画',isCorrect:true},{text:'4画',isCorrect:false},{text:'5画',isCorrect:false}] },
]

// === CHINESE D2 (30题, grade 4-5) ===
const chineseD2Questions: Question[] = [
  { id: 'east_chinese_2_001', content: '《静夜思》的作者是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'杜甫',isCorrect:false},{text:'白居易',isCorrect:false},{text:'李白',isCorrect:true},{text:'王维',isCorrect:false}] },
  { id: 'east_chinese_2_002', content: '”望梅止渴”说的是谁的故事？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'刘备',isCorrect:false},{text:'曹操',isCorrect:true},{text:'关羽',isCorrect:false},{text:'张飞',isCorrect:false}] },
  { id: 'east_chinese_2_003', content: '下列哪个是贬义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'勇敢',isCorrect:false},{text:'善良',isCorrect:false},{text:'狡猾',isCorrect:true},{text:'勤奋',isCorrect:false}] },
  { id: 'east_chinese_2_004', content: '”学而不思则罔”的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'思而不学则殆',isCorrect:true},{text:'敏而好学',isCorrect:false},{text:'温故知新',isCorrect:false},{text:'学而时习',isCorrect:false}] },
  { id: 'east_chinese_2_005', content: '《西游记》中唐僧的徒弟有几个？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'2个',isCorrect:false},{text:'3个',isCorrect:true},{text:'4个',isCorrect:false},{text:'5个',isCorrect:false}] },
  { id: 'east_chinese_2_006', content: '”鼎”字有几画？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'10画',isCorrect:false},{text:'11画',isCorrect:false},{text:'12画',isCorrect:true},{text:'13画',isCorrect:false}] },
  { id: 'east_chinese_2_007', content: '下列哪个不是四大名著？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'红楼梦',isCorrect:false},{text:'三国演义',isCorrect:false},{text:'儒林外史',isCorrect:true},{text:'水浒传',isCorrect:false}] },
  { id: 'east_chinese_2_008', content: '”揠苗助长”属于哪种文学常识？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'比喻',isCorrect:false},{text:'拟人',isCorrect:false},{text:'成语典故',isCorrect:true},{text:'夸张',isCorrect:false}] },
  { id: 'east_chinese_2_009', content: '《春晓》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'李白',isCorrect:false},{text:'孟浩然',isCorrect:true},{text:'王维',isCorrect:false},{text:'杜甫',isCorrect:false}] },
  { id: 'east_chinese_2_010', content: '下列哪个是褒义词？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'狡猾',isCorrect:false},{text:'懒惰',isCorrect:false},{text:'谦虚',isCorrect:true},{text:'贪婪',isCorrect:false}] },
  { id: 'east_chinese_2_011', content: '”纸上得来终觉浅”的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'学而时习之',isCorrect:false},{text:'绝知此事要躬行',isCorrect:true},{text:'书山有路勤为径',isCorrect:false},{text:'学海无涯苦作舟',isCorrect:false}] },
  { id: 'east_chinese_2_012', content: '《三国演义》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'曹雪芹',isCorrect:false},{text:'施耐庵',isCorrect:false},{text:'罗贯中',isCorrect:true},{text:'吴承恩',isCorrect:false}] },
  { id: 'east_chinese_2_013', content: '”掩耳盗铃”告诉我们什么道理？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'要努力',isCorrect:false},{text:'要诚实',isCorrect:false},{text:'自欺欺人',isCorrect:true},{text:'要勇敢',isCorrect:false}] },
  { id: 'east_chinese_2_014', content: '下列哪个是神话故事？', type: 'single', difficulty: 2, category: 'chinese', grade: 4, options: [{text:'守株待兔',isCorrect:false},{text:'夸父追日',isCorrect:true},{text:'亡羊补牢',isCorrect:false},{text:'刻舟求剑',isCorrect:false}] },
  { id: 'east_chinese_2_015', content: '《游子吟》是谁写的？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'李白',isCorrect:false},{text:'孟郊',isCorrect:true},{text:'王维',isCorrect:false},{text:'杜甫',isCorrect:false}] },
  { id: 'east_chinese_2_016', content: '”不入虎穴焉得虎子”是谁说的？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'孔子',isCorrect:false},{text:'老子',isCorrect:false},{text:'班超',isCorrect:true},{text:'秦始皇',isCorrect:false}] },
  { id: 'east_chinese_2_017', content: '下列哪个是记叙文？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'说明书',isCorrect:false},{text:'日记',isCorrect:true},{text:'广告',isCorrect:false},{text:'通知',isCorrect:false}] },
  { id: 'east_chinese_2_018', content: '”熟能生巧”说的是谁的故事？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'华佗',isCorrect:false},{text:'卖油翁',isCorrect:true},{text:'李时珍',isCorrect:false},{text:'张仲景',isCorrect:false}] },
  { id: 'east_chinese_2_019', content: '《水调歌头》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'辛弃疾',isCorrect:false},{text:'苏轼',isCorrect:true},{text:'李清照',isCorrect:false},{text:'陆游',isCorrect:false}] },
  { id: 'east_chinese_2_020', content: '”欲穷千里目”的下一句是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'更上一层楼',isCorrect:true},{text:'疑是地上霜',isCorrect:false},{text:'低头思故乡',isCorrect:false},{text:'举头望明月',isCorrect:false}] },
  { id: 'east_chinese_2_021', content: '下列哪个不是唐诗？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'静夜思',isCorrect:false},{text:'春晓',isCorrect:false},{text:'悯农',isCorrect:false},{text:'念奴娇',isCorrect:true}] },
  { id: 'east_chinese_2_022', content: '”千里迢迢”的意思是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'很近',isCorrect:false},{text:'路很远',isCorrect:true},{text:'很快',isCorrect:false},{text:'很慢',isCorrect:false}] },
  { id: 'east_chinese_2_023', content: '《草》的作者是？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'李白',isCorrect:false},{text:'白居易',isCorrect:true},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'east_chinese_2_024', content: '下列哪个是形声字？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'人',isCorrect:false},{text:'日',isCorrect:false},{text:'河',isCorrect:true},{text:'火',isCorrect:false}] },
  { id: 'east_chinese_2_025', content: '”对牛弹琴”比喻什么？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'很勇敢',isCorrect:false},{text:'找错对象',isCorrect:true},{text:'很聪明',isCorrect:false},{text:'很努力',isCorrect:false}] },
  { id: 'east_chinese_2_026', content: '《枫桥夜泊》是谁写的？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'张继',isCorrect:true},{text:'张九龄',isCorrect:false},{text:'王之涣',isCorrect:false},{text:'王昌龄',isCorrect:false}] },
  { id: 'east_chinese_2_027', content: '下列哪个是宋词？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'登鹳雀楼',isCorrect:false},{text:'黄鹤楼送孟浩然之广陵',isCorrect:false},{text:'清平调',isCorrect:false},{text:'念奴娇',isCorrect:true}] },
  { id: 'east_chinese_2_028', content: '”凿壁偷光”说的是谁？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'孔子',isCorrect:false},{text:'孟子',isCorrect:false},{text:'匡衡',isCorrect:true},{text:'刘备',isCorrect:false}] },
  { id: 'east_chinese_2_029', content: '《悯农》告诉我们什么？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'要读书',isCorrect:false},{text:'要节约粮食',isCorrect:true},{text:'要勇敢',isCorrect:false},{text:'要善良',isCorrect:false}] },
  { id: 'east_chinese_2_030', content: '”画蛇添足”比喻什么？', type: 'single', difficulty: 2, category: 'chinese', grade: 5, options: [{text:'做得好',isCorrect:false},{text:'多此一举',isCorrect:true},{text:'很努力',isCorrect:false},{text:'很聪明',isCorrect:false}] },
]

// === CHINESE D3 (20题, grade 6-7) ===
const chineseD3Questions: Question[] = [
  { id: 'east_chinese_3_001', content: '《满江红》的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'岳飞',isCorrect:true},{text:'辛弃疾',isCorrect:false},{text:'苏轼',isCorrect:false},{text:'陆游',isCorrect:false}] },
  { id: 'east_chinese_3_002', content: '”出淤泥而不染”赞美的是哪种花？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'菊花',isCorrect:false},{text:'梅花',isCorrect:false},{text:'莲花',isCorrect:true},{text:'牡丹',isCorrect:false}] },
  { id: 'east_chinese_3_003', content: '下列哪个是宋词？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'登鹳雀楼',isCorrect:false},{text:'春晓',isCorrect:false},{text:'水调歌头',isCorrect:true},{text:'静夜思',isCorrect:false}] },
  { id: 'east_chinese_3_004', content: '”苟利国家生死以”的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'岂因祸福避趋之',isCorrect:true},{text:'留取丹心照汗青',isCorrect:false},{text:'天下兴亡匹夫有责',isCorrect:false},{text:'人生自古谁无死',isCorrect:false}] },
  { id: 'east_chinese_3_005', content: '《背影》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'east_chinese_3_006', content: '”逝者如斯夫”出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'east_chinese_3_007', content: '下列哪个是鲁迅的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'骆驼祥子',isCorrect:false},{text:'朝花夕拾',isCorrect:true},{text:'茶馆',isCorrect:false},{text:'四世同堂',isCorrect:false}] },
  { id: 'east_chinese_3_008', content: '”不以物喜，不以己悲”出自哪篇文章？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《醉翁亭记》',isCorrect:false},{text:'《岳阳楼记》',isCorrect:true},{text:'《滕王阁序》',isCorrect:false},{text:'《赤壁赋》',isCorrect:false}] },
  { id: 'east_chinese_3_009', content: '《荷塘月色》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'鲁迅',isCorrect:false},{text:'朱自清',isCorrect:true},{text:'老舍',isCorrect:false},{text:'冰心',isCorrect:false}] },
  { id: 'east_chinese_3_010', content: '”桃花源记”的作者是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'陶渊明',isCorrect:true},{text:'李白',isCorrect:false},{text:'杜甫',isCorrect:false},{text:'王维',isCorrect:false}] },
  { id: 'east_chinese_3_011', content: '下列哪个是元曲？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'静夜思',isCorrect:false},{text:'天净沙秋思',isCorrect:true},{text:'登鹳雀楼',isCorrect:false},{text:'春晓',isCorrect:false}] },
  { id: 'east_chinese_3_012', content: '”先天下之忧而忧”的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'后天下之乐而乐',isCorrect:true},{text:'安得广厦千万间',isCorrect:false},{text:'吾将上下而求索',isCorrect:false},{text:'人生自古谁无死',isCorrect:false}] },
  { id: 'east_chinese_3_013', content: '《少年闰土》选自哪本书？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'朝花夕拾',isCorrect:true},{text:'呐喊',isCorrect:false},{text:'彷徨',isCorrect:false},{text:'而已集',isCorrect:false}] },
  { id: 'east_chinese_3_014', content: '”学而不厌”出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'east_chinese_3_015', content: '下列哪个是明代小说？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'三国演义',isCorrect:true},{text:'聊斋志异',isCorrect:false},{text:'儒林外史',isCorrect:false},{text:'红楼梦',isCorrect:false}] },
  { id: 'east_chinese_3_016', content: '”山重水复疑无路”的下一句是？', type: 'single', difficulty: 3, category: 'chinese', grade: 6, options: [{text:'柳暗花明又一村',isCorrect:true},{text:'牧童遥指杏花村',isCorrect:false},{text:'路上行人欲断魂',isCorrect:false},{text:'清明时节雨纷纷',isCorrect:false}] },
  { id: 'east_chinese_3_017', content: '《最后一头战象》是谁写的？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'沈石溪',isCorrect:true},{text:'叶圣陶',isCorrect:false},{text:'冰心',isCorrect:false},{text:'老舍',isCorrect:false}] },
  { id: 'east_chinese_3_018', content: '”礼尚往来”出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《论语》',isCorrect:false},{text:'《礼记》',isCorrect:true},{text:'《大学》',isCorrect:false},{text:'《中庸》',isCorrect:false}] },
  { id: 'east_chinese_3_019', content: '下列哪个是冰心的作品？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'小桔灯',isCorrect:true},{text:'背影',isCorrect:false},{text:'荷塘月色',isCorrect:false},{text:'茶馆',isCorrect:false}] },
  { id: 'east_chinese_3_020', content: '”温故而知新”出自哪里？', type: 'single', difficulty: 3, category: 'chinese', grade: 7, options: [{text:'《大学》',isCorrect:false},{text:'《论语》',isCorrect:true},{text:'《孟子》',isCorrect:false},{text:'《礼记》',isCorrect:false}] },
]

// === CHINESE D4 (8题, grade 8) ===
const chineseD4Questions: Question[] = [
  { id: 'east_chinese_4_001', content: '《红楼梦》的作者是？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'曹雪芹',isCorrect:true},{text:'吴承恩',isCorrect:false},{text:'施耐庵',isCorrect:false},{text:'罗贯中',isCorrect:false}] },
  { id: 'east_chinese_4_002', content: '”青，取之于蓝而青于蓝”出自？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《论语》',isCorrect:false},{text:'《庄子》',isCorrect:false},{text:'《荀子》',isCorrect:true},{text:'《老子》',isCorrect:false}] },
  { id: 'east_chinese_4_003', content: '下列哪个是明代小说？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《三国演义》',isCorrect:true},{text:'《聊斋志异》',isCorrect:false},{text:'《儒林外史》',isCorrect:false},{text:'《红楼梦》',isCorrect:false}] },
  { id: 'east_chinese_4_004', content: '”己所不欲，勿施于人”体现哪种思想？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'道家',isCorrect:false},{text:'儒家',isCorrect:true},{text:'法家',isCorrect:false},{text:'墨家',isCorrect:false}] },
  { id: 'east_chinese_4_005', content: '《诗经》分为哪三部分？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'风、雅、颂',isCorrect:true},{text:'赋、比、兴',isCorrect:false},{text:'经、史、子',isCorrect:false},{text:'礼、乐、诗',isCorrect:false}] },
  { id: 'east_chinese_4_006', content: '”茕茕孑立”形容的是什么状态？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'快步走',isCorrect:false},{text:'独自站立',isCorrect:false},{text:'孤独无依',isCorrect:true},{text:'勤奋努力',isCorrect:false}] },
  { id: 'east_chinese_4_007', content: '《西厢记》是谁写的？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'关汉卿',isCorrect:false},{text:'王实甫',isCorrect:true},{text:'马致远',isCorrect:false},{text:'郑光祖',isCorrect:false}] },
  { id: 'east_chinese_4_008', content: '”防民之口甚于防川”出自哪里？', type: 'single', difficulty: 4, category: 'chinese', grade: 8, options: [{text:'《论语》',isCorrect:false},{text:'《国语》',isCorrect:true},{text:'《左传》',isCorrect:false},{text:'《战国策》',isCorrect:false}] },
]

// === CHINESE D5 (2题, grade 9) - Sample 2题 ===
const chineseD5Questions: Question[] = [
  { id: 'east_chinese_5_001', content: '“问渠那得清如许”的下一句是？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'为有源头活水来',isCorrect:true},{text:'一片冰心在玉壶',isCorrect:false},{text:'映日荷花别样红',isCorrect:false},{text:'总把新桃换旧符',isCorrect:false}] },
  { id: 'east_chinese_5_002', content: '《天工开物》的作者是谁？', type: 'single', difficulty: 5, category: 'chinese', grade: 9, options: [{text:'徐光启',isCorrect:false},{text:'宋应星',isCorrect:true},{text:'李时珍',isCorrect:false},{text:'徐霞客',isCorrect:false}] },
]

// === ENGLISH D1 (40题, grade 1-3) ===
const englishD1Questions: Question[] = [
  { id: 'east_english_1_001', content: 'What is the English for "苹果"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Banana',isCorrect:false},{text:'Apple',isCorrect:true},{text:'Orange',isCorrect:false},{text:'Grape',isCorrect:false}] },
  { id: 'east_english_1_002', content: 'How do you spell "dog"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'d-o-g',isCorrect:true},{text:'d-u-g',isCorrect:false},{text:'d-a-g',isCorrect:false},{text:'d-i-g',isCorrect:false}] },
  { id: 'east_english_1_003', content: '"红色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Red',isCorrect:true}] },
  { id: 'east_english_1_004', content: 'What number is "5"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Three',isCorrect:false},{text:'Four',isCorrect:false},{text:'Five',isCorrect:true},{text:'Six',isCorrect:false}] },
  { id: 'east_english_1_005', content: 'What is "猫"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:true},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'east_english_1_006', content: 'Hello! is a ___', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Question',isCorrect:false},{text:'Greeting',isCorrect:true},{text:'Command',isCorrect:false},{text:'Exclamation',isCorrect:false}] },
  { id: 'east_english_1_007', content: 'What color is the sky?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Blue',isCorrect:true},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:false}] },
  { id: 'east_english_1_008', content: '"太阳" is ___', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Moon',isCorrect:false},{text:'Star',isCorrect:false},{text:'Sun',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'east_english_1_009', content: 'What is "香蕉"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Apple',isCorrect:false},{text:'Banana',isCorrect:true},{text:'Orange',isCorrect:false},{text:'Grape',isCorrect:false}] },
  { id: 'east_english_1_010', content: 'How do you spell "cat"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'c-a-t',isCorrect:true},{text:'c-o-t',isCorrect:false},{text:'c-u-t',isCorrect:false},{text:'k-a-t',isCorrect:false}] },
  { id: 'east_english_1_011', content: '"黄色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:false},{text:'Yellow',isCorrect:true},{text:'Red',isCorrect:false}] },
  { id: 'east_english_1_012', content: 'What number is "3"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'One',isCorrect:false},{text:'Two',isCorrect:false},{text:'Three',isCorrect:true},{text:'Four',isCorrect:false}] },
  { id: 'east_english_1_013', content: 'What is "狗"?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Dog',isCorrect:true},{text:'Cat',isCorrect:false},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:false}] },
  { id: 'east_english_1_014', content: '"绿色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 1, options: [{text:'Blue',isCorrect:false},{text:'Green',isCorrect:true},{text:'Yellow',isCorrect:false},{text:'Red',isCorrect:false}] },
  { id: 'east_english_1_015', content: 'What is the English for "水"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Fire',isCorrect:false},{text:'Earth',isCorrect:false},{text:'Water',isCorrect:true},{text:'Air',isCorrect:false}] },
  { id: 'east_english_1_016', content: 'How do you spell "book"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'b-o-k',isCorrect:false},{text:'b-o-o-k',isCorrect:true},{text:'b-u-k',isCorrect:false},{text:'b-a-k',isCorrect:false}] },
  { id: 'east_english_1_017', content: 'What is "鱼"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:false},{text:'Bird',isCorrect:false},{text:'Fish',isCorrect:true}] },
  { id: 'east_english_1_018', content: 'What number is "8"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Six',isCorrect:false},{text:'Seven',isCorrect:false},{text:'Eight',isCorrect:true},{text:'Nine',isCorrect:false}] },
  { id: 'east_english_1_019', content: 'What is the English for "火"?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Water',isCorrect:false},{text:'Fire',isCorrect:true},{text:'Earth',isCorrect:false},{text:'Wind',isCorrect:false}] },
  { id: 'east_english_1_020', content: '"白色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 2, options: [{text:'Black',isCorrect:false},{text:'White',isCorrect:true},{text:'Brown',isCorrect:false},{text:'Purple',isCorrect:false}] },
  { id: 'east_english_1_021', content: 'What is "鸟"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Dog',isCorrect:false},{text:'Cat',isCorrect:false},{text:'Bird',isCorrect:true},{text:'Fish',isCorrect:false}] },
  { id: 'east_english_1_022', content: 'What number is "10"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Eight',isCorrect:false},{text:'Nine',isCorrect:false},{text:'Ten',isCorrect:true},{text:'Eleven',isCorrect:false}] },
  { id: 'east_english_1_023', content: 'What is the English for "花"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Tree',isCorrect:false},{text:'Grass',isCorrect:false},{text:'Flower',isCorrect:true},{text:'Leaf',isCorrect:false}] },
  { id: 'east_english_1_024', content: '"黑色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Black',isCorrect:true},{text:'White',isCorrect:false},{text:'Brown',isCorrect:false},{text:'Orange',isCorrect:false}] },
  { id: 'east_english_1_025', content: 'What is "月亮"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Star',isCorrect:false},{text:'Moon',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'east_english_1_026', content: 'How do you spell "fish"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'f-i-s-h',isCorrect:true},{text:'f-i-s-h-h',isCorrect:false},{text:'f-u-s-h',isCorrect:false},{text:'f-a-s-h',isCorrect:false}] },
  { id: 'east_english_1_027', content: 'What is the English for "树"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Flower',isCorrect:false},{text:'Grass',isCorrect:false},{text:'Tree',isCorrect:true},{text:'Leaf',isCorrect:false}] },
  { id: 'east_english_1_028', content: 'What number is "7"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Five',isCorrect:false},{text:'Six',isCorrect:false},{text:'Seven',isCorrect:true},{text:'Eight',isCorrect:false}] },
  { id: 'east_english_1_029', content: 'What is "云"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Moon',isCorrect:false},{text:'Star',isCorrect:false},{text:'Cloud',isCorrect:true}] },
  { id: 'east_english_1_030', content: '"橙色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Red',isCorrect:false},{text:'Yellow',isCorrect:false},{text:'Orange',isCorrect:true},{text:'Pink',isCorrect:false}] },
  { id: 'east_english_1_031', content: 'What is the English for "草"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Tree',isCorrect:false},{text:'Flower',isCorrect:false},{text:'Leaf',isCorrect:false},{text:'Grass',isCorrect:true}] },
  { id: 'east_english_1_032', content: 'What number is "4"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Two',isCorrect:false},{text:'Three',isCorrect:false},{text:'Four',isCorrect:true},{text:'Five',isCorrect:false}] },
  { id: 'east_english_1_033', content: 'What is "星星"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Sun',isCorrect:false},{text:'Moon',isCorrect:false},{text:'Star',isCorrect:true},{text:'Cloud',isCorrect:false}] },
  { id: 'east_english_1_034', content: 'How do you spell "sun"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'s-u-n',isCorrect:true},{text:'s-o-n',isCorrect:false},{text:'s-a-n',isCorrect:false},{text:'s-u-n-n',isCorrect:false}] },
  { id: 'east_english_1_035', content: 'What is the English for "叶"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Tree',isCorrect:false},{text:'Flower',isCorrect:false},{text:'Grass',isCorrect:false},{text:'Leaf',isCorrect:true}] },
  { id: 'east_english_1_036', content: '"紫色" in English is?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Pink',isCorrect:false},{text:'Orange',isCorrect:false},{text:'Purple',isCorrect:true},{text:'Brown',isCorrect:false}] },
  { id: 'east_english_1_037', content: 'What is "桌子"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Chair',isCorrect:false},{text:'Table',isCorrect:true},{text:'Door',isCorrect:false},{text:'Window',isCorrect:false}] },
  { id: 'east_english_1_038', content: 'What number is "9"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Seven',isCorrect:false},{text:'Eight',isCorrect:false},{text:'Nine',isCorrect:true},{text:'Ten',isCorrect:false}] },
  { id: 'east_english_1_039', content: 'What is the English for "门"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'Window',isCorrect:false},{text:'Door',isCorrect:true},{text:'Chair',isCorrect:false},{text:'Table',isCorrect:false}] },
  { id: 'east_english_1_040', content: 'How do you spell "moon"?', type: 'single', difficulty: 1, category: 'english', grade: 3, options: [{text:'m-o-n',isCorrect:false},{text:'m-o-o-n',isCorrect:true},{text:'m-u-n',isCorrect:false},{text:'m-a-n',isCorrect:false}] },
]

// === ENGLISH D2 (30题, grade 4-5) ===
const englishD2Questions: Question[] = [
  { id: 'east_english_2_001', content: 'What is the past tense of "go"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Goed',isCorrect:false},{text:'Gone',isCorrect:false},{text:'Went',isCorrect:true},{text:'Going',isCorrect:false}] },
  { id: 'east_english_2_002', content: 'She ___ to school every day.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'go',isCorrect:false},{text:'goes',isCorrect:true},{text:'going',isCorrect:false},{text:'went',isCorrect:false}] },
  { id: 'east_english_2_003', content: 'What is the plural of "child"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Childs',isCorrect:false},{text:'Children',isCorrect:true},{text:'Childes',isCorrect:false},{text:'Child',isCorrect:false}] },
  { id: 'east_english_2_004', content: 'I have ___ apple.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'a',isCorrect:false},{text:'an',isCorrect:true},{text:'the',isCorrect:false},{text:'some',isCorrect:false}] },
  { id: 'east_english_2_005', content: 'What time is it? 3:00', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:"Three o'clock",isCorrect:true},{text:'Three',isCorrect:false},{text:'Three hours',isCorrect:false},{text:'Three clock',isCorrect:false}] },
  { id: 'east_english_2_006', content: 'My mother ___ cooking.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'likes',isCorrect:true},{text:'like',isCorrect:false},{text:'liking',isCorrect:false},{text:'liked',isCorrect:false}] },
  { id: 'east_english_2_007', content: 'There ___ many books on the desk.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:false},{text:'are',isCorrect:true},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'east_english_2_008', content: 'The opposite of "hot" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'warm',isCorrect:false},{text:'cold',isCorrect:true},{text:'cool',isCorrect:false},{text:'wet',isCorrect:false}] },
  { id: 'east_english_2_009', content: 'What is the past tense of "eat"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Ate',isCorrect:true},{text:'Eated',isCorrect:false},{text:'Eat',isCorrect:false},{text:'Eating',isCorrect:false}] },
  { id: 'east_english_2_010', content: 'He ___ playing football now.', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'was',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'east_english_2_011', content: 'What is the plural of "foot"?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Feets',isCorrect:false},{text:'Foot',isCorrect:false},{text:'Feet',isCorrect:true},{text:'Foots',isCorrect:false}] },
  { id: 'east_english_2_012', content: '___ you like some water?', type: 'single', difficulty: 2, category: 'english', grade: 4, options: [{text:'Does',isCorrect:false},{text:'Do',isCorrect:true},{text:'Are',isCorrect:false},{text:'Can',isCorrect:false}] },
  { id: 'east_english_2_013', content: 'What time is it? 5:30', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Five and half',isCorrect:false},{text:'Half past five',isCorrect:true},{text:'Five half',isCorrect:false},{text:'Half five',isCorrect:false}] },
  { id: 'east_english_2_014', content: 'My sister ___ TV last night.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'watched',isCorrect:true},{text:'watch',isCorrect:false},{text:'watching',isCorrect:false},{text:'watches',isCorrect:false}] },
  { id: 'east_english_2_015', content: 'There ___ a book on the table.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'be',isCorrect:false},{text:'been',isCorrect:false}] },
  { id: 'east_english_2_016', content: 'The opposite of "easy" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'simple',isCorrect:false},{text:'difficult',isCorrect:true},{text:'hard',isCorrect:false},{text:'clear',isCorrect:false}] },
  { id: 'east_english_2_017', content: 'What is the past tense of "see"?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Seed',isCorrect:false},{text:'Saw',isCorrect:true},{text:'Seen',isCorrect:false},{text:'See',isCorrect:false}] },
  { id: 'east_english_2_018', content: 'They ___ basketball yesterday.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'play',isCorrect:false},{text:'plays',isCorrect:false},{text:'played',isCorrect:true},{text:'playing',isCorrect:false}] },
  { id: 'east_english_2_019', content: 'What is the plural of "mouse"?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Mouses',isCorrect:false},{text:'Mice',isCorrect:true},{text:'Mouse',isCorrect:false},{text:'Meese',isCorrect:false}] },
  { id: 'east_english_2_020', content: '___ you go to school by bus?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Does',isCorrect:false},{text:'Do',isCorrect:true},{text:'Are',isCorrect:false},{text:'Can',isCorrect:false}] },
  { id: 'east_english_2_021', content: 'What time is it? 2:15', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Two fifteen',isCorrect:false},{text:'Quarter past two',isCorrect:true},{text:'Fifteen two',isCorrect:false},{text:'Two and quarter',isCorrect:false}] },
  { id: 'east_english_2_022', content: 'He ___ reading a book now.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'am',isCorrect:false},{text:'is',isCorrect:true},{text:'are',isCorrect:false},{text:'was',isCorrect:false}] },
  { id: 'east_english_2_023', content: 'What is the past tense of "run"?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Runned',isCorrect:false},{text:'Run',isCorrect:false},{text:'Ran',isCorrect:true},{text:'Running',isCorrect:false}] },
  { id: 'east_english_2_024', content: 'The book belongs ___ me.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'at',isCorrect:false},{text:'in',isCorrect:false},{text:'to',isCorrect:true},{text:'on',isCorrect:false}] },
  { id: 'east_english_2_025', content: 'What is the plural of "sheep"?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Sheeps',isCorrect:false},{text:'Sheep',isCorrect:true},{text:'Sheepes',isCorrect:false},{text:'Sheeps',isCorrect:false}] },
  { id: 'east_english_2_026', content: 'I ___ my homework yesterday.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'did',isCorrect:true},{text:'do',isCorrect:false},{text:'does',isCorrect:false},{text:'doing',isCorrect:false}] },
  { id: 'east_english_2_027', content: 'What time is it? 4:45', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Four forty-five',isCorrect:false},{text:'Quarter to five',isCorrect:true},{text:'Four and quarter',isCorrect:false},{text:'Five quarter',isCorrect:false}] },
  { id: 'east_english_2_028', content: 'She ___ beautiful flowers.', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'has',isCorrect:true},{text:'have',isCorrect:false},{text:'having',isCorrect:false},{text:'had',isCorrect:false}] },
  { id: 'east_english_2_029', content: 'The opposite of "fast" is ___', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'quick',isCorrect:false},{text:'rapid',isCorrect:false},{text:'slow',isCorrect:true},{text:'speed',isCorrect:false}] },
  { id: 'east_english_2_030', content: 'What is the past tense of "write"?', type: 'single', difficulty: 2, category: 'english', grade: 5, options: [{text:'Writed',isCorrect:false},{text:'Written',isCorrect:false},{text:'Wrote',isCorrect:true},{text:'Write',isCorrect:false}] },
]

// === ENGLISH D3 (20题, grade 6-7) ===
const englishD3Questions: Question[] = [
  { id: 'east_english_3_001', content: 'If I ___ you, I would study harder.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_002', content: 'She has ___ finished her homework.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'yet',isCorrect:false},{text:'already',isCorrect:true},{text:'still',isCorrect:false},{text:'ever',isCorrect:false}] },
  { id: 'east_english_3_003', content: 'The book ___ by Tom.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'wrote',isCorrect:false},{text:'is written',isCorrect:true},{text:'writes',isCorrect:false},{text:'writing',isCorrect:false}] },
  { id: 'east_english_3_004', content: 'Neither you nor I ___ right.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'am',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_005', content: 'I have been learning English ___ three years.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'since',isCorrect:false},{text:'for',isCorrect:true},{text:'in',isCorrect:false},{text:'on',isCorrect:false}] },
  { id: 'east_english_3_006', content: 'Which sentence is correct?', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'He doesn\'t know',isCorrect:true},{text:'He don\'t knows',isCorrect:false},{text:'He doesn\'t knows',isCorrect:false},{text:'He don\'t know',isCorrect:false}] },
  { id: 'east_english_3_007', content: 'The teacher asked us ___ the exercise.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'complete',isCorrect:false},{text:'to complete',isCorrect:true},{text:'completing',isCorrect:false},{text:'completed',isCorrect:false}] },
  { id: 'east_english_3_008', content: 'By the time I arrived, they ___ all the cake.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'ate',isCorrect:false},{text:'had eaten',isCorrect:true},{text:'have eaten',isCorrect:false},{text:'were eating',isCorrect:false}] },
  { id: 'east_english_3_009', content: 'If he ___ here, he would help us.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'is',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_010', content: 'The letter ___ yesterday.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'sent',isCorrect:false},{text:'was sent',isCorrect:true},{text:'is sent',isCorrect:false},{text:'has sent',isCorrect:false}] },
  { id: 'east_english_3_011', content: 'Not only ___ late, but also forgot his books.', type: 'single', difficulty: 3, category: 'english', grade: 6, options: [{text:'he was',isCorrect:false},{text:'was he',isCorrect:false},{text:'he is',isCorrect:false},{text:'is he',isCorrect:false}] },
  { id: 'east_english_3_012', content: 'I wish I ___ a doctor.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'am',isCorrect:false},{text:'was',isCorrect:false},{text:'were',isCorrect:true},{text:'be',isCorrect:false}] },
  { id: 'east_english_3_013', content: 'This is the best book I ___ ever read.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'has',isCorrect:false},{text:'have',isCorrect:true},{text:'had',isCorrect:false},{text:'having',isCorrect:false}] },
  { id: 'east_english_3_014', content: 'The homework must ___ today.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'finish',isCorrect:false},{text:'finishes',isCorrect:false},{text:'be finished',isCorrect:true},{text:'finished',isCorrect:false}] },
  { id: 'east_english_3_015', content: 'He asked me where I ___.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'live',isCorrect:false},{text:'lived',isCorrect:true},{text:'living',isCorrect:false},{text:'am living',isCorrect:false}] },
  { id: 'east_english_3_016', content: 'I would have gone ___ I was busy.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'but',isCorrect:true},{text:'and',isCorrect:false},{text:'or',isCorrect:false},{text:'so',isCorrect:false}] },
  { id: 'east_english_3_017', content: 'She ___ the movie before.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'saw',isCorrect:false},{text:'has seen',isCorrect:true},{text:'see',isCorrect:false},{text:'seen',isCorrect:false}] },
  { id: 'east_english_3_018', content: '___ the weather is nice, we can go out.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'If',isCorrect:false},{text:'Unless',isCorrect:false},{text:'Since',isCorrect:true},{text:'Because',isCorrect:false}] },
  { id: 'east_english_3_019', content: 'The boy is too young ___ the exam.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'to take',isCorrect:true},{text:'taking',isCorrect:false},{text:'took',isCorrect:false},{text:'takes',isCorrect:false}] },
  { id: 'east_english_3_020', content: 'Hardly had I arrived ___ it started to rain.', type: 'single', difficulty: 3, category: 'english', grade: 7, options: [{text:'when',isCorrect:true},{text:'than',isCorrect:false},{text:'after',isCorrect:false},{text:'before',isCorrect:false}] },
]

// === ENGLISH D4 (8题, grade 8) ===
const englishD4Questions: Question[] = [
  { id: 'east_english_4_001', content: 'The passive voice of "They are building a house" is ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'A house is being built',isCorrect:true},{text:'A house is building',isCorrect:false},{text:'A house was built',isCorrect:false},{text:'A house is built',isCorrect:false}] },
  { id: 'east_english_4_002', content: 'I suggest that he ___ the doctor.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'see',isCorrect:true},{text:'to see',isCorrect:false},{text:'seeing',isCorrect:false},{text:'saw',isCorrect:false}] },
  { id: 'east_english_4_003', content: 'Which word is an adverb?', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Beautiful',isCorrect:false},{text:'Quickly',isCorrect:true},{text:'Happy',isCorrect:false},{text:'Tall',isCorrect:false}] },
  { id: 'east_english_4_004', content: '___ the rain, we stayed home.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'Because',isCorrect:false},{text:'Because of',isCorrect:true},{text:'Since',isCorrect:false},{text:'As result of',isCorrect:false}] },
  { id: 'east_english_4_005', content: 'He acted ___ he had seen a ghost.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'as if',isCorrect:true},{text:'like',isCorrect:false},{text:'that',isCorrect:false},{text:'what',isCorrect:false}] },
  { id: 'east_english_4_006', content: 'The word "immediately" is a/an ___', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'adjective',isCorrect:false},{text:'verb',isCorrect:false},{text:'adverb',isCorrect:true},{text:'conjunction',isCorrect:false}] },
  { id: 'east_english_4_007', content: 'It is essential that every student ___ on time.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'be',isCorrect:true},{text:'is',isCorrect:false},{text:'are',isCorrect:false},{text:'will be',isCorrect:false}] },
  { id: 'east_english_4_008', content: 'I would rather you ___ anything about it.', type: 'single', difficulty: 4, category: 'english', grade: 8, options: [{text:'don\'t say',isCorrect:false},{text:'didn\'t say',isCorrect:true},{text:'won\'t say',isCorrect:false},{text:'haven\'t said',isCorrect:false}] },
]

// === ENGLISH D5 (25题, grade 9) ===
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