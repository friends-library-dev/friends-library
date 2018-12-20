// @flow
import { createReducer } from 'redux-starter-kit'
import * as screens from './screens';

export default {
  screen: createReducer(screens.WELCOME, {
    CHANGE_SCREEN: (state, action) => action.payload,
    WORK_ON_TASK: () => screens.WORK,
  }),
  currentTask: createReducer(null, {
    CREATE_TASK: (state, action) => {
      return action.payload.taskId;
    },
    DELETE_TASK: (state, { payload }) => {
      if (state === payload) {
        return null;
      }
      return state;
    },
    CHANGE_SCREEN: (state, action) => {
      if (action.payload === 'WELCOME') {
        return null;
      }
      return state;
    },
    WORK_ON_TASK: (state, { payload }) => {
      return payload;
    }
  }),
  tasks: createReducer([], {
    CREATE_TASK: (state, action) => {
      state.push({
        id: action.payload.taskId,
        name: '',
        repo: '',
        isNew: true,
      });
    },
    UPDATE_TASK: (state, { payload }) => {
      const task = state.find(({ id }) => id === payload.id);
      if (task) {
        Object.keys(payload.data).forEach(key => task[key] = payload.data[key]);
      }
    },
    DELETE_TASK: (state, { payload }) => {
      const newTasks = [];
      state.forEach(task => {
        if (task.id !== payload) {
          newTasks.push(task);
        }
      });
      return newTasks;
    }
  }),
  friends: createReducer({}, {
    RECEIVE_FRIEND: (state, action) => {
      const { payload: { friend, lang } } = action;
      state[`${lang}/${friend.slug}`] = friend;
    },
    RECEIVE_REPO_FILES: (state, action) => {
      const { payload: { friendSlug, files } } = action;
      state[`en/${friendSlug}`].files = files;
    },
    RECEIVE_FILE_CONTENT: (state, action) => {
      const { payload: { friendSlug, fullPath, content } } = action;
      const file = state[`en/${friendSlug}`].files.find(f => f.fullPath === fullPath);
      file.content = content;
    }
  }),
  repos: createReducer([], {
    RECEIVE_REPOS: (state, action) => {
      return action.payload.map(repo => {
        return {
          slug: repo.name,
        };
      });
    }
  }),
};
