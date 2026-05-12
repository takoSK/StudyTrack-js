'use client'

import { useState } from 'react'
import { Star, Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Reward, AppUser } from '@/lib/types'
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader } from '../ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '../ui/input'

interface RewardsScreenProps {
  rewards: Reward[]
  user: AppUser
  onRedeem: (rewardId: string) => void
  onAddRedeem: (redeem: Omit<Reward, 'id'>) => void
}

export function RewardsScreen({ rewards, user, onRedeem, onAddRedeem }: RewardsScreenProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsCost: 0
  })

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Rewards</h1>
          <p className="text-sm text-muted-foreground">
            Redeem your hard-earned points
          </p>
        </div>
        <Button 
          size="sm" 
          className="gap-1.5"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
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
      </Card>

      {/* Rewards List */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Available Rewards
        </h2>
        <div className="space-y-3">
          {rewards.map((reward) => {
            const canAfford = user.totalPoints >= reward.pointsCost
            return (
              <Card key={reward.id} className="p-4">
                <div className="flex items-center gap-4">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-auto max-w-[360px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reward-name">Reward Name</Label>
              <Input
                id="reward-name"
                placeholder="Enter reward name"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-name">Reward Cost</Label>
              <Input
                  type="number"
                  placeholder="Start"
                  value={newReward.pointsCost}
                  onChange={(e) => setNewReward({ ...newReward, pointsCost: parseInt(e.target.value) })}
                  className="flex-1"
                />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={ () => {
              onAddRedeem(newReward)
              setIsDialogOpen(false)
              setNewReward({name: "", description: "", pointsCost: 0})
            }}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
