import migrate from '../pr-number-to-pull-request-object';

describe('migrate()', () => {
  let state: any;

  beforeEach(() => {
    state = {
      version: 1,
      tasks: {
        id: {},
      },
    };
  });

  it('updates shape of state', () => {
    state.tasks.id.prNumber = 33;
    const newState = migrate(state);
    expect(newState).toEqual({
      version: 1,
      tasks: {
        id: {
          pullRequest: {
            number: 33,
          },
        },
      },
    });
  });

  it('does nothing when task does not have prNumber', () => {
    const newState = migrate(state);
    expect(newState).toBe(state);
  });

  it('does nothing when task already updated', () => {
    state.pullRequest = { number: 33 };
    const newState = migrate(state);
    expect(newState).toBe(state);
  });

  it('does nothing if version is already 2', () => {
    state.version = 2;
    state.tasks.id.prNumber = 33;
    const newState = migrate(state);
    expect(newState).toBe(state);
  });
});
