'use client'

import { Check, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PriorityBadge } from './priority-badge'
import { Task } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
}

const subjectIcons: Record<string, string> = {
  Mathematics: '#4f6bcc',
  Physics: '#5ba3d9',
  Chemistry: '#68c4b8',
  English: '#95b8d1',
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const subjectColor = subjectIcons[task.subject] || '#4f6bcc'

  return (
    <Card
      className={cn(
        'relative overflow-hidden p-4 transition-all',
        false && 'opacity-60'
      )}
    >
      <div
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: subjectColor }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5 pl-2">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: subjectColor }}
            >
              {task.subject}
            </span>
          </div>
          <h3 className="flex items-center gap-2 font-medium text-card-foreground">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            {task.bookName}
          </h3>
          <p className="text-sm text-muted-foreground">
            p{task.startPage} - {task.endPage}
          </p>
          <PriorityBadge priority={task.priority} />
        </div>
        <Button
          size="sm"
          variant={task.status ? 'secondary' : 'default'}
          className={cn(
            'h-9 w-9 shrink-0 rounded-full p-0',
            task.status && 'bg-success text-success-foreground'
          )}
          onClick={() => onComplete(task.id)}
          disabled={false}
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Complete task</span>
        </Button>
      </div>
    </Card>
  )
}
