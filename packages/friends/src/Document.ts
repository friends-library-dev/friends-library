import { DocumentData } from './types';
import Friend from './Friend';
import Edition from './Edition';
import { Slug, Uuid, Description } from '@friends-library/types';

export default class Document {
  private _friend: Friend | undefined;
  public editions: Edition[] = [];

  public constructor(private data: Omit<DocumentData, 'editions'>) {}

  public get id(): Uuid {
    return this.data.id;
  }

  public set friend(friend: Friend) {
    this._friend = friend;
  }

  public get friend(): Friend {
    if (!this._friend) throw new Error('Friend not set');
    return this._friend;
  }

  public get title(): string {
    return this.data.title;
  }

  public get partialDescription(): Description | undefined {
    return this.data.partial_description;
  }

  public get featuredDescription(): Description | undefined {
    return this.data.featured_description;
  }

  public get description(): Description {
    return this.data.description;
  }

  public get region(): string | undefined {
    return this.data.region;
  }

  public get filenameBase(): string {
    return this.data.filename;
  }

  public get originalTitle(): string | undefined {
    return this.data.original_title;
  }

  public get published(): number | undefined {
    return this.data.published;
  }

  public get isComplete(): boolean {
    return this.data.incomplete !== true;
  }

  public get tags(): DocumentData['tags'] {
    return this.data.tags;
  }

  public get slug(): Slug {
    return this.data.slug;
  }

  public get path(): string {
    return `${this.friend.path}/${this.slug}`;
  }

  public get altLanguageId(): Uuid | undefined {
    return this.data.alt_language_id;
  }

  public get isCompilation(): boolean {
    return this.friend.isCompilationsQuasiFriend;
  }

  public get hasNonDraftEdition(): boolean {
    return this.editions.reduce(
      (hasNonDraft, edition) => hasNonDraft || !edition.isDraft,
      false as boolean,
    );
  }

  public get hasAudio(): boolean {
    return this.editions.reduce(
      (hasAudio, edition) => hasAudio || !!edition.audio,
      false as boolean,
    );
  }

  public get hasUpdatedEdition(): boolean {
    return this.editions.map(edition => edition.type).includes('updated');
  }

  public get relatedDocuments(): DocumentData['related_documents'] {
    return this.data.related_documents;
  }

  public toJSON(): Omit<Document, 'friend' | 'editions' | 'toJSON'> {
    return {
      id: this.id,
      title: this.title,
      originalTitle: this.originalTitle,
      slug: this.slug,
      description: this.description,
      featuredDescription: this.featuredDescription,
      partialDescription: this.partialDescription,
      filenameBase: this.filenameBase,
      hasNonDraftEdition: this.hasNonDraftEdition,
      published: this.published,
      tags: this.tags,
      path: this.path,
      isCompilation: this.isCompilation,
      hasAudio: this.hasAudio,
      hasUpdatedEdition: this.hasUpdatedEdition,
      altLanguageId: this.altLanguageId,
      relatedDocuments: this.relatedDocuments,
      region: this.region,
      isComplete: this.isComplete,
    };
  }
}
