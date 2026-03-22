import { Timestamp } from "firebase/firestore"

export interface UserProfile {
  id: string
  name: string

  points: number
  totalStudyMinutes: number

  streak: number
  lastStudyDate: Timestamp
}

export interface StudyBook {
  id: string
  name: string
  subject: string
  
  totalPages: number
  completedPages: number

  createdAt: Timestamp
}

export interface Task {
  id: string

  bookId: string
  bookName: string
  subject: string

  type: Type

  startPage?: number
  endPage?: number
  currentPage?: number

  totalCount?: number
  completedCount?: number

  estimatedMinutes: number

  status: Status
  
  priority: Priority

  points: number

  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Mistake {
  id: string

  taskId: string

  page: number
  note?: string

  nextReviewAt: Timestamp
  reviewCount: number

  status: "lerning" | "mastered"

  createdAt: Timestamp
}

export interface Week {
  id: string

  startDate: Timestamp
  endDate: Timestamp

  targetMinutes: number
  userMinutes: number

  createdAt: Timestamp
}

export interface Reward {
  id: string

  name: string
  description: string

  pointsCost: number

  createdAt: Timestamp
}

export type Priority = "high" | "medium" | "low"

export type Type = "section" | "volume"

export type Status = "active" | "done"