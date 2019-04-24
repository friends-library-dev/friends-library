import { Asciidoc, FilePath } from '@friends-library/types';

export interface ModifiedAsciidocFile {
  path: FilePath;
  adoc: Asciidoc;
}
