'use client'

import { Star, Play, Cake, Gamepad2, Smartphone, Film } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Reward, UserProfile } from '@/lib/types'

interface RewardsScreenProps {
  rewards: Reward[]
  user: UserProfile
  onRedeem: (rewardId: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  play: Play,
  cake: Cake,
  gamepad: Gamepad2,
  smartphone: Smartphone,
  film: Film,
}

export function RewardsScreen({ rewards, user, onRedeem }: RewardsScreenProps) {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Rewards</h1>
        <p className="text-sm text-muted-foreground">
          Redeem your hard-earned points
        </p>
      </header>

      {/* Points Balance */}
      <Card className="bg-primary p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{user.totalPoints}</span>
              <span className="text-sm opacity-75">points</span>
            </div>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
            <Star className="h-8 w-8 fill-current" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-primary-foreground/20 pt-4 text-sm">
          <div>
            <span className="opacity-75">Tasks Completed:</span>{' '}
            <span className="font-semibold">{user.tasksCompleted}</span>
          </div>
          <div>
            <span className="opacity-75">Hours Studied:</span>{' '}
            <span className="font-semibold">
              {Math.floor(user.totalStudyMinutes / 60)}
            </span>
          </div>
        </div>
      </Card>

      {/* Rewards List */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Available Rewards
        </h2>
        <div className="space-y-3">
          {rewards.map((reward) => {
            const IconComponent = iconMap[reward.icon] || Star
            const canAfford = user.totalPoints >= reward.pointsCost
            return (
              <Card key={reward.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground">
                      {reward.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {reward.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Star className="h-4 w-4 fill-primary" />
                      {reward.pointsCost}
                    </div>
                    <Button
                      size="sm"
                      variant={canAfford ? 'default' : 'secondary'}
                      disabled={!canAfford}
                      onClick={() => onRedeem(reward.id)}
                      className="h-8"
                    >
                      {canAfford ? 'Redeem' : 'Locked'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Tips */}
      <Card className="border-dashed bg-muted/30 p-4">
        <h3 className="mb-2 font-medium text-foreground">How to earn points</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Complete study tasks: 5-15 points based on duration</li>
          <li>• Finish daily goals: 20 bonus points</li>
          <li>• Weekly streak: 50 bonus points</li>
        </ul>
      </Card>
    </div>
  )
}
