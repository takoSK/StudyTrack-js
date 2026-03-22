'use client'

import { useState } from 'react'
import { LogOut, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskCard } from '@/components/task-card'
import { StudyTimeDialog } from '@/components/study-time-dialog'
import type { Task, UserProfile } from '@/lib/types'
import { Logout } from '@/lib/firebase/auth'

interface HomeScreenProps {
  tasks: Task[]
  user: UserProfile
  onCompleteTask: (taskId: string, studyTime: number, priority: string) => void
}

export function HomeScreen({ tasks, user, onCompleteTask }: HomeScreenProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const handleConfirmTime = (minutes: number) => {
    if (selectedTask) {
      onCompleteTask(selectedTask.id, minutes,selectedTask.priority)
      setDialogOpen(false)
      setSelectedTask(null)
    }
  }

  const handleCompleteTask = (taskId: string) => {}

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
            <span className="text-sm font-semibold text-primary">{user.points}</span>
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
              {/*completedToday} / {todaysTasks.length*/}
            </p>
            <p className="text-xs opacity-75">tasks completed</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <span className="text-xl font-bold">
              {/*todaysTasks.length === 0
                ? 0
                : Math.round((completedToday / todaysTasks.length) * 100)*/}%
            </span>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{"Today's Tasks"}</h2>
          <span className="text-sm text-muted-foreground">
            {/*todaysTasks.length*/} remaining
          </span>
        </div>
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
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
