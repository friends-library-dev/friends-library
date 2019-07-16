import '@friends-library/client/load-env';
import { requireEnv } from '@friends-library/types';
import mongoose from 'mongoose';

let promise: Promise<typeof mongoose> | undefined;

export default function connect(): Promise<typeof mongoose> {
  if (promise) {
    return promise;
  }

  const { FUNCTIONS_DB_CONNECT_STRING } = requireEnv('FUNCTIONS_DB_CONNECT_STRING');
  promise = mongoose.connect(FUNCTIONS_DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  promise.then(() =>
    mongoose.connection.on(
      'error',
      console.error.bind(console, 'MongoDB connection error:'),
    ),
  );

  return promise;
}
