'use client';

import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Week } from "@/lib/types";

const DAYS = [
  { key: 'mon', label: '月' },
  { key: 'tue', label: '火' },
  { key: 'wed', label: '水' },
  { key: 'thu', label: '木' },
  { key: 'fri', label: '金' },
  { key: 'sat', label: '土' },
  { key: 'sun', label: '日' },
];

interface WeeklyTimeGridProps {
  dailyAvailableTime: Week;
  onEditClick: () => void;
}

export default function WeeklyTimeGrid({ dailyAvailableTime, onEditClick }: WeeklyTimeGridProps) {
  // 合計時間を計算（分を時間に変換）
  let time = dailyAvailableTime
  const totalMinutes = time.mon + time.tue + time.wed + time.thu + time.fri + time.sat + time.sun;
  const totalHours = totalMinutes / 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground">
          週間の学習可能時間（合計: {totalHours}h）
        </h3>
        <Button variant="ghost" size="sm" onClick={onEditClick} className="h-8 gap-2">
          <Edit2 className="h-4 w-4" />
          <span className="text-xs">編集</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => {
          const minutes = dailyAvailableTime[day.key as keyof Week] || 0;
          const hours = Number(minutes) / 60;

          return (
            <div 
              key={day.key} 
              className="flex flex-col items-center justify-center py-3 rounded-xl border bg-card shadow-sm"
            >
              <span className={`text-[10px] font-bold mb-1 ${
                day.key === 'sat' ? 'text-blue-500' : day.key === 'sun' ? 'text-red-500' : 'text-muted-foreground'
              }`}>
                {day.label}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold tracking-tighter">{hours}</span>
                <span className="text-[10px] text-muted-foreground">h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}