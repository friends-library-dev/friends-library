import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export default configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: { warnAfter: 100, ignoredPaths: [`audios`] },
    immutableCheck: { warnAfter: 100 },
  }),
});
