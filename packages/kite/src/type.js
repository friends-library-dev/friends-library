// @flow
import { Friend, Document, Edition } from '@friends-library/friends';

export type Lang = 'en' | 'es';

export type Xml = string;

export type Html = string;

export type Asciidoc = string;

export type Css = string;

export type FileType = 'epub' | 'mobi' | 'pdf-web' | 'pdf-print';

export type Command = {|
  formats: Array<FileType>,
  perform: boolean,
  check: boolean,
  open: boolean,
  send: boolean,
  email?: string,
|};

export type SourceSpec = {|
  lang: Lang,
  friend: Friend,
  document: Document,
  edition: Edition,
  filename: string,
  html: Html,
  path: string,
  date: number,
  hash: string,
  config: Object,
  sections: Array<DocSection>,
  target?: FileType,
|};

export type FileManifest = {
  [string]: string,
};

export type DocSection = {|
  id: string,
  html: string,
  title?: string,
  ref?: string,
  isChapter: boolean,
  isFootnotes: boolean,
  chapterNumber?: number,
  chapterTitlePrefix?: string,
  chapterTitleBody?: string,
  chapterTitleShort?: string,
|};
