import set from 'lodash/set';
import get from 'lodash/get';
import Octokit from '@octokit/rest';
import { PrintSize as Size, requireEnv } from '@friends-library/types';
import calculatePageEstimate from './estimate-pages';

interface EditionMeta {
  updated: string;
  adocLength: number;
  numSections: number;
  printSize: Size;
  pages: {
    s: number;
    m: number;
    xl: number;
  };
}

type Data = Record<string, EditionMeta>;

export default class DocumentMeta {
  protected data: Data = {};
  protected gistId: string;
  protected client: Octokit;

  public constructor() {
    const { CLIENT_DOCUMENT_META_AUTH_TOKEN, CLIENT_DOCUMENT_META_GIST_ID } = requireEnv(
      'CLIENT_DOCUMENT_META_AUTH_TOKEN',
      'CLIENT_DOCUMENT_META_GIST_ID',
    );
    this.client = new Octokit({ auth: `token ${CLIENT_DOCUMENT_META_AUTH_TOKEN}` });
    this.gistId = CLIENT_DOCUMENT_META_GIST_ID;
  }

  public async load(): Promise<void> {
    const { data } = await this.client.gists.get({ gist_id: this.gistId });
    // @ts-ignore
    this.data = <Data>JSON.parse(data.files['fl-doc-meta.json'].content);
  }

  public async persist(): Promise<boolean> {
    try {
      await this.client.gists.update({
        gist_id: this.gistId,
        // @ts-ignore
        files: { 'fl-doc-meta.json': { content: JSON.stringify(this.data, null, 2) } },
      });
      return true;
    } catch {
      return false;
    }
  }

  public estimatePages(adocLength: number, numSections: number, size: Size): number {
    if (Object.keys(this.data).length === 0) {
      throw new Error('Meta must be loaded to estimate pages!');
    }
    return calculatePageEstimate(this, adocLength, numSections, size);
  }

  public has(docId: string): boolean {
    return !!this.data[docId];
  }

  public get(docId: string): EditionMeta | null {
    return this.data[docId] || null;
  }

  public *[Symbol.iterator](): IterableIterator<[string, EditionMeta]> {
    for (const id of Object.keys(this.data)) {
      yield [id, this.data[id]];
    }
  }

  public getIn(
    docId: string,
    path: string,
    defaultValue?: number,
  ): number | string | undefined {
    const editionMeta = this.get(docId);
    if (!editionMeta) {
      return defaultValue || undefined;
    }
    return get(editionMeta, path, defaultValue);
  }

  public set(docId: string, editionMeta: EditionMeta): void {
    this.data[docId] = editionMeta;
  }

  public setIn(docId: string, path: string, value: number | string): void {
    if (!this.has(docId)) {
      throw new Error(`Connot .setIn(), ${docId} not found!`);
    }

    set(this.data[docId], path, value);
  }
}

/**
 * Allows multiple concurrent attempts to get a loaded singleton DocumentMeta
 */
export async function getDocumentMeta(): Promise<DocumentMeta> {
  if (meta) {
    return meta;
  }

  if (metaPromise) {
    return metaPromise;
  }

  const tempMeta = new DocumentMeta();
  metaPromise = tempMeta.load().then(() => {
    meta = tempMeta;
    return meta;
  });

  return metaPromise;
}

let meta: DocumentMeta | null;
let metaPromise: Promise<DocumentMeta> | null;
