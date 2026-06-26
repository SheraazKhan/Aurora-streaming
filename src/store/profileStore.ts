import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile } from "@/lib/firestore";

interface ProfileState {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (profile) => set({ activeProfile: profile }),
    }),
    { name: "aurora-profile" }
  )
);
