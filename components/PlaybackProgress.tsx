"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";
import { Bookmark } from "@/hooks/useBookmarks";
import BookmarkMarker from "./BookmarkMarker";

interface PlaybackProgressProps {
  currentTime: number; // Current playback position in seconds
  duration: number; // Total track duration in seconds
  onSeek: (time: number) => void; // Callback when the user seeks a position
  bookmarks?: Bookmark[]; // Optional array of bookmarks
}

const PlaybackProgress: React.FC<PlaybackProgressProps> = ({
  currentTime,
  duration,
  onSeek,
  bookmarks = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(currentTime);

  // Update local value when currentTime changes (if not dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(currentTime);
    }
  }, [currentTime, isDragging]);

  // Format time into mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle slider change
  const handleSeek = (value: number[]) => {
    console.log("Seeking to position:", value[0]);
    setLocalValue(value[0]);
    onSeek(value[0]);
  };

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    onSeek(localValue);
  };

  return (
    <div className="flex items-center gap-x-4 w-full">
      {/* Current Time */}
      <span className="text-sm text-neutral-400 min-w-[40px]">
        {formatTime(localValue)}
      </span>

      {/* Playback Slider */}
      <div className="h-[12px] relative w-full flex items-center" style={{ 
        visibility: 'visible', 
        padding: '0 6px',
        position: 'relative',
      }}>
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none grow h-[12px] w-full"
        value={[localValue]}
        max={duration || 100}
        step={0.1}
        onValueChange={handleSeek}
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        aria-label="Playback Progress"
        style={{ visibility: 'visible' }}
      >
        <RadixSlider.Track 
          className="bg-neutral-800 relative grow rounded-full h-[6px] cursor-pointer"
          style={{ visibility: 'visible' }}
        >
          <RadixSlider.Range 
            className="absolute rounded-full h-full" 
            style={{ visibility: 'visible', backgroundColor: 'darkgreen' }}
          />
        </RadixSlider.Track>
        
        {/* Render bookmark markers */}
        {bookmarks.map((bookmark) => (
          <BookmarkMarker
            key={bookmark.id}
            bookmark={bookmark}
            duration={duration}
            onJump={onSeek}
          />
        ))}
        
        <RadixSlider.Thumb 
          className="block w-[14px] h-[14px] bg-white rounded-full hover:scale-125 transition cursor-grab active:cursor-grabbing" 
          style={{ visibility: 'visible', boxShadow: '0 0 5px rgba(0,0,0,0.5)' }}
        />
      </RadixSlider.Root>
      </div>

      {/* Total Duration */}
      <span className="text-sm text-neutral-400 min-w-[40px]">{formatTime(duration)}</span>
    </div>
  );
};

export default PlaybackProgress;
