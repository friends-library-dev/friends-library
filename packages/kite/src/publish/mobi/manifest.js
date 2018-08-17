// @flow
import { mapValues } from 'lodash';
import type { Job, FileManifest } from '../../type';
import { getEbookManifest } from '../epub/manifest';

export function getMobiManifest(job: Job): FileManifest {
  return mapValues(getEbookManifest(job), content => {
    return content.replace(
      /<meta charset="UTF-8"\/>/gm,
      '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>',
    );
  });
}
