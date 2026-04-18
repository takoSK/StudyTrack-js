'use client'

import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check,
  BookOpen 
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import type { DailyTask, Day, StudyBook } from '@/lib/types'
import { TaskCard } from '../task-card'
import { StudyTimeDialog } from '../study-time-dialog'
import { addDailyTask } from '@/lib/firebase/firestoreClient'

interface TasksScreenProps {
  books: StudyBook[]
  tasks: DailyTask[]
  onCompleteTask: (taskId: string, studyTime: number, priority: string, isReview: boolean) => void
  onAddTask: (task: Omit<DailyTask, 'id' | 'completed'>) => void
}

const WEEKDAYS: { key: Day; label: string }[] = [
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

function getWeekDays(weekOffset: number) {
  const today = new Date()

  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset) * 7)

  const days: Date[] = []

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    days.push(day)
  }

  return days
}

export function TasksScreen({ books, tasks, onCompleteTask }: TasksScreenProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null)
  const [weekOffset, setWeekOffset] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())
  const [newTask, setNewTask] = useState({
    bookId: '',
    pageStart: '',
    pageEnd: '',
    weekday: 'monday' as Day,
    priority: 'medium' as 'high' | 'medium' | 'low',
  })

  const weekRange = getWeekRange(weekOffset)

  const weekDays = getWeekDays(weekOffset)

  const selectedDayTasks = tasks.filter((task) => {
    const taskDate =
    task.date instanceof Date
      ? task.date
      : task.date.toDate()

    return (
      taskDate.toDateString() ===
      selectedDay.toDateString()
    )
  })

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

  const handleSaveTask = () => {

    setNewTask({
      bookId: '',
      pageStart: '',
      pageEnd: '',
      weekday: 'monday',
      priority: 'medium',
    })
    setIsDialogOpen(false)
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
      <Card className="p-3">
        <div className="flex justify-between items-center mb-2">

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <p className="font-medium">{weekRange.label}</p>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

        </div>

        <div className="grid grid-cols-7 gap-2">

          {weekDays.map((day) => {

            const isSelected =
              day.toDateString() === selectedDay.toDateString()

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center p-2 rounded-lg text-sm
                  ${isSelected
                    ? "bg-primary text-white"
                    : "bg-muted hover:bg-muted/70"
                  }
                `}
              >
                <span>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>

                <span className="text-lg font-semibold">
                  {day.getDate()}
                </span>
              </button>
            )
          })}

        </div>
      </Card>

      {/* Weekly Task List */}
      <div className="space-y-4">
        {selectedDayTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            この日のタスクはありません
          </p>
        ) : (
          selectedDayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
            />
          ))
        )}
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
                onValueChange={(v) => setNewTask((prev) => ({ ...prev, bookId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a textbook" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.name}
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
                onValueChange={(value) => setNewTask({ ...newTask, weekday: value as Day })}
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
