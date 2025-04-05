"use client";

import { Song } from "@/types";
import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useSound from "use-sound";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import PlaybackProgress from "./PlaybackProgress";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { RiDeleteBinLine } from "react-icons/ri";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useBookmarks, { Bookmark } from "@/hooks/useBookmarks";
import AddBookmarkButton from "./AddBookmarkButton";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showBookmarksPane, setShowBookmarksPane] = useState(false);
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);
  const [editingBookmarkName, setEditingBookmarkName] = useState("");
  
  // Bookmarks functionality
  const bookmarksStore = useBookmarks();
  const songBookmarks = bookmarksStore.getBookmarksForSong(song.id);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const [play, { pause, stop, sound }] = useSound(
    songUrl,
    {
      volume: volume,
      onplay: () => {
        console.log("onplay triggered");
        setIsPlaying(true);
      },
      onend: () => {
        console.log("onend triggered");
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => {
        console.log("onpause triggered");
        setIsPlaying(false);
      },
      format: ["mp3"],
      // Add HTML5 option to force using HTML5 Audio
      html5: true,
      interrupt: false, // Prevent interrupting the current sound
    }
  );

  // Handle the sound when it loads
  useEffect(() => {
    console.log("Sound loaded:", !!sound, "URL:", songUrl);
    
    // Set duration when sound is ready
    if (sound) {
      const duration = sound.duration();
      console.log("Sound duration:", duration);
      setDuration(duration);
      
      // Debug sound object
      console.log("Sound state:", sound.state());
      
      // Automatically start playing when a new song is loaded
      play();
    }
    
    return () => {
      // Clean up when unmounting or when sound changes
      if (sound) {
        console.log("Cleaning up sound object");
        sound.unload();
      }
    };
  }, [sound, play, songUrl]);
  
  // Handle position updates in a separate effect
  useEffect(() => {
    // Only set up interval when we have a sound object and it's playing
    if (!sound || !isPlaying) return;
    
    console.log("Setting up position tracking interval");
    
    const interval = setInterval(() => {
      try {
        const currentPosition = sound.seek();
        if (typeof currentPosition === 'number' && !isNaN(currentPosition)) {
          setCurrentTime(currentPosition);
        }
      } catch (error) {
        console.error("Error reading sound position:", error);
      }
    }, 100); // Update more frequently for smoother progress updates
    
    return () => {
      clearInterval(interval);
    };
  }, [sound, isPlaying]);

  const handlePlay = () => {
    if (!isPlaying) {
      console.log("Playing song");
      play();
    } else {
      console.log("Pausing song");
      pause();
    }
  };

  const handleSeek = (time: number) => {
    console.log("Handling seek to:", time);
    
    if (sound) {
      try {
        console.log("Setting sound position to:", time);
        sound.seek(time);
        setCurrentTime(time);
        
        // Don't auto-play when seeking while paused
        // Just update the position
      } catch (error) {
        console.error("Error seeking:", error);
      }
    } else {
      console.warn("Seek called but no sound object available");
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };
  
  // Handle adding a bookmark
  const handleAddBookmark = (name: string, timestamp: number) => {
    bookmarksStore.addBookmark({
      songId: song.id,
      timestamp: timestamp,
      name: name
    });
  };
  
  // Handle editing a bookmark
  const handleEditBookmark = (id: string, currentName: string) => {
    setEditingBookmarkId(id);
    setEditingBookmarkName(currentName);
  };
  
  // Handle saving edited bookmark
  const handleSaveBookmark = () => {
    if (editingBookmarkId) {
      bookmarksStore.updateBookmark(editingBookmarkId, editingBookmarkName);
      setEditingBookmarkId(null);
      setEditingBookmarkName("");
    }
  };
  
  // Handle updating a bookmark name
  const handleUpdateBookmark = (id: string, name: string) => {
    bookmarksStore.updateBookmark(id, name);
  };
  
  // Handle deleting a bookmark
  const handleDeleteBookmark = (id: string) => {
    bookmarksStore.removeBookmark(id);
  };
  
  // Format time to mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="
    grid
    grid-cols-2
    md:grid-cols-3
    h-full
    "
    >
      <div
        className="
      flex
      w-full
      justify-start
      pt-6.5
      "
      >
        <div
          className="
        flex
        items-center
        gap-x-4
        "
        >
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div
        className="
      hidden
      h-full
      md:flex
      justify-center
      items-center
      w-full
      max-w-[722px]
      "
      >
        <div
          onClick={handlePlay}
          className="
          flex
          items-center
          justify-center
          h-12
          w-12
          rounded-full
          bg-white
          p-1
          cursor-pointer
          hover:scale-110
          transition
          mt-4"
        >
          <Icon size={36} className="text-black" />
        </div>
      </div>

      <div
        className="
      hidden
      md:flex
      w-full
      justify-end
      pr-2
      pt-6.5
      "
      >
        <div
          className="
        flex
        items-center
        gap-x-2
        w-[120px]
        "
        >
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>

      {/* Playback Progress */}
      <div className="w-full col-span-2 md:col-span-3 absolute top-0 left-0 right-0 px-4" style={{ visibility: 'visible', display: 'block' }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <PlaybackProgress
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              bookmarks={songBookmarks}
            />
          </div>
          <div className="flex items-center ml-4">
            <AddBookmarkButton 
              onAdd={handleAddBookmark}
              currentTime={currentTime}
            />
            <button
              onClick={() => setShowBookmarksPane(!showBookmarksPane)}
              className="ml-3 text-neutral-400 hover:text-white"
              title={showBookmarksPane ? "Hide bookmarks" : "Show bookmarks"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showBookmarksPane ? "M5 10l7-7 7 7" : "M19 14l-7-7-7 7"} />
              </svg>
            </button>
          </div>
        </div>
        
        {showBookmarksPane && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-b-none absolute bottom-[100px] left-0 right-0 p-4 max-h-[300px] overflow-y-auto z-30 shadow-lg">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white text-sm font-bold">Bookmarks</h3>
              <span className="text-neutral-400 text-xs">{songBookmarks.length} total</span>
            </div>
            {songBookmarks.length === 0 ? (
              <p className="text-neutral-400 text-xs">No bookmarks yet</p>
            ) : (
              <ul className="space-y-2">
                {songBookmarks.sort((a, b) => a.timestamp - b.timestamp).map((bookmark) => (
                  <li key={bookmark.id} className="flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-md p-2 text-sm">
                    {editingBookmarkId === bookmark.id ? (
                      // Editing mode
                      <div className="flex-1 flex items-center">
                        <span className="text-green-400 font-mono mr-2">
                          {formatTime(bookmark.timestamp)}
                        </span>
                        <input
                          type="text"
                          value={editingBookmarkName}
                          onChange={(e) => setEditingBookmarkName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveBookmark()}
                          onBlur={handleSaveBookmark}
                          className="flex-1 bg-neutral-700 text-white p-1 rounded"
                          autoFocus
                        />
                      </div>
                    ) : (
                      // Display mode
                      <div 
                        className="flex-1 cursor-pointer overflow-hidden" 
                        onClick={() => handleSeek(bookmark.timestamp)}
                        onDoubleClick={() => handleEditBookmark(bookmark.id, bookmark.name)}
                      >
                        <div className="flex items-center">
                          <span className="text-green-400 font-mono mr-2">
                            {formatTime(bookmark.timestamp)}
                          </span>
                          <span className="text-white font-medium truncate">
                            {bookmark.name || "Unnamed bookmark"}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      {editingBookmarkId !== bookmark.id && (
                        <button 
                          onClick={() => handleEditBookmark(bookmark.id, bookmark.name)}
                          className="ml-2 p-1 text-neutral-400 hover:text-blue-500 hover:bg-neutral-700 rounded-full"
                          title="Edit bookmark"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="ml-2 p-1 text-neutral-400 hover:text-red-500 hover:bg-neutral-700 rounded-full"
                        title="Delete bookmark"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Moved AddBookmarkButton to the header */}
      </div>
    </div>
  );
};

export default PlayerContent;
