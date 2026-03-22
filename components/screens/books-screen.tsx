'use client'

import { useState } from 'react'
import { auth } from '@/lib/FirebaseConfig'
import { Book, Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { StudyBook } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'

interface BooksScreenProps {
  books: StudyBook[]
  onAddBook: (book: Omit<StudyBook, 'id' | 'weeklyPlan'>) => void
  onUpdateBook: (bookId: string, updates: Partial<StudyBook>) => void
  onDeleteBook: (bookId: string) => void
}

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Japanese', 'Social']

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  English: "bg-purple-100 text-purple-700",
  Physics: "bg-sky-100 text-sky-700",
  Chemistry: "bg-emerald-100 text-emerald-700",
  Japanese: "bg-rose-100 text-rose-700",
  Social: "bg-amber-100 text-amber-700",
}

export function BooksScreen({ books, onAddBook, onUpdateBook, onDeleteBook }: BooksScreenProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<StudyBook | null>(null)
  const [newBook, setNewBook] = useState({
    name: '',
    subject: '',
    totalPages: 0,
    completedPages: 0,
    createdAt: Timestamp.now(),
  })

  const totalBooks = books.length
  const totalPages = books.reduce((sum, book) => sum + book.totalPages, 0)
  const completedPages = books.reduce((sum, book) => sum + book.completedPages, 0)
  const overallProgress = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0

  const handleAddBook = () => {
    if (newBook.name && newBook.subject && newBook.totalPages > 0) {
      const user = auth.currentUser
      setNewBook({
        name: '',
        subject: '',
        totalPages: 0,
        completedPages: 0,
        createdAt: Timestamp.now()
      })
      if (user) {
        onAddBook(newBook)
      }
      setIsAddDialogOpen(false)
    }
  }

  const handleUpdateBook = () => {
    if (editingBook) {
      onUpdateBook(editingBook.id, {
        name: editingBook.name,
        subject: editingBook.subject,
        totalPages: editingBook.totalPages,
        completedPages: editingBook.completedPages,
      })
      setEditingBook(null)
    }
  }

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || 'bg-muted text-muted-foreground'
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Books</h1>
          <p className="text-sm text-muted-foreground">Manage your study materials</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[340px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="book-name">Book Name</Label>
                <Input
                  id="book-name"
                  placeholder="Enter book name"
                  value={newBook.name}
                  onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={newBook.subject}
                  onValueChange={(value) => setNewBook({ ...newBook, subject: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-pages">Total Pages</Label>
                <Input
                  id="total-pages"
                  type="number"
                  placeholder="0"
                  value={newBook.totalPages || ''}
                  onChange={(e) => setNewBook({ ...newBook, totalPages: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completed-pages">Completed Pages</Label>
                <Input
                  id="completed-pages"
                  type="number"
                  placeholder="0"
                  value={newBook.completedPages || ''}
                  onChange={(e) => setNewBook({ ...newBook, completedPages: parseInt(e.target.value) || 0 })}
                />
              </div>
              <Button onClick={handleAddBook} className="w-full">
                Add Book
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Stats */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalBooks}</div>
              <div className="text-xs text-muted-foreground">Total Books</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{completedPages || 0}</div>
              <div className="text-xs text-muted-foreground">Pages Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{overallProgress}%</div>
              <div className="text-xs text-muted-foreground">Overall</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Your Study Books</h2>
        {books.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Book className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No books added yet</p>
              <p className="text-xs text-muted-foreground">Add your first book to get started</p>
            </CardContent>
          </Card>
        ) : (
          books.map((book) => {
            const progress = Math.round((book.completedPages / book.totalPages) * 100)
            const remainingPages = book.totalPages - book.completedPages

            return (
              <Card key={book.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{book.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className={`mt-1 ${getSubjectColor(book.subject)}`}>
                        {book.subject}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Edit Dialog */}
                      <Dialog open={editingBook?.id === book.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingBook(book)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit book</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[340px]">
                          <DialogHeader>
                            <DialogTitle>Edit Book</DialogTitle>
                          </DialogHeader>
                          {editingBook && (
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Book Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingBook.name}
                                  onChange={(e) => setEditingBook({ ...editingBook, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-subject">Subject</Label>
                                <Select
                                  value={editingBook.subject}
                                  onValueChange={(value) => setEditingBook({ ...editingBook, subject: value })}
                                >
                                  <SelectTrigger id="edit-subject">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subjects.map((subject) => (
                                      <SelectItem key={subject} value={subject}>
                                        {subject}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-total">Total Pages</Label>
                                <Input
                                  id="edit-total"
                                  type="number"
                                  value={editingBook.totalPages}
                                  onChange={(e) => setEditingBook({ ...editingBook, totalPages: parseInt(e.target.value) || 0 })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-completed">Completed Pages</Label>
                                <Input
                                  id="edit-completed"
                                  type="number"
                                  value={editingBook.completedPages}
                                  onChange={(e) => setEditingBook({ ...editingBook, completedPages: parseInt(e.target.value) || 0 })}
                                />
                              </div>
                              <Button onClick={handleUpdateBook} className="w-full">
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Delete Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete book</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-[340px]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Book</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{book.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteBook(book.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Progress */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{book.completedPages} / {book.totalPages} pages</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="mt-1 text-right text-xs text-muted-foreground">{progress}% complete</div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
