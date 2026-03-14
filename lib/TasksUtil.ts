import { WeeklyTask } from './types'

export function distributeTasks(
  tasks: WeeklyTask[],
  days: Date[],
  weights: number[]
) {
  return tasks.flatMap(task =>
    distributeTask(task, days, weights)
  )
}

function distributeTask(task: WeeklyTask, days: Date[], weights: number[]) {
  const totalPages = task.endPage - task.startPage + 1
  const totalWeight = weights.reduce((sum, w) => sum + w, 0)

  const dailyTasks = []
  let currentPage = task.startPage

  for ( let i = 0; i < days.length; i++ ) {
    if ( weights[i] === 0 ) continue

    const pages = Math.round(totalPages * (weights[i] / totalWeight))

    const start = currentPage
    const end = Math.min(currentPage + pages - 1, task.endPage)
  
    dailyTasks.push({
      weekId: task.weekId,
      weeklyTaskId: task.id,
      bookId: task.bookId,
      bookName: task.bookName,
      pageStart: start,
      pageEnd: end,
      priority: task.priority,
      completed:false
    })

    currentPage = end + 1
    if ( currentPage > task.endPage ) break
  }
  return dailyTasks
}