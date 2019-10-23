import { Uuid, ISBN, Sha, Url } from './primitive';
import {
  Lang,
  EditionType,
  Css,
  Html,
  Asciidoc,
  Epigraph,
  DocSection,
  Notes,
  PrintSize,
  PrintSizeVariant,
} from './types';

export interface DocPrecursor {
  lang: Lang;
  friendSlug: string;
  friendInitials: string[];
  documentSlug: string;
  path: string;
  documentId: Uuid;
  editionType: EditionType;
  asciidoc: Asciidoc;
  epigraphs: Epigraph[];
  sections: DocSection[];
  paperbackSplits: number[];
  notes: Notes;
  config: { [key: string]: any };
  customCode: {
    css: { [k in ArtifactType | 'all' | 'pdf' | 'ebook' | 'cover']?: Css };
    html: { [k in ArtifactType | 'all' | 'pdf' | 'ebook' | 'cover']?: Html };
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

export type ArtifactType =
  | 'paperback-interior'
  | 'paperback-cover'
  | 'web-pdf'
  | 'epub'
  | 'mobi';

export interface PaperbackInteriorConfig {
  printSize: PrintSize;
  frontmatter: boolean;
  condense: boolean;
  allowSplits: boolean;
}

export interface EbookConfig {
  frontmatter: boolean;
  subType: 'epub' | 'mobi';
  coverImgPath?: string;
  randomizeForLocalTesting?: boolean;
}

export interface EditionMeta {
  updated: string;
  adocLength: number;
  numSections: number;
  paperback: {
    size: PrintSize;
    volumes: number[];
    condense: boolean;
    pageData: {
      single: { [key in PrintSizeVariant]: number };
      split?: {
        m: number[];
        xl: number[];
        'xl--condensed': number[];
      };
    };
  };
}

export type PageData = EditionMeta['paperback']['pageData'];
