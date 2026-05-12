import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, Timestamp, deleteDoc, doc, updateDoc, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from '../hooks/useAuth';

export function useFirestore() {
  const { user, isGuest } = useAuth();

  const addMood = async (level: number, emotions: string[], note: string) => {
    if (!user) return;
    
    const moodData = {
      userId: user.uid,
      level,
      emotions,
      note,
      timestamp: isGuest ? new Date().toISOString() : Timestamp.now(),
    };

    if (isGuest) {
      const existing = localStorage.getItem('guest_moods');
      const moods = existing ? JSON.parse(existing) : [];
      moods.unshift({ id: Date.now().toString(), ...moodData });
      localStorage.setItem('guest_moods', JSON.stringify(moods));
      // Trigger a custom event to notify listeners in the same window
      window.dispatchEvent(new Event('guest_storage_update'));
      return;
    }

    try {
      await addDoc(collection(db, 'moods'), moodData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'moods');
    }
  };

  const addJournalEntry = async (content: string, title: string = 'Daily Journal') => {
    if (!user) return;

    const entryData = {
      userId: user.uid,
      content,
      title,
      timestamp: isGuest ? new Date().toISOString() : Timestamp.now(),
      isLocked: false,
    };

    if (isGuest) {
      const existing = localStorage.getItem('guest_journal');
      const entries = existing ? JSON.parse(existing) : [];
      entries.unshift({ id: Date.now().toString(), ...entryData });
      localStorage.setItem('guest_journal', JSON.stringify(entries));
      window.dispatchEvent(new Event('guest_storage_update'));
      return;
    }

    try {
      await addDoc(collection(db, 'journal'), entryData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'journal');
    }
  };

  const addPost = async (content: string) => {
    if (!user) return;

    const postData = {
      authorId: user.uid,
      authorHandle: 'Anonymous ' + user.uid.slice(0, 4),
      content,
      timestamp: isGuest ? new Date().toISOString() : Timestamp.now(),
      reportCount: 0,
    };

    if (isGuest) {
      const existing = localStorage.getItem('guest_community');
      const posts = existing ? JSON.parse(existing) : [];
      posts.unshift({ id: Date.now().toString(), ...postData });
      localStorage.setItem('guest_community', JSON.stringify(posts));
      window.dispatchEvent(new Event('guest_storage_update'));
      return;
    }

    try {
      await addDoc(collection(db, 'community'), postData);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'community');
    }
  };

  return { addMood, addJournalEntry, addPost };
}

export function useMoods() {
  const { user, isGuest } = useAuth();
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (isGuest) {
      const loadGuestMoods = () => {
        const existing = localStorage.getItem('guest_moods');
        const data = existing ? JSON.parse(existing) : [];
        setMoods(data.map((m: any) => ({
          ...m,
          timestamp: { 
            toDate: () => new Date(m.timestamp),
            seconds: Math.floor(new Date(m.timestamp).getTime() / 1000)
          }
        })));
        setLoading(false);
      };
      loadGuestMoods();
      window.addEventListener('guest_storage_update', loadGuestMoods);
      return () => window.removeEventListener('guest_storage_update', loadGuestMoods);
    }

    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  return { moods, loading };
}

export function useJournalEntries() {
  const { user, isGuest } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (isGuest) {
      const loadGuestJournal = () => {
        const existing = localStorage.getItem('guest_journal');
        const data = existing ? JSON.parse(existing) : [];
        setEntries(data.map((m: any) => ({
          ...m,
          timestamp: { 
            toDate: () => new Date(m.timestamp),
            seconds: Math.floor(new Date(m.timestamp).getTime() / 1000)
          }
        })));
        setLoading(false);
      };
      loadGuestJournal();
      window.addEventListener('guest_storage_update', loadGuestJournal);
      return () => window.removeEventListener('guest_storage_update', loadGuestJournal);
    }

    const q = query(
      collection(db, 'journal'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  return { entries, loading };
}

export function useCommunityPosts() {
  const { isGuest } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      const loadGuestPosts = () => {
        const existing = localStorage.getItem('guest_community');
        const data = existing ? JSON.parse(existing) : [];
        setPosts(data.map((m: any) => ({
          ...m,
          timestamp: { 
            toDate: () => new Date(m.timestamp),
            seconds: Math.floor(new Date(m.timestamp).getTime() / 1000)
          }
        })));
        setLoading(false);
      };
      loadGuestPosts();
      window.addEventListener('guest_storage_update', loadGuestPosts);
      return () => window.removeEventListener('guest_storage_update', loadGuestPosts);
    }

    const q = query(collection(db, 'community'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  return { posts, loading };
}
