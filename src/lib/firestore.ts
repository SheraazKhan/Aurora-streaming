import {
  doc, setDoc, getDoc, getDocs, deleteDoc, updateDoc,
  collection, arrayUnion, arrayRemove, onSnapshot,
  serverTimestamp, query, orderBy, limit,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  maturityLevel: "all" | "pg" | "pg13" | "r";
  language: string;
  createdAt: unknown;
}

export interface WatchHistoryEntry {
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  backdropPath: string;
  progress: number;
  duration: number;
  season?: number;
  episode?: number;
  lastWatched: unknown;
  completed: boolean;
}

export interface Rating {
  mediaId: number;
  rating: "up" | "down" | "love";
  timestamp: unknown;
}

export interface UserPreferences {
  autoPlayNext: boolean;
  autoPlayPreviews: boolean;
  theme: string;
}

const AVATARS = [
  "🟦", "🟩", "🟨", "🟧", "🟪",
  "🔵", "🟢", "🟡", "🟠", "🟣",
];

export function getDefaultAvatar(index: number): string {
  return AVATARS[index % AVATARS.length];
}

// --- Profiles ---

export async function getProfiles(email: string): Promise<Profile[]> {
  const snap = await getDocs(collection(db, "users", email, "profiles"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Profile));
}

export async function createProfile(email: string, profile: Omit<Profile, "id" | "createdAt">): Promise<string> {
  const profileRef = doc(collection(db, "users", email, "profiles"));
  await setDoc(profileRef, { ...profile, createdAt: serverTimestamp() });
  return profileRef.id;
}

export async function updateProfile(email: string, profileId: string, data: Partial<Profile>): Promise<void> {
  await updateDoc(doc(db, "users", email, "profiles", profileId), data);
}

export async function deleteProfile(email: string, profileId: string): Promise<void> {
  await deleteDoc(doc(db, "users", email, "profiles", profileId));
}

// --- Watch History ---

export async function saveWatchProgress(
  email: string,
  profileId: string,
  entry: WatchHistoryEntry
): Promise<void> {
  const docRef = doc(db, "users", email, "profiles", profileId, "watchHistory", String(entry.mediaId));
  await setDoc(docRef, { ...entry, lastWatched: serverTimestamp() }, { merge: true });
}

export async function getWatchHistory(
  email: string,
  profileId: string,
  maxItems: number = 20
): Promise<WatchHistoryEntry[]> {
  const q = query(
    collection(db, "users", email, "profiles", profileId, "watchHistory"),
    orderBy("lastWatched", "desc"),
    limit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WatchHistoryEntry);
}

export function subscribeWatchHistory(
  email: string,
  profileId: string,
  callback: (entries: WatchHistoryEntry[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "users", email, "profiles", profileId, "watchHistory"),
    orderBy("lastWatched", "desc"),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data() as WatchHistoryEntry));
  });
}

// --- Ratings ---

export async function setRating(
  email: string,
  profileId: string,
  mediaId: number,
  rating: Rating["rating"]
): Promise<void> {
  await setDoc(
    doc(db, "users", email, "profiles", profileId, "ratings", String(mediaId)),
    { mediaId, rating, timestamp: serverTimestamp() }
  );
}

export async function getRating(
  email: string,
  profileId: string,
  mediaId: number
): Promise<Rating | null> {
  const snap = await getDoc(doc(db, "users", email, "profiles", profileId, "ratings", String(mediaId)));
  return snap.exists() ? (snap.data() as Rating) : null;
}

export async function getAllRatings(
  email: string,
  profileId: string
): Promise<Rating[]> {
  const snap = await getDocs(collection(db, "users", email, "profiles", profileId, "ratings"));
  return snap.docs.map((d) => d.data() as Rating);
}

// --- Saved Shows (legacy compat + new per-profile) ---

export async function toggleSavedShow(
  email: string,
  show: { id: number; title: string; img: string; overview?: string; release_date?: string; first_air_date?: string; vote_average?: number; media_type?: string },
  add: boolean
): Promise<void> {
  const userDoc = doc(db, "users", email);
  if (add) {
    await setDoc(userDoc, { savedShows: arrayUnion(show) }, { merge: true });
  } else {
    await updateDoc(userDoc, { savedShows: arrayRemove(show) });
  }
}

// --- Preferences ---

export async function getPreferences(
  email: string,
  profileId: string
): Promise<UserPreferences> {
  const snap = await getDoc(doc(db, "users", email, "profiles", profileId, "preferences", "settings"));
  const defaults: UserPreferences = { autoPlayNext: true, autoPlayPreviews: true, theme: "aurora" };
  return snap.exists() ? { ...defaults, ...snap.data() } : defaults;
}

export async function savePreferences(
  email: string,
  profileId: string,
  prefs: Partial<UserPreferences>
): Promise<void> {
  await setDoc(
    doc(db, "users", email, "profiles", profileId, "preferences", "settings"),
    prefs,
    { merge: true }
  );
}
