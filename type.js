// @flow
export type ISBN = string;

export type Uuid = string;

export type Asciidoc = string;

export type Xml = string;

export type Html = string;

export type Css = string;

export type Url = string;

export type Slug = string;

export type Name = string;

export type Title = string;

export type Description = string;

export type FilePath = string;

export type Sha = string;

export type Gender = 'male' | 'female';

export type Lang = 'en' | 'es';

export type EditionType = 'original' | 'modernized' | 'updated';

export type FormatType = 'pdf' | 'epub' | 'mobi' | 'audio' | 'paperback';

export type NodeEnv = 'production' | 'development';

export type LintResult = {|
  line: number,
  column: number | false,
  type: 'error' | 'warning' | 'notice',
  rule: string,
  message: string,
  recommendation?: string,
  fixable?: boolean,
|};

export type LintOptions = {|
  lang: Lang,
  editionType?: EditionType,
  include?: Array<string>,
  exclude?: Array<string>,
|};
