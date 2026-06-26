export interface MoodConfig {
  name: string;
  emoji: string;
  description: string;
  genres: number[];
  color: string;
}

export const moods: Record<string, MoodConfig> = {
  "feel-good": {
    name: "Feel-Good",
    emoji: "😊",
    description: "Uplifting stories to brighten your day",
    genres: [35, 10751, 10749],
    color: "from-yellow-400 to-orange-400",
  },
  thrilling: {
    name: "Thrilling",
    emoji: "😰",
    description: "Edge-of-your-seat suspense and action",
    genres: [28, 53, 80],
    color: "from-red-500 to-orange-600",
  },
  "mind-bending": {
    name: "Mind-Bending",
    emoji: "🤯",
    description: "Thought-provoking films that challenge reality",
    genres: [878, 9648, 14],
    color: "from-purple-500 to-indigo-600",
  },
  romantic: {
    name: "Romantic",
    emoji: "💕",
    description: "Love stories and heartfelt connections",
    genres: [10749, 18],
    color: "from-pink-400 to-rose-500",
  },
  scary: {
    name: "Scary",
    emoji: "👻",
    description: "Horror and supernatural thrills",
    genres: [27, 9648],
    color: "from-gray-700 to-gray-900",
  },
  "laugh-out-loud": {
    name: "Laugh Out Loud",
    emoji: "😂",
    description: "Comedies that will make you crack up",
    genres: [35],
    color: "from-green-400 to-teal-500",
  },
  epic: {
    name: "Epic Adventure",
    emoji: "⚔️",
    description: "Grand journeys and heroic tales",
    genres: [12, 14, 28],
    color: "from-amber-500 to-yellow-600",
  },
  chill: {
    name: "Chill & Relax",
    emoji: "🧘",
    description: "Easy-going documentaries and calm stories",
    genres: [99, 10402, 36],
    color: "from-teal-400 to-cyan-500",
  },
};
