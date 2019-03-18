import { Undoable, Action } from '../type';

export function undoable<T>(
  reducer: (state: T, action: Action) => T,
  undoKey: string,
  resetters: string[] = [],
  limit: number = 50,
) {
  return (state: Undoable<T> = emptyUndoable(), action: Action): Undoable<Object> => {
    if (action.type === `RESET_UNDO_${undoKey}` || resetters.includes(action.type)) {
      return {
        past: [],
        present: state.present,
        future: [],
      };
    }

    if (action.type === `UNDO_${undoKey}`) {
      if (state.past.length === 0) {
        return state;
      }
      return {
        present: state.past[state.past.length - 1],
        past: state.past.slice(0, state.past.length - 1),
        future: [...state.future, state.present],
      };
    }

    if (action.type === `REDO_${undoKey}`) {
      if (state.future.length === 0) {
        return state;
      }

      return {
        present: state.future[state.future.length - 1],
        past: [...state.past, state.present],
        future: state.future.slice(0, state.future.length - 1),
      };
    }

    const newPresent = reducer(state.present, action);
    if (newPresent !== state.present) {
      return {
        past: [...state.past, state.present].slice(0 - limit),
        present: newPresent,
        future: state.future,
      };
    }
    return state;
  };
}

export function emptyUndoable<T>(): Undoable<T> {
  return { past: [], present: {} as T, future: [] };
}
