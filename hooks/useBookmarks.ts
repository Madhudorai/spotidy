import { create } from "zustand";

export interface Bookmark {
  id: string;
  songId: string;
  timestamp: number;
  name: string;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "id">) => void;
  updateBookmark: (id: string, name: string) => void;
  removeBookmark: (id: string) => void;
  getBookmarksForSong: (songId: string) => Bookmark[];
  clearBookmarks: () => void;
}

const useBookmarks = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  
  addBookmark: (bookmarkData) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Math.random().toString(36).substring(2, 9),
    };
    
    set((state) => ({
      bookmarks: [...state.bookmarks, newBookmark]
    }));
  },
  
  updateBookmark: (id, name) => {
    set((state) => ({
      bookmarks: state.bookmarks.map(bookmark => 
        bookmark.id === id ? { ...bookmark, name } : bookmark
      )
    }));
  },
  
  removeBookmark: (id) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id)
    }));
  },
  
  getBookmarksForSong: (songId) => {
    return get().bookmarks.filter(bookmark => bookmark.songId === songId);
  },
  
  clearBookmarks: () => {
    set({ bookmarks: [] });
  }
}));

export default useBookmarks;