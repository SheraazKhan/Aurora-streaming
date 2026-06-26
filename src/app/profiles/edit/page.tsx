"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { ArrowLeft, Trash2 } from "lucide-react";

const maturityOptions = [
  { value: "all", label: "All Ages" },
  { value: "pg", label: "Children (PG)" },
  { value: "pg13", label: "Teens (PG-13)" },
  { value: "r", label: "Adults (R)" },
] as const;

function EditProfileContent() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const { profiles, editProfile, removeProfile } = useProfile();
  const router = useRouter();
  const profile = profiles.find((p) => p.id === profileId);

  const [name, setName] = useState("");
  const [isKids, setIsKids] = useState(false);
  const [maturity, setMaturity] = useState<"all" | "pg" | "pg13" | "r">("r");
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setIsKids(profile.isKids);
      setMaturity(profile.maturityLevel);
      setLanguage(profile.language);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Profile not found
      </div>
    );
  }

  const handleSave = async () => {
    await editProfile(profile.id, { name, isKids, maturityLevel: maturity, language });
    router.push("/profiles");
  };

  const handleDelete = async () => {
    await removeProfile(profile.id);
    router.push("/profiles");
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 max-w-xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">Edit Profile</h1>

      <div className="space-y-6">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-2 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-accent outline-none"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">Maturity Rating</label>
          <div className="grid grid-cols-2 gap-2">
            {maturityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMaturity(opt.value)}
                className={`px-4 py-3 rounded-xl text-sm transition border ${
                  maturity === opt.value
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-surface-2 border-white/10 text-gray-300 hover:border-white/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-2 rounded-xl p-4 border border-white/10">
          <div>
            <p className="text-white text-sm font-medium">Kids Profile</p>
            <p className="text-gray-500 text-xs">Only show kid-friendly content</p>
          </div>
          <button
            onClick={() => setIsKids(!isKids)}
            className={`w-12 h-6 rounded-full transition-all ${isKids ? "bg-accent" : "bg-surface-3"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isKids ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-surface-2 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-accent outline-none"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={handleSave} className="flex-1 bg-accent text-black font-semibold py-3 rounded-xl hover:bg-accent-hover transition">
            Save
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <EditProfileContent />
    </Suspense>
  );
}
