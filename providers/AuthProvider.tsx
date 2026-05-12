"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/FirebaseConfig"
import { getAppUser } from "@/lib/firebase/firestoreClient"
import { checkDateReset } from "@/lib/TasksUtil"
import { AppUser } from "@/lib/types"

type AuthContextType = {
  user: AppUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (firebaseUser) => {

      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Firestoreのユーザーデータ取得
        const userData = await getAppUser(firebaseUser.uid)
        if (!userData) {
          console.error("ユーザー情報なし")
          return
        }

        // 日付変更チェック
        const checkedUser = await checkDateReset(
          userData,
          firebaseUser.uid
        )

        // state更新
        setUser(checkedUser)

      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  )

  return () => unsubscribe()
}, [])
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}