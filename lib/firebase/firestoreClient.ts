import {collection,addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore'
import { db } from '../FirebaseConfig'
import { StudyBook, UserProfile, WeeklyTask } from '../types'; 

export async function addBook(userId: string, book: Omit<StudyBook, "id">) {
  const docRef = await addDoc(
    collection(db, "users", userId, "books"),
    book
  )

  return {
    id: docRef.id,
    ...book,
  }
}

export async function updateBook(userId: string, bookId: string, updatedData: Partial<StudyBook>) {
  try {
    const bookRef = doc(db, "users", userId, "books", bookId);
    await updateDoc(bookRef, updatedData);
    console.log("Book updated in Firestore for user:", userId)
  } catch (error) {
    console.error("Error updating book: ", error);
  }
}

export async function deleteBook(userId: string, bookId: string) {
  try {
    await deleteDoc(doc(db, "users", userId, "books", bookId));
  } catch (error) {
    console.error("Error deleting book: ", error);
  }
}

export async function addWeeklyTask(userId: string, weeklyTask: Omit<WeeklyTask, "id">) {
  const docRef = await addDoc(
    collection(db, "users", userId, "weeklyTasks"),
    weeklyTask
  );

  return {
    id: docRef.id,
    ...weeklyTask,
  };
}

export async function updateWeeklyTask(userId: string, taskId: string, updatedData: Partial<WeeklyTask>) {
  try {
    const weeklyTaskRef = doc(db, "users", userId, "weeklyTasks", taskId);
    await updateDoc(weeklyTaskRef, updatedData);
    console.log("Weekly task updated in Firestore for user:", userId);
  } catch (error) {
    console.error("Error updating weekly task: ", error);
  }
}

export async function deleteWeeklyTask(userId: string, taskId: string) {
  try {
    await deleteDoc(doc(db, "users", userId, "weeklyTasks", taskId)); 
  } catch (error) {
    console.error("Error deleting weekly task: ", error);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {

  const docRef = doc(db, "users", userId)
  const snapshot = await getDoc(docRef)

  if (!snapshot.exists()) return null

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<UserProfile, "id">)
  }
}