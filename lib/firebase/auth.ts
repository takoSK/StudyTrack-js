import { auth } from "../FirebaseConfig"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { signOut as fisignOut } from "firebase/auth"

export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  return userCredential.user
}

export const signIn = async (email: string, password: string) => {
  try {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )
  return userCredential.user
} catch (error : any) {
  console.log("Login error:", error.code)
  throw error
}
}

export const Logout = async () => {
  await fisignOut(auth)
}