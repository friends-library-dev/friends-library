import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ActivePartState = Record<string, number | null>;

export const initialState: ActivePartState = {};

const activePart = createSlice({
  name: `activePart`,
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ audioId: string; partIndex: number }>) => {
      const { audioId, partIndex } = action.payload;
      state[audioId] = partIndex;
    },
  },
});

export const { set } = activePart.actions;
export default activePart.reducer;
