import { DocPrecursor } from '@friends-library/types';
import { Friend, Document, Edition } from '@friends-library/friends';

export default class FsDocPrecursor implements DocPrecursor {
  public fullPath: string;
  public relPath: string;
  public friend?: Friend;
  public document?: Document;
  public edition?: Edition;
  public lang: DocPrecursor['lang'];
  public friendSlug: DocPrecursor['friendSlug'];
  public documentSlug: DocPrecursor['documentSlug'];
  public editionType: DocPrecursor['editionType'];
  public meta: DocPrecursor['meta'];
  public revision: DocPrecursor['revision'];
  public config: DocPrecursor['config'] = {};
  public customCode: DocPrecursor['customCode'] = { css: {}, html: {} };
  public asciidoc: DocPrecursor['asciidoc'] = '';
  public epigraphs: DocPrecursor['epigraphs'] = [];
  public sections: DocPrecursor['sections'] = [];
  public notes: DocPrecursor['notes'] = new Map();
  public documentId: DocPrecursor['documentId'] = '';

  public constructor(fullPath: string, relPath: string) {
    const [lang, friendSlug, docSlug, editionType] = relPath.split('/');
    this.lang = lang === 'es' ? 'es' : 'en';
    this.fullPath = fullPath;
    this.relPath = relPath;
    this.friendSlug = friendSlug;
    this.documentSlug = docSlug;
    this.editionType = editionType as DocPrecursor['editionType'];
    this.meta = {
      title: '',
      author: {
        name: '',
        nameSort: '',
      },
    };
    this.revision = {
      timestamp: Date.now(),
      sha: '',
      url: '',
    };
  }
}
