export interface StudyTask {
  id: string
  subject: string
  bookName: string
  pageStart: number
  pageEnd: number
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  studyTime?: number
}

export interface StudyBook {
  id: string
  name: string
  subject: string
  totalPages: number
  completedPages: number
  monthlyTarget: number
  weeklyPlan: WeeklyPlan[]
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
  name: string
  totalPoints: number
  tasksCompleted: number
  totalStudyMinutes: number
}
