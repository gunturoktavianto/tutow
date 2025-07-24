"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useUserData } from "@/lib/hooks/useUserData";

interface UserDataContextType {
  userData: any;
  loading: boolean;
  error: string | null;
  refreshUserData: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const userDataHook = useUserData();

  return (
    <UserDataContext.Provider value={userDataHook}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserDataContext() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error(
      "useUserDataContext must be used within a UserDataProvider"
    );
  }
  return context;
}
