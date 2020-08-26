import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocalAudioFile {
  downloaded: boolean;
  downloading: boolean;
  percentDownloaded: number;
}

type LocalAudioFilesState = Record<string, LocalAudioFile>;

const initialState: LocalAudioFilesState = {};

const localAudioFilesSlice = createSlice({
  name: `local-audio-files`,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ id: string; fileState: LocalAudioFile }>) => {
      const { id, fileState } = action.payload;
      state[id] = fileState;
    },
  },
});

export const { set } = localAudioFilesSlice.actions;
export default localAudioFilesSlice.reducer;
