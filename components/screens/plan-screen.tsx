'use client'

import { useState } from 'react'
import { Card, CardContent} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import type { Task, StudyBook, Priority, Type, Status } from '@/lib/types'
import { PriorityBadge } from '../priority-badge'
import { PlanCard } from '../plan-card'
import { Timestamp } from 'firebase/firestore'

interface PlanScreenProps {
  books: StudyBook[]
  tasks: Task[]
  onAddTask: (task: Omit<Task, 'id'>) => void
  onUpdateTask?: (taskId: string, updatedData: Partial<Task>) => void
  onDeleteTask?: (taskId: string) => void
}

export function PlanScreen({ books, tasks, onAddTask, onUpdateTask, onDeleteTask }: PlanScreenProps) {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [taskForm, setTaskForm] = useState({
    bookId: '',
    startPage: '',
    endPage: '',
    priority: '',
  })

  // Handlers for weekly plan
  const handleAddTask = () => {
    if (!taskForm.bookId || !taskForm.startPage || !taskForm.endPage) return

    const selectedBook = books.find((b) => b.id === taskForm.bookId)

    const updates = {
      bookId: taskForm.bookId,
      bookName: selectedBook?.name ?? "",
      subject: selectedBook?.subject ?? "",

      type: "section" as Type,

      startPage: 0,
      endPage: 0,
      currentPage: 0,
    
      totalCount: 0,
      completedCount: 0,
    
      estimatedMinutes: 0,
    
      status: "active" as Status,

      priority: taskForm.priority as Priority,
    
      points: 0,
    
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    if (editingTaskId) {
      onUpdateTask?.(editingTaskId, updates)
    } else {
      onAddTask?.(updates)
    }

    setShowAddTaskDialog(false)
    setTaskForm({ bookId: "", startPage: "", endPage: "" , priority: ""})
    setEditingTaskId(null)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-foreground">Plan</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Weekly Tasks */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">Study Tasks</h2>
          {tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No tasks added yet
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <PlanCard key={task.id} task = {task}/>
            ))
          )}

          {/* Add Task Button */}
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Study Task
          </Button>
        </div>
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="max-w-[340px] rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {editingTaskId ? 'Edit Study Task' : 'Add Study Task'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label>Select textbook</Label>
              <Select
                value={taskForm.bookId}
                onValueChange={(v) => setTaskForm((prev) => ({ ...prev, bookId: v }))}
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
            <div className="flex flex-col gap-2">
              <Label>Select priority</Label>
              <Select
                value={taskForm.priority}
                onValueChange={(v) => setTaskForm((prev) => ({ ...prev, priority: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Start page</Label>
                <Input
                  type="number"
                  value={taskForm.startPage}
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, startPage: e.target.value }))
                  }
                  placeholder="30"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>End page</Label>
                <Input
                  type="number"
                  value={taskForm.endPage}
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, endPage: e.target.value }))
                  }
                  placeholder="60"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowAddTaskDialog(false)
                setTaskForm({ bookId: '', startPage: '', endPage: '', priority: '' })
                setEditingTaskId(null)
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleAddTask}
              disabled={!taskForm.bookId || !taskForm.startPage || !taskForm.endPage || !taskForm.priority}
            >
              {editingTaskId ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}