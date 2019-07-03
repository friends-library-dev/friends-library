export type Gender = 'male' | 'female';
export type Lang = 'en' | 'es';
export type EditionType = 'original' | 'modernized' | 'updated';
export type FormatType = 'pdf' | 'epub' | 'mobi' | 'audio' | 'paperback';
export type NodeEnv = 'production' | 'development';
export type FileType = 'epub' | 'mobi' | 'pdf-web' | 'pdf-print';
export type FileTypeWithShortcuts = FileType | 'pdf' | 'all' | 'ebook';
export type PrintSize = 's' | 'm' | 'xl';

export interface Job {
  id: string;
  spec: SourceSpec;
  meta: JobMeta;
  target: FileType;
  filename: string;
}

export interface DocumentArtifacts {
  filePath: FilePath;
  srcDir: FilePath;
}

export interface PrintSizeDetails {
  abbrev: PrintSize;
  maxPages: number;
  minPages: number;
  luluName: 'Pocket Book' | 'Digest' | 'US Trade';
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
}

export type SourceSpec = Readonly<{
  id: string;
  lang: Lang;
  size: number;
  filename: string;
  epigraphs: Epigraph[];
  config: { [key: string]: any };
  customCss: CustomCss;
  meta: DocumentMeta;
  revision: DocumentRevision;
  sections: DocSection[];
  notes: Notes;
  conversionLogs: AsciidocConversionLog[];
}>;

export type CustomCss = { [K in FileTypeWithShortcuts]?: Css };

export type JobMeta = Readonly<{
  perform: boolean;
  check: boolean;
  frontmatter: boolean;
  printSize?: PrintSize;
  condense: boolean;
  createEbookCover: boolean;
}>;

export interface AsciidocConversionLog {
  getText(): string;
  getSeverity(): string;
  getSourceLocation(): { getLineNumber(): number } | undefined;
}

export interface Epigraph {
  text: string;
  source?: string;
}

export type Notes = Map<string, Html>;

export interface Heading {
  id: string;
  text: string;
  shortText?: string;
  sequence?: {
    type: string;
    number: number;
  };
}

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
  coverId: string;
  originalTitle?: string;
  published?: number;
  isbn?: ISBN;
  editor?: string;
  author: {
    name: string;
    nameSort: string;
  };
}>;

export interface FileManifest {
  [key: string]: string;
}

export interface LintResult {
  line: number;
  column: number | false;
  type: 'error' | 'warning' | 'notice';
  rule: string;
  message: string;
  recommendation?: string;
  fixable?: boolean;
  info?: string;
}

export interface LintOptions {
  lang: Lang;
  editionType?: EditionType;
  include?: string[];
  exclude?: string[];
  maybe?: boolean;
}

export interface CoverProps {
  title: string;
  author: Name;
  size: PrintSize;
  pages: number;
  edition: EditionType | 'spanish';
  isbn?: ISBN;
  blurb: string;
  showGuides: boolean;
  customCss: Css;
  customHtml: Html;
}

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

export function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== 'undefined';
}

export function isNotFalse<T>(x: T | false): x is T {
  return x !== false;
}

export function requireEnv<T extends string>(...keys: T[]): { [k in T]: string } {
  /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
  const obj = {} as { [k in T]: string };
  keys.forEach(key => {
    const val = process.env[key];
    if (typeof val !== 'string') {
      throw new Error(`Env var \`${key}\` is required.`);
    }
    obj[key] = val;
  });
  return obj;
}
