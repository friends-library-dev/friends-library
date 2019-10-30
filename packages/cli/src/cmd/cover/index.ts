import { execSync } from 'child_process';
import { paperbackCoverFromProps } from '@friends-library/doc-manifests';
import { pdf, deleteNamespaceDir } from '@friends-library/doc-artifacts';

export const command = 'cover';

export const describe = 'make a pdf book cover';

export const handler = async () => {
  const [manifest] = paperbackCoverFromProps({
    lang: 'en',
    title: 'The Work of Vital Religion in the Soul',
    author: 'Samuel Rundell',
    pages: 126,
    size: 's',
    edition: 'updated',
    showGuides: false,
    blurb:
      'shortlLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons',
    customCss: '',
    customHtml: '',
  });

  deleteNamespaceDir('fl-cover');
  const pdfPath = await pdf(manifest, 'cover', { namespace: 'fl-cover' });
  execSync(`open ${pdfPath}`);
};
