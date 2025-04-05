"use client";

import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsBookmarkPlus } from "react-icons/bs";

interface AddBookmarkButtonProps {
  onAdd: (name: string, timestamp: number) => void;
  currentTime: number;
}

const AddBookmarkButton: React.FC<AddBookmarkButtonProps> = ({
  onAdd,
  currentTime,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkTime, setBookmarkTime] = useState(0);

  // Format time to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setBookmarkName("");
    setBookmarkTime(currentTime); // Store the current time when Add is clicked
  };

  const handleSubmit = () => {
    onAdd(bookmarkName, bookmarkTime);
    setIsAdding(false);
    setBookmarkName("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setBookmarkName("");
  };

  return (
    <div className="relative">
      {!isAdding ? (
        <button
          onClick={handleAdd}
          className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full transition flex items-center justify-center h-8 w-8"
          title="Add bookmark at current position"
        >
          <BsBookmarkPlus size={16} className="text-yellow-400" />
        </button>
      ) : (
        <div className="bg-neutral-800 rounded-lg p-3 w-[300px] absolute bottom-[40px] right-0 shadow-lg z-40">
          <div className="text-xs mb-1 text-neutral-400">
            Add bookmark at {formatTime(bookmarkTime)}
          </div>
          <textarea
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
            className="w-full bg-neutral-700 text-white p-2 rounded text-sm mb-2 min-h-[80px]"
            autoFocus
            placeholder="Enter bookmark text..."
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBookmarkButton;