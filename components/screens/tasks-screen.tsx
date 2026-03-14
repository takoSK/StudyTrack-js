'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check,
  BookOpen 
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DailyTask, Weekday } from '@/lib/types'
import { availableBooks } from '@/lib/study-data'

interface TasksScreenProps {
  tasks: DailyTask[]
  onCompleteTask: (taskId: string, studyTime: number) => void
  onAddTask: (task: Omit<DailyTask, 'id' | 'completed'>) => void
}

const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

function getWeekRange(weekOffset: number): { start: Date; end: Date; label: string } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7)
  
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}`
  }
  
  return {
    start: monday,
    end: sunday,
    label: `${formatDate(monday)} - ${formatDate(sunday)}, ${sunday.getFullYear()}`,
  }
}

const priorityStyles: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning-foreground border-warning/20',
  low: 'bg-muted text-muted-foreground border-border',
}

export function TasksScreen({ tasks, onCompleteTask, onAddTask }: TasksScreenProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    bookId: '',
    pageStart: '',
    pageEnd: '',
    weekday: 'monday' as Weekday,
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  const weekRange = getWeekRange(weekOffset)

  const tasksByDay = useMemo(() => {
    const grouped: Record<Weekday, DailyTask[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    }
    
    tasks.forEach((task) => {
      if (task.weekday) {
        grouped[task.weekday].push(task)
      }
    })
    
    return grouped
  }, [tasks])

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleSaveTask = () => {
    const selectedBook = availableBooks.find((b) => b.id === newTask.bookId)
    if (!selectedBook || !newTask.pageStart || !newTask.pageEnd) return

    setNewTask({
      bookId: '',
      pageStart: '',
      pageEnd: '',
      weekday: 'monday',
      priority: 'medium',
    })
    setIsDialogOpen(false)
  }

  const handleComplete = (taskId: string) => {
    // Default to 30 minutes study time
    onCompleteTask(taskId, 30)
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Task Management</h1>
          <p className="text-sm text-muted-foreground">
            Plan and manage your weekly study tasks
          </p>
        </div>
        <Button 
          size="sm" 
          className="gap-1.5"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </header>

      {/* Week Navigation */}
      <Card className="flex items-center justify-between p-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setWeekOffset((prev) => prev - 1)}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous week</span>
        </Button>
        <p className="font-medium text-foreground">{weekRange.label}</p>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next week</span>
        </Button>
      </Card>

      {/* Weekly Progress */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Weekly Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedCount} / {totalCount} tasks completed
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </Card>

      {/* Weekly Task List */}
      <div className="space-y-4">
        {WEEKDAYS.map(({ key, label }) => {
          const dayTasks = tasksByDay[key]
          if (dayTasks.length === 0) return null

          return (
            <section key={key}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {label}
              </h2>
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`flex items-center gap-3 p-3 transition-all hover:shadow-sm ${
                      task.completed ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{task.subject}</p>
                      <p className="font-medium text-card-foreground truncate">
                        {task.bookName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        p{task.pageStart} - p{task.pageEnd}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${priorityStyles[task.priority]}`}
                      >
                        {task.priority}
                      </Badge>
                      {task.completed ? (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="h-4 w-4 text-success" />
                          <span>{task.studyTime} min</span>
                        </div>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-success hover:bg-success/10"
                          onClick={() => handleComplete(task.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Complete task</span>
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-auto max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Book Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Book</label>
              <Select
                value={newTask.bookId}
                onValueChange={(value) => setNewTask({ ...newTask, bookId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.name} ({book.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Page Range</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Start"
                  value={newTask.pageStart}
                  onChange={(e) => setNewTask({ ...newTask, pageStart: e.target.value })}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="End"
                  value={newTask.pageEnd}
                  onChange={(e) => setNewTask({ ...newTask, pageEnd: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Weekday Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Weekday</label>
              <Select
                value={newTask.weekday}
                onValueChange={(value) => setNewTask({ ...newTask, weekday: value as Weekday })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map(({ key, label }) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => 
                  setNewTask({ ...newTask, priority: value as 'high' | 'medium' | 'low' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask}>Save Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
