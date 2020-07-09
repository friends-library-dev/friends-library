import {
  EditionType,
  AudioQuality,
  Uuid,
  Lang,
  ShippingLevel,
  PrintJobStatus,
} from '@friends-library/types';

export namespace Db {
  export type QueryError = null | string[];

  export interface Download {
    documentId: string;
    edition: EditionType;
    format: string;
    isMobile: boolean;
    created: string;
    audioQuality?: AudioQuality;
    audioPartNumber?: number;
    os?: string;
    browser?: string;
    platform?: string;
    userAgent?: string;
    referrer?: string;
    ip?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }

  export interface Order {
    faunaId?: string;
    id: Uuid;
    lang: Lang;
    paymentId: string;
    amount: number;
    taxes: number;
    shipping: number;
    shippingLevel: ShippingLevel;
    ccFeeOffset: number;
    email: string;
    created: string;
    updated: string;
    printJobId?: number;
    printJobStatus: PrintJobStatus;
    items: {
      title: string;
      documentId: Uuid;
      edition: EditionType;
      quantity: number;
      unitPrice: number;
    }[];
    address: {
      name: string;
      street: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  }
}
