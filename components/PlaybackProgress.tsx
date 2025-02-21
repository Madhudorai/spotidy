"use client";

import * as RadixSlider from "@radix-ui/react-slider";

interface PlaybackProgressProps {
  currentTime: number; // Current playback position in seconds
  duration: number; // Total track duration in seconds
  onSeek: (time: number) => void; // Callback when the user seeks a position
}

const PlaybackProgress: React.FC<PlaybackProgressProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  // Format time into mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle slider change
  const handleSeek = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className="flex items-center gap-x-4 w-full">
      {/* Current Time */}
      <span className="text-sm text-neutral-400">
        {formatTime(currentTime)}
      </span>

      {/* Playback Slider */}
      <RadixSlider.Root
        className="relative flex items-center select-none touch-none grow h-10"
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={handleSeek}
        aria-label="Playback Progress"
      >
        <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
          <RadixSlider.Range className="absolute bg-white rounded-full h-full" />
        </RadixSlider.Track>
        <RadixSlider.Thumb className="block w-3 h-3 bg-white rounded-full" />
      </RadixSlider.Root>

      {/* Total Duration */}
      <span className="text-sm text-neutral-400">{formatTime(duration)}</span>
    </div>
  );
};

export default PlaybackProgress;
