import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MovieModal from "@/components/Modal";
import ToastContainer from "@/components/ui/Toast";
import MiniPlayer from "@/components/player/MiniPlayer";
import { AuthContextProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora",
  description: "Your personal streaming hub",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aurora",
  },
};

export const viewport: Viewport = {
  themeColor: "#14b8a6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthContextProvider>
          <ProfileProvider>
            <Navbar />
            {children}
            <MovieModal />
            <MiniPlayer />
            <ToastContainer />
            <ServiceWorkerRegistrar />
          </ProfileProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
