import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from '../hooks/useAuth';

export function useFirestore() {
  const { user } = useAuth();

  const addMood = async (level: number, emotions: string[], note: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'moods'), {
        userId: user.uid,
        level,
        emotions,
        note,
        timestamp: Timestamp.now(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'moods');
    }
  };

  const addJournalEntry = async (content: string, title: string = 'Daily Journal') => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'journal'), {
        userId: user.uid,
        content,
        title,
        timestamp: Timestamp.now(),
        isLocked: false,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'journal');
    }
  };

  const addPost = async (content: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'community'), {
        authorId: user.uid,
        authorHandle: 'Anonymous ' + user.uid.slice(0, 4),
        content,
        timestamp: Timestamp.now(),
        reportCount: 0,
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'community');
    }
  };

  return { addMood, addJournalEntry, addPost };
}
