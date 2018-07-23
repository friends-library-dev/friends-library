// @flow
import { Friend, Document, Edition } from '@friends-library/friends';

export type Lang = 'en' | 'es';

export type XML = string;

export type SourceSpec = {|
  lang: Lang,
  friend: Friend,
  document: Document,
  edition: Edition,
  filename: string,
  html: string,
  path: string,
|};

export type FileManifest = {
  [string]: string,
};
