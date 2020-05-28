import { undoable, emptyUndoable } from '../undoable';

function incrementReducer(state = 0, { type }: { type: string }): number {
  if (type !== 'IGNORE') {
    return state + 1;
  }
  return state;
}

function action(type: string): { type: string } {
  return { type };
}

describe('undoable()', () => {
  let state: any;
  let reducer: any;

  beforeEach(() => {
    reducer = undoable(incrementReducer, 'TEST');
    state = {
      past: [],
      present: 0,
      future: [],
    };
  });

  test('reset resets the history', () => {
    state = {
      past: [0],
      present: 1,
      future: [],
    };
    const newState = reducer(state, action('RESET_UNDO_TEST'));
    expect(newState).toEqual({
      past: [],
      present: 1,
      future: [],
    });
  });

  test('undo un-does', () => {
    state = {
      past: [0],
      present: 1,
      future: [],
    };
    const newState = reducer(state, action('UNDO_TEST'));
    expect(newState).toEqual({
      past: [],
      present: 0,
      future: [1],
    });
  });

  test('undo returns same state if no past', () => {
    state = {
      past: [],
      present: 0,
      future: [1],
    };
    const newState = reducer(state, action('UNDO_TEST'));
    expect(newState).toBe(state);
  });

  test('redo re-does', () => {
    state = {
      past: [],
      present: 0,
      future: [1],
    };
    const newState = reducer(state, action('REDO_TEST'));
    expect(newState).toEqual({
      past: [0],
      present: 1,
      future: [],
    });
  });

  test('redo returns same state if no future', () => {
    state = {
      past: [0],
      present: 1,
      future: [],
    };
    const newState = reducer(state, action('REDO_TEST'));
    expect(newState).toBe(state);
  });

  test('ignored action leaves history untouched', () => {
    const newState = reducer(state, action('IGNORE'));
    expect(newState).toBe(state);
  });

  test('reset action resets state', () => {
    state = {
      past: [0, 1, 2],
      present: 3,
      future: [],
    };
    const newState = reducer(state, action('RESET_UNDO_TEST'));
    expect(newState).toEqual({
      past: [],
      present: 3,
      future: [],
    });
  });

  test('limit limits undo/redo stack', () => {
    reducer = undoable(incrementReducer, 'TEST', [], 2);
    let newState = reducer(state, action('INCREMENT'));
    newState = reducer(newState, action('INCREMENT'));
    newState = reducer(newState, action('INCREMENT'));
    newState = reducer(newState, action('INCREMENT'));

    expect(newState).toEqual({
      past: [2, 3],
      present: 4,
      future: [],
    });
  });
});

test('emptyUndoable() returns empty undoable', () => {
  expect(emptyUndoable()).toEqual({
    past: [],
    present: {},
    future: [],
  });
});
