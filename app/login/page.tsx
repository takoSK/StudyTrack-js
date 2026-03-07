'use client'

import { LoginScreen } from '@/components/screens/login-screen'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/")
  }

  return <LoginScreen onLogin={handleLogin} />
}