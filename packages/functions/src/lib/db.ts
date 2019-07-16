import '@friends-library/client/load-env';
import { requireEnv } from '@friends-library/types';
import mongoose, { Connection } from 'mongoose';

export default async function connect(): Promise<Connection> {
  const { FUNCTIONS_DB_CONNECT_STRING } = requireEnv('FUNCTIONS_DB_CONNECT_STRING');

  await mongoose.connect(FUNCTIONS_DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useFindAndModify: false,
  });

  mongoose.connection.on(
    'error',
    console.error.bind(console, 'MongoDB connection error:'),
  );

  return mongoose.connection;
}
