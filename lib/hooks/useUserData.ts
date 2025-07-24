import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  username: string | null;
  school: string | null;
  currentGrade: number | null;
  xp: number;
  gold: number;
  createdAt: string;
}

export function useUserData() {
  const { data: session, update: updateSession } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data.user);
      setError(null);

      // Update the session with fresh data
      await updateSession({
        ...session,
        user: {
          ...session.user,
          xp: data.user.xp,
          gold: data.user.gold,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch user data"
      );
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [session, updateSession]);

  const refreshUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    loading,
    error,
    refreshUserData,
  };
}
