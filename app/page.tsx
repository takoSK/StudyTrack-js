'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { HomeScreen } from '@/components/screens/home-screen'
import { TasksScreen } from '@/components/screens/tasks-screen'
import { AnalysisScreen } from '@/components/screens/analysis-screen'
import { RewardsScreen } from '@/components/screens/rewards-screen'
import {
  initialTasks,
  studyBooks,
  rewards,
  weeklyStudyStats,
  subjectDistribution,
  userProfile as initialUserProfile,
} from '@/lib/study-data'
import type { StudyTask, UserProfile } from '@/lib/types'
import AuthGuard from '@/components/AuthGuard'

export default function StudyApp() {
  const [activeTab, setActiveTab] = useState('home')
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks)
  const [user, setUser] = useState<UserProfile>(initialUserProfile)

  const handleCompleteTask = (taskId: string, studyTime: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, studyTime }
          : task
      )
    )
    // Add points based on study time (1 point per 5 minutes, minimum 5)
    const pointsEarned = Math.max(5, Math.floor(studyTime / 5) * 5)
    setUser((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + pointsEarned,
      tasksCompleted: prev.tasksCompleted + 1,
      totalStudyMinutes: prev.totalStudyMinutes + studyTime,
    }))
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
        {activeTab === 'tasks' && <TasksScreen books={studyBooks} />}
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
