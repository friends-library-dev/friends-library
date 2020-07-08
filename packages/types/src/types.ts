import {
  ISBN,
  Uuid,
  Asciidoc,
  Xml,
  Html,
  Css,
  Url,
  Slug,
  Name,
  Title,
  Description,
  FilePath,
  Sha,
} from './primitive';
export {
  DocPrecursor,
  ARTIFACT_TYPES,
  ArtifactType,
  PaperbackInteriorConfig,
  PaperbackCoverConfig,
  EbookConfig,
  EditionMeta,
  PageData,
  genericDpc,
} from './doc';
export { checkoutErrors, CheckoutError } from './errors';

export const GENDERS = [`male`, `female`] as const;
export type Gender = typeof GENDERS[number];

export const LANGS = [`en`, `es`] as const;
export type Lang = typeof LANGS[number];

export const EDITION_TYPES = [`original`, `modernized`, `updated`] as const;
export type EditionType = typeof EDITION_TYPES[number];

export const FORMAT_TYPES = [`pdf`, `epub`, `mobi`, `audio`, `paperback`] as const;
export type FormatType = typeof FORMAT_TYPES[number];

export const NODE_ENVS = [`production`, `development`] as const;
export type NodeEnv = typeof NODE_ENVS[number];

export const PRINT_SIZES = [`s`, `m`, `xl`] as const;
export type PrintSize = typeof PRINT_SIZES[number];

export const PRINT_SIZE_VARIANTS = [`s`, `m`, `xl`, `xl--condensed`] as const;
export type PrintSizeVariant = typeof PRINT_SIZE_VARIANTS[number];

export const DOWNLOAD_FORMATS = [
  `epub`,
  `mobi`,
  `web-pdf`,
  `mp3-zip`,
  `m4b`,
  `mp3`,
  `podcast`,
] as const;
export type DownloadFormat = typeof DOWNLOAD_FORMATS[number];

export const PRINT_JOB_STATUSES = [
  `presubmit`,
  `pending`,
  `accepted`,
  `shipped`,
  `rejected`,
  `canceled`,
] as const;

export type PrintJobStatus = typeof PRINT_JOB_STATUSES[number];

export const AUDIO_QUALITIES = [`HQ`, `LQ`] as const;
export type AudioQuality = typeof AUDIO_QUALITIES[number];

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
  isIntermediateTitle?: boolean;
}>;

export interface FileManifest {
  [key: string]: string | Buffer;
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
  lang: Lang;
  title: string;
  isCompilation: boolean;
  author: Name;
  size: PrintSize;
  pages: number;
  edition: EditionType;
  isbn: ISBN;
  blurb: string;
  customCss: Css;
  customHtml: Html;
  fauxVolumeNum?: number;
  showGuides?: boolean;
  scope?: string;
  scaler?: number;
  allowEditingBlurb?: boolean;
  updateBlurb?: (blurb: string) => void;
}

export interface FluidBgImageObject {
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes?: string;
  base64?: string;
  tracedSVG?: string;
  srcWebp?: string;
  srcSetWebp?: string;
  media?: string;
}

export interface FluidImageObject {
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes: string;
  base64?: string;
  tracedSVG?: string;
  srcWebp?: string;
  srcSetWebp?: string;
  media?: string;
}

export function isDefined<T>(x: T | undefined): x is T {
  return typeof x !== `undefined`;
}

export function isNotFalse<T>(x: T | false): x is T {
  return x !== false;
}

export const ADOC_SYNTAX = {
  LEFT_DOUBLE_QUOTE: `"\``,
  RIGHT_DOUBLE_QUOTE: `\`"`,
  LEFT_SINGLE_QUOTE: `'\``,
  RIGHT_SINGLE_QUOTE: `\`'`,
};

export const HTML_DEC_ENTITIES = {
  LEFT_DOUBLE_QUOTE: `&#8220;`,
  RIGHT_DOUBLE_QUOTE: `&#8221;`,
  LEFT_SINGLE_QUOTE: `&#8216;`,
  RIGHT_SINGLE_QUOTE: `&#8217;`,
  MDASH: `&#8212;`,
  AMPERSAND: `&#38;`,
  ELLIPSES: `&#8230;`,
};

// identity passthrough tagged template literal for getting vscode syntax
// highlighting for stuff like css`` and graphql``
export function syntax(
  strings: TemplateStringsArray,
  ...values: (string | number)[]
): string {
  let str = ``;
  strings.forEach((string, i) => {
    str += string + (values[i] || ``);
  });
  return str;
}

export {
  ISBN,
  Uuid,
  Asciidoc,
  Xml,
  Html,
  Css,
  Url,
  Slug,
  Name,
  Title,
  Description,
  FilePath,
  Sha,
};
