import {collection,addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore'
import { db } from '../FirebaseConfig'
import { StudyBook, StudyTask, UserProfile } from '../types'; 

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

export async function getBooks(userId: string): Promise<StudyBook[]>{
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "books"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<StudyBook, 'id'>
    }));
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
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

export async function getTasks(userId: string): Promise<StudyTask[]> {

  const snapshot = await getDocs(
    collection(db, "users", userId, "tasks")
  )

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data() as Omit<StudyTask, 'id'>
  }))
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