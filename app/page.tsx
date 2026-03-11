'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { HomeScreen } from '@/components/screens/home-screen'
import { TasksScreen } from '@/components/screens/tasks-screen'
import { BooksScreen } from '@/components/screens/books-screen'
import { AnalysisScreen } from '@/components/screens/analysis-screen'
import { RewardsScreen } from '@/components/screens/rewards-screen'
import {
  rewards,
  weeklyStudyStats,
  subjectDistribution,
  userProfile as initialUserProfile,
} from '@/lib/study-data'
import type { StudyTask, UserProfile, StudyBook } from '@/lib/types'
import AuthGuard from '@/components/AuthGuard'
import {auth } from "@/lib/FirebaseConfig"
import { useEffect } from 'react'
import { getUserProfile, getTasks, getBooks, deleteBook, updateBook, addBook } from '@/lib/firebase/firestoreClient'

export default function StudyApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [books, setBooks] = useState<StudyBook[]>([])
  const [user, setUser] = useState<UserProfile>({
  id: 'user-1',
  name: "",
  totalPoints: 0,
  tasksCompleted: 0,
  totalStudyMinutes: 0
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) return

      const userId = firebaseUser.uid
      const [profile, tasksData, booksData] = await Promise.all([
      getUserProfile(userId),
      getTasks(userId),
      getBooks(userId)
    ])
    
      setUser(profile ?? initialUserProfile)
      setTasks(tasksData)
      setBooks(booksData)
    })

    return () => unsubscribe()
  }, [])

  const handleCompleteTask = (taskId: string, studyTime: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, studyTime }
          : task
      )
    )
  }

  const handleRedeemReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId)
    if (reward && user.totalPoints >= reward.pointsCost) {
      setUser((prev) => ({
        ...prev,
        totalPoints: prev.totalPoints - reward.pointsCost,
      }))
      // In a real app, this would trigger the reward
    }
  }
  

  const handleAddTask = (task: Omit<StudyTask, 'id' | 'completed'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleAddBook = async (book: Omit<StudyBook, 'id'>) => {

    const user = auth.currentUser
    if (!user) return

    const createdBook = await addBook(user.uid, book)

    setBooks((prev) => [...prev, createdBook])
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

  const handleDeleteBook = async (bookId: string) => {
    const user = auth.currentUser
    if (!user) return
    await deleteBook(user.uid, bookId)
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
  }
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0

  return (
    <AuthGuard>
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <main className="px-4 pt-6">
        {activeTab === 'home' && (
          <HomeScreen
            tasks={tasks}
            user={user}
            onCompleteTask={handleCompleteTask}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksScreen 
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onAddTask={handleAddTask}
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
        {activeTab === 'analysis' && (
          <AnalysisScreen
            studyStats={weeklyStudyStats}
            subjectDistribution={subjectDistribution}
            completionRate={completionRate}
          />
        )}
        {activeTab === 'rewards' && (
          <RewardsScreen
            rewards={rewards}
            user={user}
            onRedeem={handleRedeemReward}
          />
        )}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
    </AuthGuard>
  )
}
