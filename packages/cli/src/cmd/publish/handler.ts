import { execSync } from 'child_process';
import { log, c } from '@friends-library/cli-utils/color';
import { fetch, save } from '@friends-library/document-meta';
import { Sha, DocPrecursor } from '@friends-library/types';
import * as artifacts from '@friends-library/doc-artifacts';
import * as hydrate from '../../fs-precursor/hydrate';
import * as dpcQuery from '../../fs-precursor/query';
import * as coverServer from './cover-server';
import { logDocStart, logDocComplete, logUpdateComplete, logUpdateStart } from './log';
import { publishPaperback } from './paperback';

interface UpdateOptions {
  build: boolean;
  check: boolean;
  pattern?: string;
  coverServerPort?: number;
}

export default async function update(argv: UpdateOptions): Promise<void> {
  logUpdateStart();
  const meta = await fetch();
  const productionRevision = getProductionRevision();
  const COVER_PORT = argv.coverServerPort || (await coverServer.start());
  const [makeScreenshot, closeHeadlessBrowser] = await coverServer.screenshot(COVER_PORT);
  const dpcs = dpcQuery.getByPattern(argv.pattern);

  for (let i = 0; i < dpcs.length; i++) {
    const assetStart = Date.now();
    const dpc = dpcs[i];
    const progress = c`{gray (${String(i + 1)}/${String(dpcs.length)})}`;
    logDocStart(dpc, progress);
    hydrate.all([dpc]);
    const ebookCover = await makeScreenshot(dpc.path);
    const NS = namespace(dpc);
    artifacts.deleteNamespaceDir(NS);
    const [paperbackMeta, volumes] = await publishPaperback(dpc, NS);
    logDocComplete(dpc, assetStart, progress);
  }

  if (!argv.coverServerPort) coverServer.stop(COVER_PORT);
  await closeHeadlessBrowser();
}

/*
DONT WORRY ABOUT SPEED, JUST MAKE AS SIMPLE AS POSSIBLE, OPTMIZE LATER
----------------------------------------------------------------------

√ store current production git hash
√ Get all DPCs
X Filter out the ones that we know ahead of time don't need updating // PUNT FOR NOW
√ start up the cover website for screenshots

For each DPC:

  √ make one ebook screenshot for use later
  - make all {single-vol} print sizes
  - if necessary, make all multi-vol sizes
  - pick best print size
  - update meta & persist

  - rename the chosen pdf file/s
  - delete unused pdf files

  - make manifests for:
    - cover/s (based on chosen pdf/s)
    - epub (pass ebook screenshot)
    - mobi (pass ebook screenshot)
  
  - upload the files
  - delete the ebook image

/ For each DPC

possibly trigger site rebuild
close the cover website
log end

*/

function getProductionRevision(): Sha {
  const cmd = 'git log --max-count=1 --pretty="%h" -- .';
  return execSync(cmd, { cwd: process.cwd() })
    .toString()
    .trim();
}

function namespace(dpc: DocPrecursor): string {
  return [
    dpc.friendInitials.join(''),
    dpc.documentSlug,
    dpc.editionType,
    dpc.documentId.substring(0, 8),
  ].join('--');
}
