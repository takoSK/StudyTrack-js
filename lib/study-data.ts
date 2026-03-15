import type { StudyBook, Reward, StudyStats, SubjectDistribution, UserProfile } from './types'

export const weeklyStudyStats: StudyStats[] = [
  { day: 'Mon', minutes: 120 },
  { day: 'Tue', minutes: 90 },
  { day: 'Wed', minutes: 150 },
  { day: 'Thu', minutes: 80 },
  { day: 'Fri', minutes: 110 },
  { day: 'Sat', minutes: 180 },
  { day: 'Sun', minutes: 60 },
]

export const subjectDistribution: SubjectDistribution[] = [
  { subject: 'Math', percentage: 35, color: '#4f6bcc' },
  { subject: 'Physics', percentage: 25, color: '#5ba3d9' },
  { subject: 'Chemistry', percentage: 22, color: '#68c4b8' },
  { subject: 'English', percentage: 18, color: '#95b8d1' },
]

export const userProfile: UserProfile = {
  id: 'user-1',
  name: 'Alex',
  totalPoints: 450,
  tasksCompleted: 42,
  totalStudyMinutes: 1850,
}
