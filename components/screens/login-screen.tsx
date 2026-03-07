'use client'

import { useState } from 'react'
import { BookOpen, Eye, EyeOff, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { signIn } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    setIsLoading(true)
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    await signIn(email, password)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      {/* Logo and Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <GraduationCap className="h-9 w-9 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">StudyFlow</h1>
          <p className="text-sm text-muted-foreground">集中して、目標を達成しよう</p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-sm border-border/50 shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">ログイン</CardTitle>
          <CardDescription>アカウントにログインして学習を始めましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                  ログイン状態を保持
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                パスワードを忘れた？
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="h-11 w-full text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ログイン中...
                </span>
              ) : (
                'ログイン'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">または</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            アカウントをお持ちでない方は{' '}
            <button type="button" className="font-medium text-primary hover:underline">
              新規登録
            </button>
          </p>
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          <span>学習計画</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-full border-2 border-current" />
          <span>集中タイマー</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base">🎯</span>
          <span>目標達成</span>
        </div>
      </div>
    </div>
  )
}
