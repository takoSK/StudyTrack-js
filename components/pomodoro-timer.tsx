'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PomodoroTimerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const WORK_TIME = 25 * 60 // 25 minutes in seconds
const BREAK_TIME = 5 * 60 // 5 minutes in seconds

export function PomodoroTimer({ open, onOpenChange }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  const resetTimer = useCallback(() => {
    setTimeLeft(isBreak ? BREAK_TIME : WORK_TIME)
    setIsRunning(false)
  }, [isBreak])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          // Switch between work and break
          if (!isBreak) {
            setIsBreak(true)
            return BREAK_TIME
          } else {
            setIsBreak(false)
            return WORK_TIME
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isBreak])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto max-w-[340px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-8">
          {/* Circular Progress */}
          <div className="relative mb-8">
            <svg className="h-48 w-48 -rotate-90 transform">
              <circle
                cx="96"
                cy="96"
                r="88"
                strokeWidth="8"
                fill="none"
                className="stroke-muted"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={cn(
                  'transition-all duration-1000',
                  isBreak ? 'stroke-success' : 'stroke-primary'
                )}
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * progress) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-muted-foreground">
                {isBreak ? 'Take a break' : 'Stay focused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={resetTimer}
            >
              <RotateCcw className="h-5 w-5" />
              <span className="sr-only">Reset</span>
            </Button>
            <Button
              size="icon"
              className={cn(
                'h-16 w-16 rounded-full',
                isBreak ? 'bg-success hover:bg-success/90' : ''
              )}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
              <span className="sr-only">{isRunning ? 'Pause' : 'Play'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-12 rounded-full px-4"
              onClick={() => {
                setIsBreak(!isBreak)
                setTimeLeft(isBreak ? WORK_TIME : BREAK_TIME)
                setIsRunning(false)
              }}
            >
              {isBreak ? 'Work' : 'Break'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
