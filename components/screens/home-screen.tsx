'use client'

import { useState } from 'react'
import { Settings, Star, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/task-card'
import { StudyTimeDialog } from '@/components/study-time-dialog'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import type { StudyTask, UserProfile } from '@/lib/types'

interface HomeScreenProps {
  tasks: StudyTask[]
  user: UserProfile
  onCompleteTask: (taskId: string, studyTime: number) => void
}

export function HomeScreen({ tasks, user, onCompleteTask }: HomeScreenProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null)
  const [pomodoroOpen, setPomodoroOpen] = useState(false)

  const todaysTasks = tasks.filter((t) => !t.completed)
  const completedToday = tasks.filter((t) => t.completed).length

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      setDialogOpen(true)
    }
  }

  const handleConfirmTime = (minutes: number) => {
    if (selectedTask) {
      onCompleteTask(selectedTask.id, minutes)
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
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </header>

      {/* Progress Summary */}
      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">{"Today's Progress"}</p>
            <p className="text-2xl font-bold">
              {completedToday} / {tasks.length}
            </p>
            <p className="text-xs opacity-75">tasks completed</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <span className="text-xl font-bold">
              {tasks.length > 0 ? Math.round((completedToday / tasks.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{"Today's Tasks"}</h2>
          <span className="text-sm text-muted-foreground">
            {todaysTasks.length} remaining
          </span>
        </div>
        <div className="space-y-3">
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">All tasks completed! Great job!</p>
            </div>
          )}
        </div>
      </section>

      {/* Pomodoro Button */}
      <Button
        onClick={() => setPomodoroOpen(true)}
        className="w-full gap-2"
        size="lg"
      >
        <Timer className="h-5 w-5" />
        Start Pomodoro
      </Button>

      {/* Study Time Dialog */}
      <StudyTimeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmTime}
        taskName={selectedTask?.bookName || ''}
      />

      {/* Pomodoro Timer Dialog */}
      <PomodoroTimer open={pomodoroOpen} onOpenChange={setPomodoroOpen} />
    </div>
  )
}
