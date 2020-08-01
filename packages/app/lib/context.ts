import React from 'react';
import { UserSettings, AudioResource, PlayerState } from '../types';
import Player from './Player';

export const SettingsContext = React.createContext<UserSettings>({
  audioQuality: `HQ`,
});

export const PlayerContext = React.createContext<PlayerState>(Player.defaultState);

export const AudiosContext = React.createContext<Map<string, AudioResource>>(new Map());
