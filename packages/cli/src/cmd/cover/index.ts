import { execSync } from 'child_process';
import { coverFromProps } from '@friends-library/doc-manifests';
import { pdf, deleteNamespaceDir } from '@friends-library/doc-artifacts';

export const command = 'cover';

export const describe = 'make a pdf book cover';

export const handler = async () => {
  deleteNamespaceDir('fl-cover');
  const [manifest] = await coverFromProps();
  const pdfPath = await pdf(manifest, 'cover', {
    namespace: 'fl-cover',
  });
  execSync(`open ${pdfPath}`);
};
