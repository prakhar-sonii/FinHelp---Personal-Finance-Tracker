import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("useTransactions: User state changed", user ? user.uid : "No user");
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', user.uid || user.id) // Fallback for id if uid is missing in some contexts
    )

    console.log("useTransactions: Setting up snapshot listener for uid", user.uid || user.id);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("useTransactions: Snapshot received", snapshot.size, "docs");
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // Sort by createdAt desc locally since we didn't add index yet
      docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setTransactions(docs)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching transactions:", error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addTransaction = async (data) => {
    if (!user) return
    console.log("useTransactions: Adding transaction", data);
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...data,
        uid: user.uid || user.id,
        createdAt: new Date().toISOString()
      })
      console.log("useTransactions: Transaction added with ID", docRef.id);
    } catch (e) {
      console.error("Error adding transaction: ", e)
    }
  }

  const updateTransaction = async (id, data) => {
    if (!user) return
    try {
      const txRef = doc(db, 'transactions', id)
      await updateDoc(txRef, data)
    } catch (e) {
      console.error("Error updating transaction: ", e)
    }
  }

  const deleteTransaction = async (id) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, 'transactions', id))
    } catch (e) {
      console.error("Error deleting transaction: ", e)
    }
  }

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const balance = income - expense

  return { transactions, loading, income, expense, balance, addTransaction, updateTransaction, deleteTransaction }
}
