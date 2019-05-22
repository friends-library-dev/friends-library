import { mapValues } from 'lodash';
import { Job, FileManifest } from '@friends-library/types';
import { getEbookManifest } from '../epub/manifest';

export async function getMobiManifest(job: Job): Promise<FileManifest> {
  return mapValues(await getEbookManifest(job), content => {
    return content.replace(
      /<meta charset="UTF-8"\/>/gm,
      '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>',
    );
  });
}
