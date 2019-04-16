import { Asciidoc, FilePath } from '@friends-library/types';

export type ModifiedAsciidocFile = {
  path: FilePath;
  adoc: Asciidoc;
};
