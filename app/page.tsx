'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { HomeScreen } from '@/components/screens/home-screen'
import { TasksScreen } from '@/components/screens/tasks-screen'
import { BooksScreen } from '@/components/screens/books-screen'
import { AnalysisScreen } from '@/components/screens/analysis-screen'
import { RewardsScreen } from '@/components/screens/rewards-screen'
import {
  weeklyStudyStats,
  subjectDistribution,
} from '@/lib/study-data'
import type { DailyTask, UserProfile, StudyBook, WeeklyTask, Reward } from '@/lib/types'
import AuthGuard from '@/components/AuthGuard'
import {auth } from "@/lib/FirebaseConfig"
import { useEffect } from 'react'
import { deleteBook, updateBook, addBook, addWeeklyTask, updateWeeklyTask, deleteWeeklyTask, addDailyTasks, deleteDailyTask, addPoint, addReward, deletePoint, addDailyTask } from '@/lib/firebase/firestoreClient'
import { onSnapshot, collection, doc } from 'firebase/firestore'
import { db } from '@/lib/FirebaseConfig'
import { PlanScreen } from '@/components/screens/plan-screen'
import { calcPoint, distributeTask } from '@/lib/TasksUtil'
import { Timestamp } from 'firebase/firestore'
import { is } from 'date-fns/locale'

export default function StudyApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [books, setBooks] = useState<StudyBook[]>([])
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([])
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [user, setUser] = useState<UserProfile>({
  id: 'user-1',
  name: "",
  totalPoints: 0,
  tasksCompleted: 0,
  totalStudyMinutes: 0
  })

  useEffect(() => {
  let unsubscribeProfile: () => void
  let unsubscribeBooks: (() => void) | undefined
  let unsubscribeWeeklyTasks: (() => void) | undefined
  let unsubscribeDailyTask: (() => void) | undefined
  let unsubscribeReward:(() => void) | undefined

  const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
    if (!firebaseUser) return

    const userId = firebaseUser.uid

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

    unsubscribeBooks = onSnapshot(
      collection(db, "users", userId, "books"),
      (snapshot) => {
        const books = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudyBook[]

        setBooks(books)
      }
    )

    unsubscribeWeeklyTasks = onSnapshot(
      collection(db, "users", userId, "weeklyTasks"),
      (snapshot) => {
        const weeklyTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WeeklyTask[]

        setWeeklyTasks(weeklyTasks)
      }
    )

    unsubscribeDailyTask = onSnapshot(
      collection(db, "users", userId, "dailyTasks"),
      (snapshot) => {
        const dailyTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DailyTask[]

        setDailyTasks(dailyTasks)
      }
    )

    unsubscribeReward = onSnapshot(
      collection(db, "users", userId, "rewards"),
      (snapshot) => {
        const rewards = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reward[]

        setRewards(rewards)
      }
    )
  })

  return () => {
    unsubscribeAuth()
    unsubscribeBooks?.()
    unsubscribeWeeklyTasks?.()
    unsubscribeDailyTask?.()
    unsubscribeProfile?.()
  }
}, [])

  const handleAddWeeklyTask = async (task: Omit<WeeklyTask, 'id'>) => {
    const user = auth.currentUser
    if (!user) return

    await addWeeklyTask(user.uid, task)
  }

  const handleUpdateWeeklyTask = async (taskId: string, updates: Partial<WeeklyTask>) => {
    const user = auth.currentUser
    if (!user) return
    await updateWeeklyTask(user.uid, taskId, updates)

    setWeeklyTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }

  const handleDeleteWeeklyTask = async (taskId: string) => {
    const user = auth.currentUser
    if (!user) return
    await deleteWeeklyTask(user.uid, taskId)
    setWeeklyTasks((prev) => prev.filter((task) => task.id !== taskId))
  }



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

  const handleDeleteBook = async (bookId: string) => {
    const user = auth.currentUser
    if (!user) return
    await deleteBook(user.uid, bookId)
    setBooks((prev) => prev.filter((book) => book.id !== bookId))
  }
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0

  const handleGenerateDailyTasks = (task: WeeklyTask, date: Date[], weights: number[]) => {
    const distributedTasks = distributeTask(task, date, weights)
    addDailyTasks(user.id,distributedTasks)
    updateWeeklyTask(user.id,task.id, {
        isDistributed: true
      }
    )
  }

  const handleCompleteTask = async (taskId: string, studyTime: number, priority: string, isReview: boolean) => {
    const user = auth.currentUser
    if (!user) return

    const point = calcPoint(studyTime, priority)

    if (isReview) {
      const task = dailyTasks.find((t) => t.id === taskId)
      await completeAndCreateNextDayTask(task!)
    }
    await deleteDailyTask(user.uid,taskId)

    await addPoint(user.uid, point ?? 0)
  }

  const completeAndCreateNextDayTask = async (currentTask: DailyTask) => {
    const user = auth.currentUser
    if (!user) return
    // 1. 現在のタスクの日付をベースに「翌日」を計算
    const currentDate =  new Date();
    const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);// 現在の日付に1日分のミリ秒を加算

    const {id, ...rest} = currentTask
    const newTask = {
      ...rest,
      date: Timestamp.fromDate(nextDate), // タスクの日付を「翌日」に設定
    }

    handleAddTask(newTask)
  };

  const handleAddTask = (task: Omit<DailyTask,'id' | 'completed'>) => {
    const newTask: Omit<DailyTask, 'id'> = {
      ...task,
      completed: false,
      review: true,
    }

    addDailyTask(user.id, newTask)
  }



  const handleAddReward = async (reward: Omit<Reward, "id">) => {
    const user = auth.currentUser
    if (!user) return

    await addReward(user.uid, reward)
  }

  const handleRedeemReward = async (rewardId: string) => {
    const user = auth.currentUser
    if(!user) return

    const reward = rewards.find((r) => r.id === rewardId)
    
    await deletePoint(user.uid, reward?.pointsCost || 0)
  }


  return (
    <AuthGuard>
    <div className="mx-auto min-h-screen max-w-md bg-background">
      <main className="px-4 pt-6">
        {activeTab === 'home' && (
          <HomeScreen
            tasks={dailyTasks}
            user={user}
            onCompleteTask={handleCompleteTask}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksScreen
            books={books}
            tasks={dailyTasks}
            onCompleteTask={handleCompleteTask}
          />
        )}
        {activeTab === 'plans' && (
          <PlanScreen
            books={books}
            weeklyTasks={weeklyTasks}
            onAddWeeklyTask={handleAddWeeklyTask}
            onUpdateWeeklyTask={handleUpdateWeeklyTask}
            onDeleteWeeklyTask={handleDeleteWeeklyTask}
            onGenerateDailyTasks={handleGenerateDailyTasks}
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
            onAddRedeem={handleAddReward}
          />
        )}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
    </AuthGuard>
  )
}
