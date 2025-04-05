"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useEffect } from "react";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);

  useEffect(() => {
    if (song) {
      console.log("Player loaded song:", song.title);
    }
  }, [song]);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div
      className="
    fixed
    bottom-300
    bg-black
    w-full
    py-2
    h-[120px]
    px-4
    "
    style={{
      position: 'fixed', 
      bottom: 0
    }}>
      <PlayerContent
        key={songUrl}
        song={song}
        songUrl={songUrl}
      />
    </div>
  )
}

export default Player
