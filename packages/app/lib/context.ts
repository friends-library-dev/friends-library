import React from 'react';
import { UserSettings, AudioResource } from '../types';

export const SettingsContext = React.createContext<UserSettings>({
  audioQuality: `HQ`,
});

export const AudiosContext = React.createContext<Map<string, AudioResource>>(
  new Map(),
);
