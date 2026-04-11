/**
 * Question Bank Importer
 *
 * This script processes the question JSON files from docs/superpowers/specs/questions/
 * and generates src/data/questions/graded.ts with properly formatted questions for the game.
 *
 * Grade to Difficulty Mapping:
 * - Grade 1-2 → Difficulty 1 (East Ocean)
 * - Grade 3-4 → Difficulty 2 (East/West Ocean)
 * - Grade 5-6 → Difficulty 3 (West/South Ocean)
 * - Grade 7-8 → Difficulty 4 (South/North Ocean)
 * - Grade 9 → Difficulty 5 (North/Mysterious Ocean)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS_QUESTIONS_PATH = path.join(__dirname, '../docs/superpowers/specs/questions')
const OUTPUT_PATH = path.join(__dirname, '../src/data/questions/graded.ts')

// Grade to difficulty mapping
function gradeToDifficulty(grade: number): number {
  if (grade <= 2) return 1
  if (grade <= 4) return 2
  if (grade <= 6) return 3
  if (grade <= 8) return 4
  return 5
}

// Subject mapping from file names
const subjectMap: Record<string, string> = {
  'chinese': 'chinese',
  'math': 'math',
  'english': 'english',
  'chinese': 'chinese',
  'physics': 'science',
  'chemistry': 'science',
}

// Categories in the game
const categoryMap: Record<string, string> = {
  'chinese': 'chinese',
  'math': 'math',
  'english': 'english',
  'e': 'english',
  'm': 'math',
  'c': 'chinese',
  'p': 'science',
  'physics': 'science',
  'chemistry': 'science',
  'n': 'science',  // nature/science
}

interface RawQuestion {
  id: string
  content: string
  type?: string
  difficulty?: number
  category?: string
  grade?: number
  knowledgePoints: string[]
  options: Array<{
    text: string
    isCorrect: boolean
  }>
}

interface RawQuestionBank {
  grade: number
  subject: string
  questions: RawQuestion[]
}

function processQuestion(raw: RawQuestion, subject: string) {
  // Convert to game format - use subject to determine category
  const gameCategory = categoryMap[subject] || 'general'

  return {
    id: raw.id,
    content: raw.content,
    type: 'single' as const,
    difficulty: gradeToDifficulty(raw.grade || 1) as 1 | 2 | 3 | 4 | 5,
    category: gameCategory as 'math' | 'chinese' | 'english' | 'science' | 'general',
    options: raw.options.map(opt => ({
      text: opt.text,
      isCorrect: opt.isCorrect,
    })),
    grade: raw.grade || 1,
  }
}

function processDirectory(dirPath: string, grade: number, subject: string): any[] {
  const questions: any[] = []
  const filePath = path.join(dirPath, 'questions.json')

  if (!fs.existsSync(filePath)) {
    console.warn(`  Warning: ${filePath} not found`)
    return questions
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data: RawQuestionBank = JSON.parse(content)

    for (const rawQ of data.questions) {
      questions.push(processQuestion(rawQ, data.subject))
    }
  } catch (e) {
    console.error(`  Error reading ${filePath}: ${e}`)
  }

  return questions
}

function walkDirectories(basePath: string): Map<string, any[]> {
  const questionsByGradeSubject = new Map<string, any[]>()

  // Primary (grades 1-6)
  const primaryPath = path.join(basePath, 'primary')
  if (fs.existsSync(primaryPath)) {
    for (const gradeDir of fs.readdirSync(primaryPath)) {
      const gradeMatch = gradeDir.match(/^g(\d+)$/)
      if (!gradeMatch) continue
      const grade = parseInt(gradeMatch[1])

      const gradePath = path.join(primaryPath, gradeDir)
      for (const subjectDir of fs.readdirSync(gradePath)) {
        const subjectPath = path.join(gradePath, subjectDir)
        if (!fs.statSync(subjectPath).isDirectory()) continue

        const subjectMatch = subjectDir.match(/^g\d+-(.+)$/)
        if (!subjectMatch) continue
        const subject = subjectMatch[1]

        const key = `g${grade}_${subject}`
        const questions = processDirectory(subjectPath, grade, subject)
        if (questions.length > 0) {
          questionsByGradeSubject.set(key, questions)
          console.log(`  ${key}: ${questions.length} questions`)
        }
      }
    }
  }

  // Middle (grades 7-9)
  const middlePath = path.join(basePath, 'middle')
  if (fs.existsSync(middlePath)) {
    for (const gradeDir of fs.readdirSync(middlePath)) {
      const gradeMatch = gradeDir.match(/^g(\d+)$/)
      if (!gradeMatch) continue
      const grade = parseInt(gradeMatch[1])

      const gradePath = path.join(middlePath, gradeDir)
      for (const subjectDir of fs.readdirSync(gradePath)) {
        const subjectPath = path.join(gradePath, subjectDir)
        if (!fs.statSync(subjectPath).isDirectory()) continue

        const subjectMatch = subjectDir.match(/^g\d+-(.+)$/)
        if (!subjectMatch) continue
        const subject = subjectMatch[1]

        const key = `g${grade}_${subject}`
        const questions = processDirectory(subjectPath, grade, subject)
        if (questions.length > 0) {
          questionsByGradeSubject.set(key, questions)
          console.log(`  ${key}: ${questions.length} questions`)
        }
      }
    }
  }

  return questionsByGradeSubject
}

function generateTypeScript(questionsByGradeSubject: Map<string, any[]>): string {
  const lines: string[] = [
    `// Auto-generated by scripts/question-bank-importer.ts`,
    `// DO NOT EDIT MANUALLY`,
    ``,
    `import type { Question } from '../../game/types'`,
    ``,
    `export interface GradeSubjectKey`,
    `{`,
    `  grade: number`,
    `  subject: 'chinese' | 'math' | 'english' | 'science'`,
    `}`,
    ``,
  ]

  // Generate all questions array
  lines.push(`export const allGradedQuestions: Question[] = [`)

  const questionsArray: Array<{ key: string; q: any }> = []
  for (const [key, questions] of questionsByGradeSubject) {
    for (const q of questions) {
      questionsArray.push({ key, q })
    }
  }

  for (const { key, q } of questionsArray) {
    lines.push(`  // ${key}`)
    lines.push(`  {`)
    lines.push(`    id: '${q.id}',`)
    lines.push(`    content: ${JSON.stringify(q.content)},`)
    lines.push(`    type: '${q.type}' as const,`)
    lines.push(`    difficulty: ${q.difficulty} as 1 | 2 | 3 | 4 | 5,`)
    lines.push(`    category: '${q.category}' as const,`)
    lines.push(`    grade: ${q.grade},`)
    lines.push(`    options: [`)
    for (const opt of q.options) {
      lines.push(`      { text: ${JSON.stringify(opt.text)}, isCorrect: ${opt.isCorrect} },`)
    }
    lines.push(`    ],`)
    lines.push(`  },`)
  }

  lines.push(`]`)
  lines.push(``)

  // Generate index by grade and subject
  lines.push(`export function getQuestionsByGradeAndSubject(`)
  lines.push(`  grade: number,`)
  lines.push(`  subject: 'chinese' | 'math' | 'english' | 'science'`)
  lines.push(`): Question[] {`)
  lines.push(`  return allGradedQuestions.filter(q => q.grade === grade && q.category === subject)`)
  lines.push(`}`)
  lines.push(``)

  // Generate index by difficulty
  lines.push(`export function getQuestionsByDifficulty(difficulty: number): Question[] {`)
  lines.push(`  return allGradedQuestions.filter(q => q.difficulty === difficulty)`)
  lines.push(`}`)
  lines.push(``)

  // Generate question count summary
  lines.push(`export const questionBankSummary = {`)
  for (const [key, questions] of questionsByGradeSubject) {
    lines.push(`  '${key}': ${questions.length},`)
  }
  lines.push(`}`)
  lines.push(``)

  // Generate available grades and subjects
  lines.push(`export const availableGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9]`)
  lines.push(`export const availableSubjects = ['chinese', 'math', 'english', 'science'] as const`)
  lines.push(`export type Subject = typeof availableSubjects[number]`)

  return lines.join('\n')
}

function main() {
  console.log('Question Bank Importer')
  console.log('======================')
  console.log(`Source: ${DOCS_QUESTIONS_PATH}`)
  console.log(`Output: ${OUTPUT_PATH}`)
  console.log()

  if (!fs.existsSync(DOCS_QUESTIONS_PATH)) {
    console.error(`Error: Source path does not exist: ${DOCS_QUESTIONS_PATH}`)
    process.exit(1)
  }

  console.log('Processing question files...')
  const questionsByGradeSubject = walkDirectories(DOCS_QUESTIONS_PATH)
  console.log()

  console.log(`Total: ${questionsByGradeSubject.size} grade-subject combinations`)

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Generate TypeScript
  const tsContent = generateTypeScript(questionsByGradeSubject)
  fs.writeFileSync(OUTPUT_PATH, tsContent, 'utf-8')

  console.log(`Generated: ${OUTPUT_PATH}`)
  console.log('Done!')
}

main()