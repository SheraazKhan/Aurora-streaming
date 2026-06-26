"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Search, Bell, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeSelector from "@/components/ThemeSelector";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { user, googleSignIn, logOut } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3 transition-all duration-500 lg:px-10 lg:py-4 ${
        isScrolled
          ? "bg-surface-0/95 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent bg-linear-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-white font-bold text-xl hidden sm:block tracking-tight">Aurora</span>
        </Link>

        <ul className="hidden space-x-1 md:flex">
          {[
            { href: "/", label: "Home" },
            { href: "/tv-shows", label: "TV Shows" },
            { href: "/movies", label: "Movies" },
            { href: "/new-popular", label: "New & Popular" },
            { href: "/mood", label: "Mood" },
            { href: "/my-list", label: "My List" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white/10 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-3">
        <Link href="/search" className="p-2 rounded-lg hover:bg-white/10 transition">
          <Search className="h-5 w-5 text-gray-300 hover:text-white transition" />
        </Link>

        <button className="p-2 rounded-lg hover:bg-white/10 transition relative">
          <Bell className="h-5 w-5 text-gray-300" />
        </button>

        {user ? (
          <div className="group relative flex items-center pb-1 cursor-pointer">
            <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/10 transition">
              <div className="relative h-7 w-7">
                <Image
                  src={user.photoURL || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"}
                  alt="Account"
                  fill
                  className="rounded-lg object-cover"
                  sizes="28px"
                />
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </div>

            <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
              <div className="glass-card p-3 min-w-[180px] animate-scale-in">
                <div className="mb-3 border-b border-white/10 pb-3">
                  <p className="text-white text-sm font-medium truncate">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>

                <Link
                  href="/profiles"
                  className="flex items-center w-full space-x-2 text-gray-300 text-sm hover:text-white py-2 transition"
                >
                  <span>Manage Profiles</span>
                </Link>

                <Link
                  href="/stats"
                  className="flex items-center w-full space-x-2 text-gray-300 text-sm hover:text-white py-2 transition"
                >
                  <span>Viewing Stats</span>
                </Link>

                <div className="py-2 border-t border-white/10 mt-1 pt-3">
                  <ThemeSelector />
                </div>

                <button
                  onClick={() => logOut()}
                  className="flex items-center w-full space-x-2 text-gray-300 text-sm hover:text-white py-2 mt-1 border-t border-white/10 pt-3 transition"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={googleSignIn}
            className="bg-accent px-4 py-1.5 rounded-lg text-black font-semibold text-sm hover:bg-accent-hover transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
