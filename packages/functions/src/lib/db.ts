import '@friends-library/env/load';
import env from '@friends-library/env';
import mongoose, { Connection } from 'mongoose';
import log from './log';

export default async function connect(): Promise<Connection> {
  const { FUNCTIONS_DB_CONNECT_STRING } = env.require('FUNCTIONS_DB_CONNECT_STRING');

  await mongoose.connect(FUNCTIONS_DB_CONNECT_STRING, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', log.error.bind(log, 'MongoDB connection error:'));

  return mongoose.connection;
}
