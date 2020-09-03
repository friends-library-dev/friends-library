import { Action, AnyAction, Dispatch as RDXDispatch } from '@reduxjs/toolkit';
import {
  useDispatch as RDXUseDispatch,
  useSelector as RDXUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { State } from './rootReducer';
import { initialState as audioResourcesInitialState } from './audio-resources';
import { initialState as playbackInitialState } from './playback';
import { initialState as fsInitialState } from './filesystem';
import { initialState as prefsInitialState } from './preferences';
import { initialState as positionInitialState } from './track-position';
import { initialState as activePartInitialState } from './active-part';

export const INITIAL_STATE: State = {
  audioResources: audioResourcesInitialState,
  trackPosition: positionInitialState,
  preferences: prefsInitialState,
  filesystem: fsInitialState,
  playback: playbackInitialState,
  activePart: activePartInitialState,
};

export type { State };
// this type derived from looking at `type of store.dispatch`
export type Dispatch = ThunkDispatch<any, null, AnyAction> &
  ThunkDispatch<any, undefined, AnyAction> &
  RDXDispatch<AnyAction>;
export type Thunk = ThunkAction<void, State, unknown, Action<string>>;
export const useSelector: TypedUseSelectorHook<State> = RDXUseSelector;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDispatch = () => RDXUseDispatch<Dispatch>();

export type PropSelector<OwnProps, Props> = (
  ownProps: OwnProps,
  dispatch: Dispatch,
) => (state: State) => null | Props;
