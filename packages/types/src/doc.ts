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
  blurb: string;
  notes: Notes;
  config: { [key: string]: any };
  customCode: {
    css: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: Css };
    html: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: Html };
  };
  meta: {
    title: string;
    originalTitle?: string;
    published?: number;
    isbn: ISBN;
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

export function genericDpc(): DocPrecursor {
  return {
    lang: 'en',
    friendSlug: 'george-fox',
    friendInitials: ['G', 'F'],
    documentSlug: 'journal',
    path: 'en/george-fox/journal/original',
    documentId: '9414033c-4b70-4b4b-8e48-fec037822173',
    editionType: 'original',
    asciidoc: '',
    epigraphs: [],
    sections: [],
    paperbackSplits: [],
    blurb: '',
    notes: new Map(),
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: 'Journal of George Fox',
      isbn: '978-1-64476-029-1',
      author: { name: 'George Fox', nameSort: 'Fox, George' },
    },
    revision: { timestamp: Date.now(), sha: '', url: '' },
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

export interface PaperbackCoverConfig {
  printSize: PrintSize;
  volumes: number[];
  showGuides?: boolean;
}

export interface EbookConfig {
  frontmatter: boolean;
  subType: 'epub' | 'mobi';
  coverImg?: Buffer;
  randomizeForLocalTesting?: boolean;
}

export interface EditionMeta {
  updated: string;
  adocLength: number;
  numSections: number;
  revision: Sha;
  productionRevision: Sha;
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
