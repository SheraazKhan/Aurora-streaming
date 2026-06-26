"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useProfileStore } from "@/store/profileStore";
import {
  getProfiles, createProfile, updateProfile, deleteProfile,
  type Profile, getDefaultAvatar,
} from "@/lib/firestore";

interface ProfileContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  loading: boolean;
  selectProfile: (profile: Profile) => void;
  addProfile: (name: string, isKids?: boolean) => Promise<void>;
  editProfile: (profileId: string, data: Partial<Profile>) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeProfile, setActiveProfile } = useProfileStore();

  const loadProfiles = useCallback(async () => {
    if (!user?.email) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    try {
      const result = await getProfiles(user.email);
      setProfiles(result);
      if (result.length === 0) {
        const id = await createProfile(user.email, {
          name: user.displayName || "User",
          avatar: getDefaultAvatar(0),
          isKids: false,
          maturityLevel: "r",
          language: "en",
        });
        const newProfiles = await getProfiles(user.email);
        setProfiles(newProfiles);
        const defaultProfile = newProfiles.find((p) => p.id === id);
        if (defaultProfile) setActiveProfile(defaultProfile);
      } else if (!activeProfile || !result.find((p) => p.id === activeProfile.id)) {
        setActiveProfile(result[0]);
      }
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [user, activeProfile, setActiveProfile]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const selectProfile = (profile: Profile) => setActiveProfile(profile);

  const addProfile = async (name: string, isKids = false) => {
    if (!user?.email || profiles.length >= 5) return;
    await createProfile(user.email, {
      name,
      avatar: getDefaultAvatar(profiles.length),
      isKids,
      maturityLevel: isKids ? "pg" : "r",
      language: "en",
    });
    await loadProfiles();
  };

  const editProfile = async (profileId: string, data: Partial<Profile>) => {
    if (!user?.email) return;
    await updateProfile(user.email, profileId, data);
    await loadProfiles();
  };

  const removeProfile = async (profileId: string) => {
    if (!user?.email || profiles.length <= 1) return;
    await deleteProfile(user.email, profileId);
    if (activeProfile?.id === profileId) {
      setActiveProfile(null);
    }
    await loadProfiles();
  };

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, loading, selectProfile, addProfile, editProfile, removeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
}
