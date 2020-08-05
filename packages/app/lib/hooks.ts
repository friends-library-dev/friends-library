import { useContext } from 'react';
import { AudioResource, UserSettings } from '../types';
import { SettingsContext, AudiosContext } from './context';

export function useAudios(): Map<string, AudioResource> {
  return useContext(AudiosContext);
}

export function useSettings(): UserSettings {
  return useContext(SettingsContext);
}
