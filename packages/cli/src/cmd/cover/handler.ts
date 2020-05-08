import { execSync } from 'child_process';
import { paperbackCover } from '@friends-library/doc-manifests';
import { pdf, deleteNamespaceDir } from '@friends-library/doc-artifacts';
import { hydrate, query as dpcQuery } from '@friends-library/dpc-fs';
import * as docMeta from '@friends-library/document-meta';

interface CoverOptions {
  pattern: string;
}

export default async function handler(argv: CoverOptions): Promise<void> {
  deleteNamespaceDir('fl-cover');
  const dpcs = dpcQuery.getByPattern(argv.pattern);
  const meta = await docMeta.fetch();

  for (const dpc of dpcs) {
    hydrate.meta(dpc);
    hydrate.customCode(dpc);

    const edMeta = meta.get(dpc.path);
    if (!edMeta) throw new Error(`Edition meta not found for ${dpc.path}`);
    const volumes = edMeta.paperback.volumes;

    const manifests = await paperbackCover(dpc, {
      printSize: edMeta.paperback.size,
      volumes,
    });

    for (let i = 0; i < manifests.length; i++) {
      const manifest = manifests[i];
      const filename = `cover-${dpc.document?.id}-${dpc.edition?.type}-${i}`;
      const pdfPath = await pdf(manifest, filename, { namespace: 'fl-cover' });
      execSync(`open ${pdfPath}`);
    }
  }
}
