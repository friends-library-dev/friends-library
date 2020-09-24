import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from './';

export interface NetworkState {
  connected: boolean;
  showModal: boolean;
  recentFailedAttempt: boolean;
}

export const initialState: NetworkState = {
  connected: true,
  showModal: false,
  recentFailedAttempt: false,
};

const network = createSlice({
  name: `network`,
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setRecentFailedAttempt: (state, action: PayloadAction<boolean>) => {
      state.recentFailedAttempt = action.payload;
    },
  },
});

export const { setConnected, setShowModal, setRecentFailedAttempt } = network.actions;
export default network.reducer;

export function canDownloadNow({ network }: State, dispatch: Dispatch): boolean {
  if (network.connected) return true;
  if (!network.recentFailedAttempt) {
    dispatch(setRecentFailedAttempt(true));
    setTimeout(() => dispatch(setRecentFailedAttempt(false)), 2000);
  }
  return false;
}
