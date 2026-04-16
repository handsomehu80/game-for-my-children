import { Question } from '../../game/types'

// Import questions from subject files
import { mathQuestions } from './subjects/math'
import { chineseQuestions } from './subjects/chinese'
import { englishQuestions } from './subjects/english'
import { scienceQuestions } from './subjects/science'
import { physicsQuestions } from './subjects/physics'
import { chemistryQuestions } from './subjects/chemistry'
import { historyQuestions } from './subjects/history'

// Aggregate all questions into a single pool
export const allQuestions: Question[] = [
  ...mathQuestions,
  ...chineseQuestions,
  ...englishQuestions,
  ...scienceQuestions,
  ...physicsQuestions,
  ...chemistryQuestions,
  ...historyQuestions,
]

export { getRandomQuestion } from '../../game/QuestionSelector'