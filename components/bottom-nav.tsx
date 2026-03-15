'use client'

import { Home, ListTodo, BarChart3, Gift, Book } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'plans', label: 'Plans', icon: ListTodo },
  { id: 'books', label: 'Books', icon: Book },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  { id: 'rewards', label: 'Rewards', icon: Gift },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-10 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5px]')} />
              <span className={cn('text-xs', isActive && 'font-medium')}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
