import { price } from '@friends-library/lulu';
import { EditionType, PrintSize } from '@friends-library/types';

export interface CartItemData {
  title: string[];
  interiorPdfUrl: string[];
  coverPdfUrl: string[];
  documentId: string;
  edition: EditionType;
  quantity: number;
  printSize: PrintSize;
  numPages: number[];
  author: string;
}

export default class CartItem {
  public title: string[];
  public documentId: string;
  public edition: EditionType;
  public quantity: number;
  public printSize: PrintSize;
  public numPages: number[];
  public author: string;
  public interiorPdfUrl: string[];
  public coverPdfUrl: string[];

  public constructor(config: CartItemData) {
    this.title = config.title;
    this.documentId = config.documentId;
    this.edition = config.edition;
    this.quantity = config.quantity;
    this.printSize = config.printSize;
    this.numPages = config.numPages;
    this.author = config.author;
    this.interiorPdfUrl = config.interiorPdfUrl;
    this.coverPdfUrl = config.coverPdfUrl;
  }

  public printJobTitle(index: number): string {
    let title = this.title[index];
    if (this.edition !== 'updated') {
      title += ` (${this.edition})`;
    }
    return title;
  }

  public price(): number {
    return price(this.printSize, this.numPages);
  }

  public equals(other: CartItem): boolean {
    return this.documentId === other.documentId && this.edition === other.edition;
  }

  public toJSON(): CartItemData {
    return {
      title: this.title,
      author: this.author,
      documentId: this.documentId,
      edition: this.edition,
      quantity: this.quantity,
      printSize: this.printSize,
      numPages: this.numPages,
      interiorPdfUrl: this.interiorPdfUrl,
      coverPdfUrl: this.coverPdfUrl,
    };
  }
}
