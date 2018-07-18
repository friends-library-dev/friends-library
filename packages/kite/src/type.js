
export type Lang = 'en' | 'es';

export type XML = string;

export type SourceSpec = {|
  lang: Lang,
|};

export type FileManifest = {
  [string]: string,
};
