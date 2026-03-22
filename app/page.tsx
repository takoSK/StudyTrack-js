'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { HomeScreen } from '@/components/screens/home-screen'
import { TasksScreen } from '@/components/screens/tasks-screen'
import { BooksScreen } from '@/components/screens/books-screen'
import type { UserProfile, StudyBook, Reward, Task } from '@/lib/types'
import AuthGuard from '@/components/AuthGuard'
import {auth } from "@/lib/FirebaseConfig"
import { useEffect } from 'react'
import { deleteBook, updateBook, addBook } from '@/lib/firebase/firestoreClient'
import { onSnapshot, collection, doc, Timestamp, query, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/FirebaseConfig'
import { PlanScreen } from '@/components/screens/plan-screen'
import { generateCategoricalChart } from 'recharts/types/chart/generateCategoricalChart'
import { generateTodayTasks } from '@/lib/TasksUtil'

export default function StudyApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [tasks, setTasks] = useState<Task[]>([])
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([])
  const [books, setBooks] = useState<StudyBook[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [user, setUser] = useState<UserProfile>({
  id: 'user-1',
  name: "",
  points: 0,
  totalStudyMinutes: 0,
  streak: 0,
  lastStudyDate: new Timestamp(1,1)
  })

  useEffect(() => {
    let unsubscribeProfile: () => void
    let unsubscribeTasks: (() => void) | undefined
    let unsubscribeBooks: (() => void) | undefined

    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) return

      const userId = firebaseUser.uid

      const tasksRef = collection(db, "users", userId, "tasks")
      const tasks = query(
        tasksRef,
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      )

      const booksRef = collection(db, "users", userId, "books")

      unsubscribeProfile = onSnapshot(
        doc(db, "users", userId),
        (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data() as Omit<UserProfile, "id">
            setUser({
              id: docSnap.id,
              ...profileData
            })
          }
        }
      )

      unsubscribeTasks = onSnapshot(tasksRef,(snapshot) => {
        const task: Task[] = snapshot.docs.map((doc) => ({
          id:doc.id,
          ...doc.data()
        })) as Task[]

        setTasks(task)
        setTodaysTasks(generateTodayTasks(task))
        }
      )

      unsubscribeBooks = onSnapshot(booksRef,(snapshot) => {
        const book: StudyBook[] = snapshot.docs.map((doc) => ({
          id:doc.id,
          ...doc.data()
        })) as StudyBook[]

        setBooks(book)
        }
      )
    })

    return () => {
      unsubscribeAuth()
      unsubscribeTasks?.()
      unsubscribeBooks?.()
      unsubscribeProfile?.()
    }
  }, [])

  const handleAddBook = async (book: Omit<StudyBook, 'id'>) => {
    const user = auth.currentUser
    if (!user) return

    await addBook(user.uid, book)
  }

  const handleUpdateBook = async (bookId: string, updates: Partial<StudyBook>) => {
    const user = auth.currentUser
    if (!user) return
    await updateBook(user.uid, bookId, updates)

    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, ...updates } : book
      )
    )
  }

  const handleDeleteBook = async (bookid: string) => {
    const user = auth.currentUser
    if (!user) return

    await deleteBook(user.uid,bookid)
  }

  const handleAddTask = async(task: Omit<Task,"id">) => {}

  const handleUpdateTask = async(taskId: string, updatedData: Partial<Task>) => {}

  const handleDeleteTask = async(taskId: string) => {}

  const handleCompleteTask = async(taskId: string, studyTime: number, priority: string) => {}

  return (
    <AuthGuard>
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <main className="px-4 pt-6">
        {activeTab === 'home' && (
          <HomeScreen
            tasks={todaysTasks}
            user={user}
            onCompleteTask={handleCompleteTask}
          />
        )}
        {activeTab === 'plans' && (
          <PlanScreen
            books={books}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />  
        )}
        {activeTab === 'books' && (
          <BooksScreen
            books={books}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
          />
        )}
        {/*activeTab === 'rewards' && (
          <RewardsScreen
            rewards={rewards}
            user={user}
            onRedeem={handleRedeemReward}
            onAddRedeem={handleAddReward}
          />
        )*/}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
    </AuthGuard>
  )
}
