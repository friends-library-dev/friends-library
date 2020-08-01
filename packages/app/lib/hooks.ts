import { useContext } from 'react';
import { AudioResource, UserSettings, PlayerState } from '../types';
import { SettingsContext, AudiosContext, PlayerContext } from './context';
import Player from './Player';

export function useAudios(): Map<string, AudioResource> {
  return useContext(AudiosContext);
}

export function useSettings(): UserSettings {
  return useContext(SettingsContext);
}

export function usePlayer(): [PlayerState, Player] {
  return [useContext(PlayerContext), Player.getInstance()];
}
