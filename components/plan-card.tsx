'use client'

import { Task } from "@/lib/types"

interface PlanCardProps {
  task: Task
}

export function PlanCard({task}: PlanCardProps) {
  const progress = Math.floor((task.currentPage ?? 0) - (task.startPage ?? 0) + 1 / ((task.endPage ?? 1) - (task.startPage ?? 0)) * 100)

  const priorityColor = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-blue-100 text-blue-600"
  }[task.priority]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border">
      
      {/* 上部 */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-800">
          {task.bookName}
        </h2>

        <span className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
          {task.priority}
        </span>
      </div>

      {/* 進捗数値 */}
      <div className="text-sm text-gray-500 mb-2">
        {(task.currentPage ?? 0) - (task.startPage ?? 0) + 1} / {((task.endPage ?? 1) - (task.startPage ?? 0) + 1)}
      </div>

      {/* プログレスバー */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 下部アクション */}
      <div className="flex justify-end mt-3 gap-2">
        <button className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
          詳細
        </button>
        <button className="text-xs px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
          進める
        </button>
      </div>

    </div>
  )
}