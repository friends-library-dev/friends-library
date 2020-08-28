import { Action } from '@reduxjs/toolkit';
import {
  useDispatch as RDXUseDispatch,
  useSelector as RDXUseSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { State } from './rootReducer';
import store from './store';

export type { State };
export type Dispatch = typeof store.dispatch;
export type Thunk = ThunkAction<void, State, unknown, Action<string>>;
export const useSelector: TypedUseSelectorHook<State> = RDXUseSelector;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDispatch = () => RDXUseDispatch<Dispatch>();
