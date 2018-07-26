// @flow
import { Friend, Document, Edition } from '@friends-library/friends';

export type Lang = 'en' | 'es';

export type Xml = string;

export type Html = string;

export type Asciidoc = string;

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
|};
