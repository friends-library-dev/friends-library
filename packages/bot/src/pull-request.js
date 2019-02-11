// @flow
import type { Context } from './app';
import kiteCheck from './check/kite';
import lintCheck from './check/lint';

export default async function(context: Context) {
  if (context.payload.repository.name === 'friends-library') {
    return;
  }

  if (['opened', 'synchronize'].includes(context.payload.action)) {
    return Promise.all([
      kiteCheck(context),
      lintCheck(context),
    ]);
  }
}
