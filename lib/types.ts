import { Timestamp } from "firebase/firestore"

export interface UserProfile {
  id: string
  name: string
  totalPoints: number
  tasksCompleted: number
  totalStudyMinutes: number
}

export interface StudyBook {
  id: string
  name: string
  subject: string
  totalPages: number
  completedPages: number
}

export interface DailyTask {
  id: string
  date: Timestamp
  bookId: string
  weeklyTaskId: string
  bookName: string
  pageStart: number
  pageEnd: number
  priority: Priority
  completed: boolean
  weekday: Day
  subject: string
}

export interface WeeklyTask {
  id: string
  weekId: string
  bookId: string
  bookName: string
  startPage: number
  endPage: number
  priority: Priority
  subject: string
  isDistributed: boolean
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
}

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type Priority = "high" | "medium" | "low"



export interface StudyStats {
  day: string
  minutes: number
}

export interface SubjectDistribution {
  subject: string
  percentage: number
  color: string
}

export interface TextbookRange {
  id: string
  bookId: string
  bookName: string
  subject: string
  startPage: number
  endPage: number
}
