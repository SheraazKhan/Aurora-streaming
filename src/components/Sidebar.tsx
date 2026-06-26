"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Tv, Film, Heart, User, Sparkles, Calendar, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/tv-shows", icon: Tv, label: "TV Shows" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/new-popular", icon: Sparkles, label: "New" },
  { href: "/my-list", icon: Heart, label: "My List" },
  { href: "/mood", icon: Sparkles, label: "Mood" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/stats", icon: BarChart3, label: "Stats" },
  { href: "/profiles", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-full w-20 bg-surface-0/90 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-8 gap-2">
      <Link href="/" className="mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={22} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
