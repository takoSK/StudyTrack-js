import {collection,addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc} from 'firebase/firestore'
import { db } from '../FirebaseConfig'

export async function addBook(userId: string, book: any) {
  try {
    await addDoc(collection(db, "users", userId, "books"), book);
    console.log("Book added to Firestore for user:", userId)
  } catch (error) {
    console.error("Error adding book: ", error);
  }
}

export async function getBooks(userId: string) {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "books"));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()    }));
  } catch (error) {
    console.error("Error fetching books: ", error);
    return [];
  }
}

export async function getUserProfile(userId: string) {

  const snapshot = await getDoc(doc(db, "users", userId))

  if (!snapshot.exists()) return null

  return {
    id: snapshot.id,
    ...snapshot.data()
  }
}