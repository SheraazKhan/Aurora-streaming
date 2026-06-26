"use client";
import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import type { Profile } from "@/lib/firestore";

const avatarColors = [
  "from-teal-400 to-cyan-500",
  "from-indigo-400 to-purple-500",
  "from-yellow-400 to-orange-500",
  "from-pink-400 to-rose-500",
  "from-green-400 to-emerald-500",
];

export default function ProfilesPage() {
  const { profiles, selectProfile, addProfile, loading } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();

  const handleSelect = (profile: Profile) => {
    selectProfile(profile);
    router.push("/");
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addProfile(newName.trim());
    setNewName("");
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Who&apos;s Watching?</h1>
      <p className="text-gray-400 mb-12">Select your profile</p>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {profiles.map((profile, index) => (
          <button
            key={profile.id}
            onClick={() => editMode ? router.push(`/profiles/edit?id=${profile.id}`) : handleSelect(profile)}
            className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
          >
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-4xl md:text-5xl shadow-lg relative`}>
              {profile.avatar}
              {editMode && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <Pencil className="text-white" size={24} />
                </div>
              )}
              {profile.isKids && (
                <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  KIDS
                </span>
              )}
            </div>
            <span className="text-gray-300 text-sm group-hover:text-white transition">{profile.name}</span>
          </button>
        ))}

        {profiles.length < 5 && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-accent transition">
              <Plus className="text-gray-500 group-hover:text-accent transition" size={40} />
            </div>
            <span className="text-gray-500 text-sm group-hover:text-accent transition">Add Profile</span>
          </button>
        )}
      </div>

      {showAdd && (
        <div className="glass-card p-6 w-full max-w-sm animate-scale-in">
          <h3 className="text-white font-semibold mb-4">Add Profile</h3>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-surface-2 text-white px-4 py-2.5 rounded-lg border border-white/10 focus:border-accent outline-none mb-4"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-3">
            <button onClick={handleAdd} className="flex-1 bg-accent text-black font-semibold py-2 rounded-lg hover:bg-accent-hover transition">
              Create
            </button>
            <button onClick={() => setShowAdd(false)} className="flex-1 bg-surface-2 text-white py-2 rounded-lg hover:bg-surface-3 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setEditMode(!editMode)}
        className={`mt-8 px-6 py-2 rounded-lg border text-sm font-medium transition ${
          editMode
            ? "border-accent text-accent"
            : "border-gray-600 text-gray-400 hover:text-white hover:border-white"
        }`}
      >
        {editMode ? "Done" : "Manage Profiles"}
      </button>
    </div>
  );
}
