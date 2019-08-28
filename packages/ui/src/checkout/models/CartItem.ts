import { EditionType, PrintSize } from '@friends-library/types';

export interface CartItemData {
  title: string;
  interiorPdfUrl: string;
  coverPdfUrl: string;
  coverPngUrl: string;
  documentId: string;
  edition: EditionType;
  quantity: number;
  printSize: PrintSize;
  numPages: number;
  author: string;
}

export default class CartItem {
  public title: string;
  public documentId: string;
  public edition: EditionType;
  public quantity: number;
  public printSize: PrintSize;
  public numPages: number;
  public author: string;
  public interiorPdfUrl: string;
  public coverPdfUrl: string;
  public coverPngUrl: string;

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
    this.coverPngUrl = config.coverPngUrl;
  }

  public printJobTitle(): string {
    let title = this.title;
    if (this.edition !== 'updated') {
      title += ` (${this.edition})`;
    }
    return title;
  }

  public price(): number {
    const isSaddleStitch = this.printSize === 's' && this.numPages < 32;
    const basePrice = isSaddleStitch ? 200 : 125;
    return basePrice + Math.round(this.numPages * LULU_PRICE_PER_PAGE);
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
      coverPngUrl: this.coverPngUrl,
    };
  }
}

const LULU_PRICE_PER_PAGE = 1.4;
