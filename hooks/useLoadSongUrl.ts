import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const useLoadSongUrl = (song: Song) => {
  const supabaseClient = useSupabaseClient();
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (!song) {
      setUrl('');
      return;
    }

    const fetchUrl = async () => {
      try {
        const { data } = supabaseClient
          .storage
          .from('songs')
          .getPublicUrl(song.song_path);
        
        console.log('Song URL loaded:', data.publicUrl);
        setUrl(data.publicUrl);
        
        // Verify the URL is accessible
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        console.log('URL check response:', response.status);
      } catch (error) {
        console.error('Error loading song URL:', error);
      }
    };

    fetchUrl();
  }, [song, supabaseClient]);

  return url;
};

export default useLoadSongUrl;