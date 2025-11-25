import { IUser } from "@/types/user";
import { create } from "zustand";

interface UserState {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoaded: boolean;
}

interface AuthStore extends UserState {
  setAuthStore: (newVal: Pick<UserState, "isAuthenticated" | "user">) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoaded: false,
  setAuthStore: (newVal: Pick<UserState, "isAuthenticated" | "user">) =>
    set({ ...newVal, isLoaded: true }),
}));

export default useAuthStore;
