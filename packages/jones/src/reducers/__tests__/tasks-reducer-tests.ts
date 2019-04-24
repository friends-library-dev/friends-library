import taskReducer from '../tasks-reducer';

function result(start, end, path = 'path.adoc'): any {
  return {
    path,
    start: { line: start[0], column: start[1] },
    end: { line: end[0], column: end[1] },
  };
}

describe('taskReducer()', () => {
  let state;
  let action;

  beforeEach(() => {
    action = { type: '', payload: {} };
    state = {
      id: {
        id: 'id',
        files: {
          'path.adoc': {
            content: 'Thou dost thou foo!',
          },
        },
      },
    };
  });

  test('REOPEN_TASK re-sets id and prNumber', () => {
    action.type = 'REOPEN_TASK';
    action.payload = { id: 'id', newId: 'new-id' };
    state.id.pullRequest = { number: 3, status: 'open' };

    const newState = taskReducer(state, action);

    expect(newState).toEqual({
      'new-id': {
        id: 'new-id',
        files: {
          'path.adoc': {
            content: 'Thou dost thou foo!',
          },
        },
      },
    });
  });

  test('UPDATE_PULL_REQUEST_STATUS adds pr status', () => {
    state.id.pullRequest = { number: 4 };
    action.type = 'UPDATE_PULL_REQUEST_STATUS';
    action.payload = { id: 'id', status: 'open' };

    const newState = taskReducer(state, action);

    expect(newState.id.pullRequest).toEqual({ number: 4, status: 'open' });
  });

  test('TASK_RE_SUBMITTED updates parent commit', () => {
    action.type = 'TASK_RE_SUBMITTED';
    action.payload = { id: 'id', parentCommit: 'some-sha' };
    state.id.files['path.adoc'].editedContent = 'lol';

    const newState = taskReducer(state, action);

    expect(newState.id.parentCommit).toBe('some-sha');
    expect(newState.id.files['path.adoc']).toEqual({
      content: 'lol',
      editedContent: null,
    });
  });

  test('COLLAPSE_TASK collapes task', () => {
    state.id.collapsed = {};
    action.type = 'COLLAPSE_TASK';
    action.payload = { taskId: 'id', key: 'path.adoc', isCollapsed: true };
    const newState = taskReducer(state, action);
    expect(newState.id.collapsed['path.adoc']).toBe(false);
  });

  test('TOGGLE_SIDEBAR_OPEN opens sidebar', () => {
    action.type = 'TOGGLE_SIDEBAR_OPEN';
    action.payload = { id: 'id' };
    const newState = taskReducer(state, action);
    expect(newState.id.sidebarOpen).toBe(true);
  });

  test('UPDATE_SIDEBAR_WIDTH updates sidebar width', () => {
    action.type = 'UPDATE_SIDEBAR_WIDTH';
    action.payload = { id: 'id', width: 555 };
    const newState = taskReducer(state, action);
    expect(newState.id.sidebarWidth).toBe(555);
  });

  test('DELETE_TASK deletes task', () => {
    action.type = 'DELETE_TASK';
    action.payload = 'id';
    const newState = taskReducer(state, action);
    expect(newState).toEqual({});
  });

  test('CREATE_TASK creates a task', () => {
    action = { type: 'CREATE_TASK', payload: { taskId: 'abc123' } };
    const newState = taskReducer(state, action);
    expect(newState.abc123.id).toBe('abc123');
  });

  test('EDIT_SEARCH_RESULT modifies task editingFile', () => {
    action.type = 'EDIT_SEARCH_RESULT';
    action.payload = { taskId: 'id', result: { path: 'foo.adoc' } };
    const newState = taskReducer(state, action);
    expect(newState.id.editingFile).toBe('foo.adoc');
  });

  test('UPDATE_TASK updates tasks', () => {
    action.type = 'UPDATE_TASK';
    action.payload = { id: 'id', data: { name: 'some new name' } };
    const newState = taskReducer(state, action);
    expect(newState.id.name).toBe('some new name');
  });

  test('TOUCH_TASK changes updated date', () => {
    state.id.updated = 'old';
    action.type = 'TOUCH_TASK';
    action.payload = 'id';
    const newState = taskReducer(state, action);
    expect(newState.id.updated).not.toBe('old');
  });

  test('TASK_SUBMITTED sets task.pullRequest and resets file content', () => {
    action.type = 'TASK_SUBMITTED';
    action.payload = { id: 'id', prNumber: 54, parentCommit: 'some-sha' };
    state.id.files['path.adoc'].editedContent = 'lol';

    const newState = taskReducer(state, action);

    expect(newState.id.pullRequest).toEqual({ number: 54 });
    expect(newState.id.parentCommit).toBe('some-sha');
    expect(newState.id.files['path.adoc']).toEqual({
      content: 'lol',
      editedContent: null,
    });
  });

  describe('REPLACE_IN_RESULT', () => {
    beforeEach(() => {
      action.type = 'REPLACE_IN_RESULT';
    });

    it('replaces a result', () => {
      action.payload = {
        taskId: 'id',
        result: result([1, 0], [1, 4]),
        replace: 'LOL',
      };

      const newState = taskReducer(state, action);

      expect(newState.id.files['path.adoc'].editedContent).toBe('LOL dost thou foo!');
    });
  });

  describe('REPLACE_IN_RESULTS', () => {
    beforeEach(() => {
      action.type = 'REPLACE_IN_RESULTS';
    });

    it('accounts for line length changing when mutating line twice', () => {
      const results = [result([1, 0], [1, 4]), result([1, 10], [1, 14])];

      action.payload = {
        taskId: 'id',
        results,
        replace: 'You',
      };

      const newState = taskReducer(state, action);

      expect(newState.id.files['path.adoc'].editedContent).toBe('You dost You foo!');
    });

    it('replaces single word (dost)" fine', () => {
      action.payload = {
        taskId: 'id',
        results: [result([1, 5], [1, 9])],
        replace: 'does',
      };

      const newState = taskReducer(state, action);

      expect(newState.id.files['path.adoc'].editedContent).toBe('Thou does thou foo!');
    });
  });

  describe('UPDATE_EDITING_FILE', () => {
    beforeEach(() => {
      state.id.editingFile = 'path.adoc';
      action.type = 'UPDATE_EDITING_FILE';
      action.payload = { id: 'id', adoc: 'new adoc' };
    });

    test('task not found returns state', () => {
      action.payload.id = 'unknown';
      const newState = taskReducer(state, action);
      expect(newState).toBe(state);
    });

    test('sets file.editedContent for changed adoc', () => {
      const newState = taskReducer(state, action);
      expect(newState.id.files['path.adoc'].editedContent).toBe('new adoc');
    });

    test('reverts editedContent to null if matches content', () => {
      state.id.files['path.adoc'].content = 'original';
      state.id.files['path.adoc'].editedContent = 'changed';
      action.payload.adoc = 'original';
      const newState = taskReducer(state, action);
      expect(newState.id.files['path.adoc'].editedContent).toBeNull();
    });
  });

  describe('UPDATE_FILE', () => {
    beforeEach(() => {
      action.type = 'UPDATE_FILE';
      action.payload = { id: 'id', path: 'path.adoc', adoc: 'new adoc' };
    });

    test('task not found returns state', () => {
      action.payload.id = 'unknown';
      const newState = taskReducer(state, action);
      expect(newState).toBe(state);
    });

    test('sets file.editedContent for changed adoc', () => {
      const newState = taskReducer(state, action);
      expect(newState.id.files['path.adoc'].editedContent).toBe('new adoc');
    });

    test('reverts editedContent to null if matches content', () => {
      state.id.files['path.adoc'].content = 'original';
      state.id.files['path.adoc'].editedContent = 'changed';
      action.payload.adoc = 'original';
      const newState = taskReducer(state, action);
      expect(newState.id.files['path.adoc'].editedContent).toBeNull();
    });
  });
});
