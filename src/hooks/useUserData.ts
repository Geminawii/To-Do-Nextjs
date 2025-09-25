
'use client'

// to avoid hydration-related errors
import { useEffect, useState } from 'react';

interface UserData {
  username?: string;
  email?: string;
  avatar?: string;
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw) {
        setUserData(JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Failed to parse userData:", e);
    } finally {
      setHasMounted(true);
    }
  }, []);

  return { userData, hasMounted };
}
