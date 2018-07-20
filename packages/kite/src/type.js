// @flow
import { Friend, Document, Edition } from '@friends-library/friends';

export type Lang = 'en' | 'es';

export type XML = string;

export type SourceSpec = {|
  lang: Lang,
  friend: Friend,
  document: Document,
  edition: Edition,
  adoc: string,
  html: string,
|};

export type FileManifest = {
  [string]: string,
};
