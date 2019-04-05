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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== 'undefined';
}

export type LintResult = {
  line: number;
  column: number | false;
  type: 'error' | 'warning' | 'notice';
  rule: string;
  message: string;
  recommendation?: string;
  fixable?: boolean;
  info?: string;
};

export type LintOptions = {
  lang: Lang;
  editionType?: EditionType;
  include?: Array<string>;
  exclude?: Array<string>;
};

export type FileType = 'epub' | 'mobi' | 'pdf-web' | 'pdf-print';

export type Job = {
  id: string;
  spec: SourceSpec;
  meta: JobMeta;
  target: FileType;
  filename: string;
};

export type PrintSizeName = 'Pocket Book' | 'Digest' | 'A5' | 'US Trade' | 'Crown Quarto';

export type PrintSizeAbbrev = 's' | 'm' | 'l' | 'xl' | 'xxl';

export type PrintSize = {
  name: PrintSizeName;
  abbrev: PrintSizeAbbrev;
  dims: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    bottom: number;
    outer: number;
    inner: number;
    runningHeadTop: number;
  };
};

export type SourceSpec = Readonly<{
  id: string;
  lang: Lang;
  size: number;
  filename: string;
  epigraphs: Epigraph[];
  config: Object;
  customCss: CustomCss;
  meta: DocumentMeta;
  revision: DocumentRevision;
  sections: DocSection[];
  notes: Notes;
  conversionLogs: AsciidocConversionLog[];
}>;

export type CustomCss = { [K in FileType | 'pdf' | 'all' | 'ebook']?: Css };

export type JobMeta = Readonly<{
  perform: boolean;
  check: boolean;
  open: boolean;
  send: boolean;
  frontmatter: boolean;
  printSize?: PrintSizeAbbrev;
  debugPrintMargins: boolean;
  condense: boolean;
  email?: string;
}>;

export interface AsciidocConversionLog {
  getText(): string;
  getSeverity(): string;
  getSourceLocation(): { getLineNumber(): number } | undefined;
}

export type Epigraph = {
  text: string;
  source?: string;
};

export type Notes = Map<string, Html>;

export type Heading = {
  id: string;
  text: string;
  shortText?: string;
  sequence?: {
    type: string;
    number: number;
  };
};

export type DocSection = Readonly<{
  id: string;
  index: number;
  heading: Heading;
  html: Html;
}>;

export type SourcePrecursor = Readonly<{
  id: string;
  lang: Lang;
  adoc: Asciidoc;
  config: { [key: string]: any };
  customCss: CustomCss;
  revision: DocumentRevision;
  meta: DocumentMeta;
  filename: string;
}>;

export type DocumentRevision = Readonly<{
  timestamp: number;
  sha: string;
  url: Url;
}>;

export type DocumentMeta = Readonly<{
  title: string;
  originalTitle?: string;
  published?: number;
  isbn?: ISBN;
  editor?: string;
  author: {
    name: string;
    nameSort: string;
  };
}>;

export type FileManifest = {
  [key: string]: string;
};
