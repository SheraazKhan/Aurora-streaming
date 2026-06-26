import { create } from 'zustand';
import type { MediaItem } from '../../types/movie';

interface ModalState {
  isOpen: boolean;
  isPlaying: boolean;
  selectedMovie: MediaItem | null;
  openModal: (movie: MediaItem) => void;
  closeModal: () => void;
  setPlaying: (status: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  isPlaying: false,
  selectedMovie: null,
  openModal: (movie) => set({ isOpen: true, selectedMovie: movie, isPlaying: false }),
  closeModal: () => set({ isOpen: false, selectedMovie: null, isPlaying: false }),
  setPlaying: (status) => set({ isPlaying: status }),
}));
