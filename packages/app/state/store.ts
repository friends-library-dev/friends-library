import { Platform } from 'react-native';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

export default configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck:
      Platform.OS === `ios` ? { warnAfter: 100, ignoredPaths: [`audios`] } : false,
    immutableCheck: Platform.OS === `ios` ? { warnAfter: 100 } : false,
  }),
});
