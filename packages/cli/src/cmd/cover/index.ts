import { execSync } from 'child_process';
import { coverFromProps } from '@friends-library/doc-manifests';
import { pdf } from '@friends-library/doc-artifacts';

export const command = 'cover';

export const describe = 'make a pdf book cover';

export const handler = () => {
  const [manifest] = coverFromProps();
  const pdfPath = pdf(manifest, 'foo');
  execSync(`open ${pdfPath}`);
};
