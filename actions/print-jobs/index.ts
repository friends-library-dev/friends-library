import * as core from '@actions/core';
import { LuluClient } from '@friends-library/lulu';
import { Client as DbClient } from '@friends-library/db';

async function main(): Promise<void> {
  const lulu = new LuluClient({
    clientKey: process.env.INPUT_LULU_CLIENT_KEY || ``,
    clientSecret: process.env.INPUT_LULU_CLIENT_SECRET || ``,
    sandbox: String(process.env.INPUT_LULU_IS_SANDBOX) !== `false`,
  });

  const [jobs] = await lulu.listPrintJobs([10233]);
  core.info(`jobs:`);
  console.log(jobs);

  const db = new DbClient(process.env.INPUT_FAUNA_SERVER_SECRET || ``);
  const [, order] = await db.orders.findById(`7b29b36f-dfe0-48fe-8b48-889e845a2b75`);
  core.info(`order:`);
  console.log(order);
}

main();
