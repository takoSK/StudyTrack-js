export interface DailyTask {
  id: string
  weekId: string
  weeklyTaskId: string
  bookId: string
  bookName: string
  pageStart: number
  pageEnd: number
  priority: string
  completed: boolean
}

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface StudyBook {
  id: string
  name: string
  subject: string
  totalPages: number
  completedPages: number
  monthlyTarget: number
}

export interface WeeklyPlan {
  week: number
  pageStart: number
  pageEnd: number
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  icon: string
}

export interface StudyStats {
  day: string
  minutes: number
}

export interface SubjectDistribution {
  subject: string
  percentage: number
  color: string
}

export interface UserProfile {
  id: string
  name: string
  totalPoints: number
  tasksCompleted: number
  totalStudyMinutes: number
}

export interface TextbookRange {
  id: string
  bookId: string
  bookName: string
  subject: string
  startPage: number
  endPage: number
}

export interface WeeklyTask {
  id: string
  weekId: string
  bookId: string
  bookName: string
  startPage: number
  endPage: number
  priority: string
}