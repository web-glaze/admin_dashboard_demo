"use client";

import { useRef } from "react";
import useAuthStore from "../useAuthStore";
import { IUser } from "@/types/user";

interface UserStoreInitializerProps {
  isAuthenticated: boolean;
  user: IUser | null;
}

function UserStoreInitializer({
  isAuthenticated,
  user,
}: UserStoreInitializerProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAuthStore.setState({ isAuthenticated, user, isLoaded: true });
    initialized.current = true;
  }

  return null;
}

export default UserStoreInitializer;
