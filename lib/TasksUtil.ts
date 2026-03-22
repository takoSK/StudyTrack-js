import { Task } from "./types"

export function generateTodayTasks(tasks: Task[]): Task[] {
  const DAILI_LIMIT = 90

  const sorted = tasks
    .filter(t => t.status === "active")
    .sort((a,b) => {
      const order = { high: 0, medium: 1,low: 2 }
      return order[a.priority] - order[b.priority]
    })

  let total = 0
  const result:Task[] = []

  for(const t of sorted) {
    if ( total + t.estimatedMinutes > DAILI_LIMIT) break

    result.push(t)
    total += t.estimatedMinutes
  }

  return result
}