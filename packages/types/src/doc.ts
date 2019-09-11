import { ISBN, Sha, Url } from './primitive';
import { Lang, EditionType, FileTypeWithShortcuts, Css, Html, Asciidoc } from './types';

export interface DocPrecursor {
  lang: Lang;
  friendSlug: string;
  documentSlug: string;
  editionType: EditionType;
  asciidoc: Asciidoc;
  config: { [key: string]: any };
  customCode: {
    css: { [k in FileTypeWithShortcuts | 'cover']?: Css };
    html: { [k in FileTypeWithShortcuts | 'cover']?: Html };
  };
  meta: {
    title: string;
    originalTitle?: string;
    published?: number;
    isbn?: ISBN;
    editor?: string;
    author: {
      name: string;
      nameSort: string;
    };
  };
  revision: {
    timestamp: number;
    sha: Sha;
    url: Url;
  };
}
