"use client";
import Image from "next/image";
import type { CastMember } from "../../types/movie";

interface CastSectionProps {
  cast: CastMember[];
}

export default function CastSection({ cast }: CastSectionProps) {
  if (cast.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Cast</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {cast.map((member) => (
          <div key={member.id} className="flex-none w-24 text-center group">
            <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-surface-2">
              {member.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">
                  {member.name[0]}
                </div>
              )}
            </div>
            <p className="text-xs text-white mt-2 truncate">{member.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
