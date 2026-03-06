'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'

interface StudyTimeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (minutes: number) => void
  taskName: string
}

export function StudyTimeDialog({
  open,
  onOpenChange,
  onConfirm,
  taskName,
}: StudyTimeDialogProps) {
  const [minutes, setMinutes] = useState('')

  const handleConfirm = () => {
    const time = parseInt(minutes, 10)
    if (time > 0) {
      onConfirm(time)
      setMinutes('')
    }
  }

  const quickOptions = [15, 30, 45, 60]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto max-w-[340px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Log Study Time
          </DialogTitle>
          <DialogDescription className="text-balance">
            How long did you study <span className="font-medium">{taskName}</span>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                onClick={() => setMinutes(option.toString())}
                className="flex-1"
              >
                {option} min
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="minutes">Or enter custom time</Label>
            <div className="flex items-center gap-2">
              <Input
                id="minutes"
                type="number"
                placeholder="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="text-center text-lg"
                min={1}
                max={480}
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!minutes || parseInt(minutes, 10) <= 0}
            className="w-full"
          >
            Complete Task (+{minutes ? Math.floor(parseInt(minutes, 10) / 5) * 5 : 0} pts)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
