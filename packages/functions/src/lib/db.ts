import '@friends-library/client/load-env';
import { requireEnv } from '@friends-library/types';
import mongoose, { Connection } from 'mongoose';

let connection: Connection | undefined;

export default async function connect(): Promise<Connection> {
  if (connection) {
    return connection;
  }

  const { FUNCTIONS_DB_CONNECT_STRING } = requireEnv('FUNCTIONS_DB_CONNECT_STRING');

  return mongoose
    .connect(FUNCTIONS_DB_CONNECT_STRING, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      connection = mongoose.connection;
      connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
      return connection;
    });
}
