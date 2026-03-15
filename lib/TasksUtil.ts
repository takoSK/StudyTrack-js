import { Timestamp } from "firebase/firestore"
import { DailyTask, Day } from "./types"
import { WeeklyTask } from './types'

const dayNames: Day[] = [
  'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
]



export function distributeTask(task: WeeklyTask, days: Date[], weights: number[]) : Omit<DailyTask,"id">[] {
  const totalPages = task.endPage - task.startPage + 1
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  const dailyTasks: Omit<DailyTask,"id">[] = []
  let currentPage = task.startPage

  for ( let i = 0; i < days.length; i++ ) {
    if ( weights[i] === 0 ) continue

    const pages = Math.round(totalPages * (weights[i] / totalWeight))

    const start = currentPage
    const end = Math.min(currentPage + pages - 1, task.endPage)
  
    dailyTasks.push({
      date: Timestamp.fromDate(days[i]),
      bookId: task.bookId,
      weeklyTaskId: task.id,
      bookName: task.bookName,
      pageStart: start,
      pageEnd: end,
      priority: task.priority,
      completed:false,
      weekday: dayNames[i],
      subject: task.subject,
    })

    currentPage = end + 1
    if ( currentPage > task.endPage ) break
  }
  
  return dailyTasks
}

export function calcPoint(time: number,priority: string) {
  if (priority === "low") {
    return time * 1
  }
  if (priority === "medium") {
    return time * 2
  }
  if (priority === "high") {
    return time * 3
  }
}