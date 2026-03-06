'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { StudyBook } from '@/lib/types'

interface TasksScreenProps {
  books: StudyBook[]
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function TasksScreen({ books }: TasksScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState(3) // April (0-indexed)
  const [selectedYear] = useState(2026)
  const [selectedBook, setSelectedBook] = useState<StudyBook | null>(null)

  const prevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
  }

  const nextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Study Plans</h1>
        <p className="text-sm text-muted-foreground">
          Manage your monthly study targets
        </p>
      </header>

      {/* Month Selector */}
      <div className="flex items-center justify-between rounded-xl bg-card p-3">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            {months[selectedMonth]} {selectedYear}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      {/* Books List */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Your Books</h2>
        <div className="space-y-3">
          {books.map((book) => {
            const progressPercent = Math.round(
              (book.completedPages / book.totalPages) * 100
            )
            return (
              <Card
                key={book.id}
                className="cursor-pointer p-4 transition-shadow hover:shadow-md"
                onClick={() => setSelectedBook(book)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-card-foreground">
                          {book.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {book.subject}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        {progressPercent}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {book.completedPages} / {book.totalPages} pages
                      </span>
                      <span>Target: {book.monthlyTarget} pages/month</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Book Detail Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="mx-auto max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle>{selectedBook?.name}</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium text-foreground">{selectedBook.subject}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-medium text-foreground">
                  {selectedBook.completedPages} / {selectedBook.totalPages} pages (
                  {Math.round((selectedBook.completedPages / selectedBook.totalPages) * 100)}%)
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-foreground">Weekly Plan</h4>
                <div className="space-y-2">
                  {selectedBook.weeklyPlan.map((week) => (
                    <div
                      key={week.week}
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                    >
                      <span className="font-medium text-card-foreground">
                        Week {week.week}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        p{week.pageStart}–{week.pageEnd}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
