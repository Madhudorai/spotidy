"use client";

import { Bookmark } from "@/hooks/useBookmarks";
import { useState } from "react";
import { BsBookmarkFill } from "react-icons/bs";

interface BookmarkMarkerProps {
  bookmark: Bookmark;
  duration: number;
  onJump: (timestamp: number) => void;
}

const BookmarkMarker: React.FC<BookmarkMarkerProps> = ({
  bookmark,
  duration,
  onJump
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const position = (bookmark.timestamp / duration) * 100;
  
  // Format time to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onJump(bookmark.timestamp);
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 cursor-pointer z-10"
      style={{ left: `${position}%`, top: '-9px'  }}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <BsBookmarkFill size={14} className="text-yellow-400" />
      
      {showTooltip && (
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-20">
          <div className="font-bold">{bookmark.name || "Bookmark"}</div>
          <div>{formatTime(bookmark.timestamp)}</div>
        </div>
      )}
    </div>
  );
};

export default BookmarkMarker;