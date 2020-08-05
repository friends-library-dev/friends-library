import { useState, useEffect } from 'react';
import { AudioResource } from '../types';
import Data from './Data';

export function useAudios(): [Map<string, AudioResource>, AudioResource[]] {
  const [audios, setAudios] = useState<Map<string, AudioResource>>(
    Data.audioResources,
  );

  useEffect(() => {
    Data.addListener(`updated:audio-resources`, setAudios);
    return () => {
      Data.removeListener(`updated:audio-resources`, setAudios);
    };
  }, [Data, setAudios]);

  return [audios, [...audios.values()]];
}
