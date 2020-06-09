import reposReducer from '../repos-reducer';

describe(`reposReducer()`, () => {
  const action = {
    type: `RECEIVE_FRIEND_REPOS`,
    payload: [] as any[],
  };

  const cases = [
    [`compilations`, `Source documents for compilations`, `Compilations`],
    [`compilaciones`, `Source documents for compilations`, `Compilaciones`],
    [`george-fox`, `👴 George Fox (1771-1840) source documents`, `George Fox`],
    [`george-fox`, `👴 George Fox (1771 - 1840) source documents`, `George Fox`],
    [`john-roberts`, `👴 John Roberts (d. 1684) source documents`, `John Roberts`],
    [`elizabeth-ussher`, `👵 Elizabeth Ussher source documents`, `Elizabeth Ussher`],
    [`s-grubb`, `👵 Sarah R. Grubb (1756-1790) source documents`, `Sarah R. Grubb`],
  ];

  test.each(cases)(`%s / %s produces name: %s`, (name, description, friendName) => {
    action.payload = [{ id: `repo-id`, name, description }];
    const newState = reposReducer([], action);
    expect(newState).toMatchObject([
      {
        id: `repo-id`,
        slug: name,
        friendName,
      },
    ]);
  });
});
