'use client'

import { useState } from 'react'
import { LogOut, Star, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/task-card'
import { StudyTimeDialog } from '@/components/study-time-dialog'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import type { DailyTask, UserProfile } from '@/lib/types'
import { Logout } from '@/lib/firebase/auth'

interface HomeScreenProps {
  tasks: DailyTask[]
  user: UserProfile
  onCompleteTask: (taskId: string, studyTime: number, priority: string, isReview: boolean) => void
}

function balanceTasks(tasks: DailyTask[]) {

  // 教科ごとに分類
  const grouped: Record<string, DailyTask[]> = {}

  tasks.forEach((task) => {

    if (!grouped[task.subject]) {
      grouped[task.subject] = []
    }

    grouped[task.subject].push(task)
  })

  // 教科一覧
  const subjects = Object.keys(grouped)

  const result: DailyTask[] = []

  let added = true

  // 1教科ずつ順番に取り出す
  while (added) {

    added = false

    for (const subject of subjects) {

      const task = grouped[subject].shift()

      if (task) {
        result.push(task)
        added = true
      }
    }
  }

  return result
}

function formatStudyTime(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

export function HomeScreen({ tasks, user, onCompleteTask }: HomeScreenProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const nextTask = balanceTasks(tasks)[0]

  const today = new Date()
  
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const todaysTasks = tasks.filter((task) => {
    const taskDate = task.date.toDate();
    // タスクの日の 00:00:00 の状態を作る
    const normalizedTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    // 1. 今日かどうかの判定
    const isToday = normalizedTaskDate.getTime() === startOfToday.getTime();
    
    // 2. 今日より前かどうかの判定
    const isPast = normalizedTaskDate.getTime() < startOfToday.getTime();
    
    // 3. 未完了かどうかの判定 (プロパティ名は環境に合わせてください)
    const isUncompleted = !task.completed; 

    // 「今日」または「過去かつ未完了」を返す
    return isToday || (isPast && isUncompleted);
  });

  const balancedTasks = balanceTasks(todaysTasks)

  const completedToday = todaysTasks.filter((t) => t.completed).length

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setDialogOpen(true)
    }
  }

  const handleConfirmTime = (minutes: number, isReview: boolean) => {
    if (selectedTask) {
      onCompleteTask(selectedTask.id, minutes,selectedTask.priority,isReview)
      setDialogOpen(false)
      setSelectedTask(null)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-2xl font-semibold text-foreground">{user.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-primary">{user.totalPoints}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
            onClick={Logout}
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      {/* Progress Summary */}
      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{"Today's Progress"}</p>
            <p className="text-2xl font-bold">
              {completedToday} / {todaysTasks.length}
            </p>
            <p className="text-xs opacity-75">tasks completed</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <span className="text-xl font-bold">
              {todaysTasks.length === 0
                ? 0
                : Math.round((completedToday / todaysTasks.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      <section className="mb-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          
          <p className="text-xs text-muted-foreground">
            Today Study Time
          </p>

          <p className="text-2xl font-semibold">
            {formatStudyTime(user.todayStudyTime)}
          </p>

          <p className="text-xs text-muted-foreground">
            This Week
          </p>

          <p className="text-2xl font-semibold">
            {formatStudyTime(user.totalStudyTime)}
          </p>

        </div>
      </section>

      {nextTask && (
      <section className="mb-6">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">

          <p className="text-sm text-foreground">
            Next Task
          </p>

          <p className="mt-2 text-xl text-foreground">
            {nextTask.bookName}
          </p>

        </div>
      </section>
    )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{"Today's Tasks"}</h2>
          <span className="text-sm text-muted-foreground">
            {balancedTasks.length} remaining
          </span>
        </div>
        <div className="space-y-3">
          {balancedTasks.length > 0 ? (
            balancedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">All tasks completed! Great job!</p>
            </div>
          )}
        </div>
      </section>

      {/* Study Time Dialog */}
      <StudyTimeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmTime}
        taskName={selectedTask?.bookName || ''}
      />
    </div>
  )
}
