import type { StudyTask, StudyBook, Reward, StudyStats, SubjectDistribution, UserProfile, Weekday } from './types'

export const initialTasks: StudyTask[] = [
  {
    id: '1',
    subject: 'Mathematics',
    bookName: 'Advanced Calculus',
    pageStart: 21,
    pageEnd: 30,
    priority: 'high',
    completed: false,
    weekday: 'monday',
  },
  {
    id: '2',
    subject: 'Physics',
    bookName: 'Mechanics & Waves',
    pageStart: 45,
    pageEnd: 52,
    priority: 'medium',
    completed: false,
    weekday: 'monday',
  },
  {
    id: '3',
    subject: 'English',
    bookName: 'Grammar Fundamentals',
    pageStart: 88,
    pageEnd: 95,
    priority: 'low',
    completed: false,
    weekday: 'tuesday',
  },
  {
    id: '4',
    subject: 'Chemistry',
    bookName: 'Organic Chemistry',
    pageStart: 112,
    pageEnd: 120,
    priority: 'medium',
    completed: false,
    weekday: 'wednesday',
  },
]

// Weekly tasks data matching the specification
export const weeklyTasks: StudyTask[] = [
  // Monday
  {
    id: 'wt-1',
    subject: 'Math',
    bookName: 'Blue Chart',
    pageStart: 45,
    pageEnd: 50,
    priority: 'high',
    completed: true,
    studyTime: 30,
    weekday: 'monday',
  },
  {
    id: 'wt-2',
    subject: 'English',
    bookName: 'Target 1900',
    pageStart: 120,
    pageEnd: 150,
    priority: 'medium',
    completed: false,
    weekday: 'monday',
  },
  // Tuesday
  {
    id: 'wt-3',
    subject: 'Physics',
    bookName: 'Ryoumon no Kaze',
    pageStart: 30,
    pageEnd: 35,
    priority: 'high',
    completed: true,
    studyTime: 45,
    weekday: 'tuesday',
  },
  {
    id: 'wt-4',
    subject: 'Math',
    bookName: 'Blue Chart',
    pageStart: 51,
    pageEnd: 60,
    priority: 'medium',
    completed: false,
    weekday: 'tuesday',
  },
  // Wednesday
  {
    id: 'wt-5',
    subject: 'Chemistry',
    bookName: 'Kagaku no Shin Kenkyu',
    pageStart: 80,
    pageEnd: 95,
    priority: 'low',
    completed: false,
    weekday: 'wednesday',
  },
  // Thursday
  {
    id: 'wt-6',
    subject: 'English',
    bookName: 'Target 1900',
    pageStart: 151,
    pageEnd: 180,
    priority: 'high',
    completed: true,
    studyTime: 40,
    weekday: 'thursday',
  },
  {
    id: 'wt-7',
    subject: 'Math',
    bookName: 'Blue Chart',
    pageStart: 61,
    pageEnd: 70,
    priority: 'medium',
    completed: false,
    weekday: 'thursday',
  },
  // Friday
  {
    id: 'wt-8',
    subject: 'Physics',
    bookName: 'Ryoumon no Kaze',
    pageStart: 36,
    pageEnd: 45,
    priority: 'medium',
    completed: false,
    weekday: 'friday',
  },
  // Saturday
  {
    id: 'wt-9',
    subject: 'Math',
    bookName: 'Blue Chart',
    pageStart: 71,
    pageEnd: 85,
    priority: 'high',
    completed: false,
    weekday: 'saturday',
  },
  {
    id: 'wt-10',
    subject: 'English',
    bookName: 'Target 1900',
    pageStart: 181,
    pageEnd: 200,
    priority: 'low',
    completed: false,
    weekday: 'saturday',
  },
]

export const availableBooks = [
  { id: 'b1', name: 'Blue Chart', subject: 'Math' },
  { id: 'b2', name: 'Target 1900', subject: 'English' },
  { id: 'b3', name: 'Ryoumon no Kaze', subject: 'Physics' },
  { id: 'b4', name: 'Kagaku no Shin Kenkyu', subject: 'Chemistry' },
]

export const studyBooks: StudyBook[] = [
  {
    id: '1',
    name: 'Advanced Calculus',
    subject: 'Mathematics',
    totalPages: 320,
    completedPages: 85,
    monthlyTarget: 80,
    weeklyPlan: [
      { week: 1, pageStart: 86, pageEnd: 105 },
      { week: 2, pageStart: 106, pageEnd: 125 },
      { week: 3, pageStart: 126, pageEnd: 145 },
      { week: 4, pageStart: 146, pageEnd: 165 },
    ],
  },
  {
    id: '2',
    name: 'Mechanics & Waves',
    subject: 'Physics',
    totalPages: 280,
    completedPages: 120,
    monthlyTarget: 60,
    weeklyPlan: [
      { week: 1, pageStart: 121, pageEnd: 135 },
      { week: 2, pageStart: 136, pageEnd: 150 },
      { week: 3, pageStart: 151, pageEnd: 165 },
      { week: 4, pageStart: 166, pageEnd: 180 },
    ],
  },
  {
    id: '3',
    name: 'Organic Chemistry',
    subject: 'Chemistry',
    totalPages: 400,
    completedPages: 200,
    monthlyTarget: 100,
    weeklyPlan: [
      { week: 1, pageStart: 201, pageEnd: 225 },
      { week: 2, pageStart: 226, pageEnd: 250 },
      { week: 3, pageStart: 251, pageEnd: 275 },
      { week: 4, pageStart: 276, pageEnd: 300 },
    ],
  },
  {
    id: '4',
    name: 'Grammar Fundamentals',
    subject: 'English',
    totalPages: 180,
    completedPages: 95,
    monthlyTarget: 40,
    weeklyPlan: [
      { week: 1, pageStart: 96, pageEnd: 105 },
      { week: 2, pageStart: 106, pageEnd: 115 },
      { week: 3, pageStart: 116, pageEnd: 125 },
      { week: 4, pageStart: 126, pageEnd: 135 },
    ],
  },
]

export const rewards: Reward[] = [
  {
    id: '1',
    name: 'Watch YouTube',
    description: '30 minutes of free time',
    pointsCost: 100,
    icon: 'play',
  },
  {
    id: '2',
    name: 'Eat Dessert',
    description: 'Treat yourself to something sweet',
    pointsCost: 75,
    icon: 'cake',
  },
  {
    id: '3',
    name: 'Play Games',
    description: '1 hour of gaming',
    pointsCost: 150,
    icon: 'gamepad',
  },
  {
    id: '4',
    name: 'Social Media',
    description: '20 minutes browsing',
    pointsCost: 50,
    icon: 'smartphone',
  },
  {
    id: '5',
    name: 'Movie Night',
    description: 'Watch a full movie',
    pointsCost: 200,
    icon: 'film',
  },
]

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
  name: 'Alex',
  totalPoints: 450,
  tasksCompleted: 42,
  totalStudyMinutes: 1850,
}
