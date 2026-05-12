import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const GUEST_PROFILE_KEY = 'mindease_guest_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsGuest(false);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          } else {
            const newProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Friend',
              email: firebaseUser.email,
              calmPoints: 0,
              streak: 0,
              avatarUrl: firebaseUser.photoURL,
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        // Handle Guest Mode
        const savedGuest = localStorage.getItem(GUEST_PROFILE_KEY);
        if (savedGuest) {
          const parsed = JSON.parse(savedGuest);
          setProfile(parsed);
          setUser({ uid: parsed.uid, displayName: parsed.displayName });
        } else {
          const newGuest = {
            uid: 'guest_' + Math.random().toString(36).substr(2, 9),
            displayName: 'Guest Friend',
            calmPoints: 0,
            streak: 0,
            createdAt: new Date().toISOString(),
            isGuest: true
          };
          localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(newGuest));
          setProfile(newGuest);
          setUser({ uid: newGuest.uid, displayName: newGuest.displayName });
        }
        setIsGuest(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_PROFILE_KEY);
      window.location.reload();
    } else {
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, isGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
