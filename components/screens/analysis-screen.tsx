'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface AnalysisScreenProps {
  studyStats: StudyStats[]
  subjectDistribution: SubjectDistribution[]
  completionRate: number
}

export function AnalysisScreen({
  studyStats,
  subjectDistribution,
  completionRate,
}: AnalysisScreenProps) {
  const totalMinutes = studyStats.reduce((acc, curr) => acc + curr.minutes, 0)
  const avgMinutes = Math.round(totalMinutes / studyStats.length)

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Analysis</h1>
        <p className="text-sm text-muted-foreground">
          Track your study progress and habits
        </p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalMinutes}</p>
          <p className="text-xs text-muted-foreground">Total min</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-primary">{avgMinutes}</p>
          <p className="text-xs text-muted-foreground">Avg/day</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-bold text-primary">{completionRate}%</p>
          <p className="text-xs text-muted-foreground">Completion</p>
        </Card>
      </div>

      {/* Study Time Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Study Time (This Week)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              minutes: {
                label: 'Minutes',
                color: '#4f6bcc',
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studyStats}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#4f6bcc"
                  strokeWidth={2}
                  dot={{ fill: '#4f6bcc', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Subject Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Subject Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="h-[160px] w-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="percentage"
                  >
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {subjectDistribution.map((subject) => (
                <div key={subject.subject} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="flex-1 text-sm text-foreground">
                    {subject.subject}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {subject.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Completion Rate */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Task Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24">
              <svg className="h-24 w-24 -rotate-90 transform">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  fill="none"
                  className="stroke-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="stroke-success"
                  strokeDasharray={251}
                  strokeDashoffset={251 - (251 * completionRate) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">
                  {completionRate}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                You completed {completionRate}% of your planned tasks this week.
                Keep up the great work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
