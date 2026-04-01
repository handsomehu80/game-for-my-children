import { Question } from '../../game/types'

// Question bank organized by difficulty (1-5)
export const questionsData: Question[] = [
  // Difficulty 1 - East Ocean (Basic knowledge)
  {
    id: 'q1',
    content: '1 + 1 = ?',
    type: 'single',
    difficulty: 1,
    category: 'math',
    options: [
      { text: '1', isCorrect: false },
      { text: '2', isCorrect: true },
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: false },
    ],
  },
  {
    id: 'q2',
    content: '太阳从哪里升起？',
    type: 'single',
    difficulty: 1,
    category: 'general',
    options: [
      { text: '西方', isCorrect: false },
      { text: '南方', isCorrect: false },
      { text: '东方', isCorrect: true },
      { text: '北方', isCorrect: false },
    ],
  },
  {
    id: 'q3',
    content: '苹果是什么颜色？',
    type: 'single',
    difficulty: 1,
    category: 'general',
    options: [
      { text: '蓝色', isCorrect: false },
      { text: '绿色', isCorrect: false },
      { text: '红色', isCorrect: true },
      { text: '紫色', isCorrect: false },
    ],
  },
  // Difficulty 2 - West Ocean
  {
    id: 'q4',
    content: '5 + 7 = ?',
    type: 'single',
    difficulty: 2,
    category: 'math',
    options: [
      { text: '11', isCorrect: false },
      { text: '12', isCorrect: true },
      { text: '13', isCorrect: false },
      { text: '14', isCorrect: false },
    ],
  },
  {
    id: 'q5',
    content: '一年有多少个月？',
    type: 'single',
    difficulty: 2,
    category: 'general',
    options: [
      { text: '10', isCorrect: false },
      { text: '11', isCorrect: false },
      { text: '12', isCorrect: true },
      { text: '13', isCorrect: false },
    ],
  },
  {
    id: 'q6',
    content: '水的沸腾温度是多少？',
    type: 'single',
    difficulty: 2,
    category: 'science',
    options: [
      { text: '50度', isCorrect: false },
      { text: '80度', isCorrect: false },
      { text: '100度', isCorrect: true },
      { text: '120度', isCorrect: false },
    ],
  },
  // Difficulty 3 - South Ocean
  {
    id: 'q7',
    content: '12 × 8 = ?',
    type: 'single',
    difficulty: 3,
    category: 'math',
    options: [
      { text: '86', isCorrect: false },
      { text: '96', isCorrect: true },
      { text: '106', isCorrect: false },
      { text: '98', isCorrect: false },
    ],
  },
  {
    id: 'q8',
    content: '世界上最长的河是？',
    type: 'single',
    difficulty: 3,
    category: 'general',
    options: [
      { text: '亚马逊河', isCorrect: false },
      { text: '长江', isCorrect: false },
      { text: '尼罗河', isCorrect: true },
      { text: '密西西比河', isCorrect: false },
    ],
  },
  {
    id: 'q9',
    content: '光速约为多少？',
    type: 'single',
    difficulty: 3,
    category: 'science',
    options: [
      { text: '3×10⁶ m/s', isCorrect: false },
      { text: '3×10⁷ m/s', isCorrect: false },
      { text: '3×10⁸ m/s', isCorrect: true },
      { text: '3×10⁹ m/s', isCorrect: false },
    ],
  },
  // Difficulty 4 - North Ocean
  {
    id: 'q10',
    content: '144 ÷ 12 = ?',
    type: 'single',
    difficulty: 4,
    category: 'math',
    options: [
      { text: '11', isCorrect: false },
      { text: '12', isCorrect: true },
      { text: '13', isCorrect: false },
      { text: '14', isCorrect: false },
    ],
  },
  {
    id: 'q11',
    content: 'DNA的全称是？',
    type: 'single',
    difficulty: 4,
    category: 'science',
    options: [
      { text: '脱氧核糖核酸', isCorrect: true },
      { text: '核糖核酸', isCorrect: false },
      { text: '蛋白质', isCorrect: false },
      { text: '氨基酸', isCorrect: false },
    ],
  },
  {
    id: 'q12',
    content: '地球到月亮的距离约为？',
    type: 'single',
    difficulty: 4,
    category: 'science',
    options: [
      { text: '38万公里', isCorrect: true },
      { text: '380万公里', isCorrect: false },
      { text: '3800万公里', isCorrect: false },
      { text: '38000万公里', isCorrect: false },
    ],
  },
  // Difficulty 5 - Mysterious Ocean
  {
    id: 'q13',
    content: '∫x²dx = ?',
    type: 'single',
    difficulty: 5,
    category: 'math',
    options: [
      { text: 'x³/3 + C', isCorrect: true },
      { text: '2x + C', isCorrect: false },
      { text: 'x³ + C', isCorrect: false },
      { text: '3x² + C', isCorrect: false },
    ],
  },
  {
    id: 'q14',
    content: '相对论的公式是？',
    type: 'single',
    difficulty: 5,
    category: 'science',
    options: [
      { text: 'E = mc²', isCorrect: true },
      { text: 'E = mv²', isCorrect: false },
      { text: 'E = mgh', isCorrect: false },
      { text: 'E = pt', isCorrect: false },
    ],
  },
  {
    id: 'q15',
    content: '量子力学中，不确定性原理是谁提出的？',
    type: 'single',
    difficulty: 5,
    category: 'science',
    options: [
      { text: '爱因斯坦', isCorrect: false },
      { text: '薛定谔', isCorrect: false },
      { text: '海森堡', isCorrect: true },
      { text: '玻尔', isCorrect: false },
    ],
  },
]

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return questionsData.filter((q) => q.difficulty <= difficulty)
}

export function getRandomQuestion(difficulty: number): Question {
  const questions = getQuestionsByDifficulty(difficulty)
  return questions[Math.floor(Math.random() * questions.length)]
}
