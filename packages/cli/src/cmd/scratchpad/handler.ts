import {
  syntax as graphql,
  Uuid,
  Lang,
  PaymentStatus,
  PrintJobStatus,
  EditionType,
  DOWNLOAD_FORMATS,
  AUDIO_QUALITIES,
} from '@friends-library/types';
import fetch from 'node-fetch';
import fs from 'fs';
import uuid from 'uuid/v4';

const ENV = 'test';
const SECRET =
  ENV === 'test'
    ? 'fnADr6WzcwACEqapaw7PJTXhPLKnAtZiW8URIUEJ'
    : '***fnADr6XmZ_ACEg8AysyYhXjPu4QoT0HAcv7lj1FE';
const DIR = `/Users/jared/Desktop/mongo/${ENV}`;

export default async function handler(): Promise<void> {
  await handleDownloads();
  // await handleOrders();
}

async function handleDownloads() {
  const downloads = JSON.parse(fs.readFileSync(`${DIR}/downloads.json`).toString());
  for (let i = 0; i < downloads.length; i++) {
    const md = downloads[i];
    const download: any = {
      documentId: string(md.document_id, 'document_id'),
      edition: edition(md.edition),
      format: format(md.format),
      isMobile: boolean(md.is_mobile, 'is_mobile'),
      audioQuality: nullable(audioQuality, md.audio_quality, 'audio_quality'),
      audioPartNumber: nullable(number, md.audio_part_number, 'audio_part_number'),
      os: nullable(string, md.os, 'os'),
      browser: nullable(string, md.browser, 'browser'),
      platform: nullable(string, md.platform, 'platform'),
      userAgent: nullable(string, md.user_agent, 'user_agent'),
      referrer: nullable(string, md.referrer, 'referrer'),
    };

    if (md.location) {
      download.ip = nullable(string, md.location.ip, 'location.ip');
      download.city = nullable(string, md.location.city, 'location.city');
      download.region = nullable(string, md.location.region, 'location.region');
      download.postalCode = nullable(
        string,
        md.location.postalCode,
        'location.postalCode',
      );
      download.country = nullable(string, md.location.country, 'location.country');
      download.latitude = nullable(number, md.location.latitude, 'location.latitude');
      download.longitude = nullable(number, md.location.longitude, 'location.longitude');
    }

    if (md.location) console.log(download);
    // process.exit(0);
  }
  console.log(downloads[0]);
}

function nullable(type, input, key) {
  if (input === undefined || input === null) {
    return undefined;
  }
  return type(input, key);
}

function number(input, key) {
  if (typeof input !== 'number') {
    throw new Error(`${input} not number, key: ${key}, type: ${typeof input}`);
  }
  return input;
}

function boolean(input, key) {
  if (typeof input !== 'boolean') {
    throw new Error(`${input} not boolean, key: ${key}, type: ${typeof input}`);
  }
  return input;
}

function string(input, key) {
  if (typeof input !== 'string') {
    throw new Error(`${input} not string, key: ${key}, type: ${typeof input}`);
  }
  return input;
}

function audioQuality(aq) {
  if (!AUDIO_QUALITIES.includes(aq)) {
    throw new Error(`Not an valid audio quality: ${aq}`);
  }
  return aq;
}

function format(fmt) {
  if (!DOWNLOAD_FORMATS.includes(fmt)) {
    throw new Error(`Not an valid format: ${fmt}`);
  }
  return fmt;
}

function edition(ed) {
  if (!['updated', 'modernized', 'original'].includes(ed)) {
    throw new Error(`Not an edition: ${edition}`);
  }
  return ed;
}

async function handleOrders() {
  const orders = JSON.parse(fs.readFileSync(`${DIR}/orders.json`).toString());
  for (let i = 0; i < orders.length; i++) {
    const mo = orders[i];
    const order = {
      externalId: uuid(),
      lang: 'en' as const,
      paymentId: mo.payment.id as string,
      paymentStatus: mo.payment.status as PaymentStatus,
      amount: mo.payment.amount as number,
      taxes: mo.payment.taxes as number,
      shipping: mo.payment.shipping as number,
      ccFeeOffset: mo.payment.cc_fee_offset as number,
      email: mo.email as string,
      created: mo.createdAt.$date as string,
      updated: mo.updatedAt.$date as string,
      printJobId: mo.print_job ? (mo.print_job.id as number) : undefined,
      printJobStatus: mo.print_job ? (mo.print_job.status as PrintJobStatus) : undefined,
      address: { ...mo.address, street2: undefined } as Order['address'],
      items: mo.items.map((item: any) => ({
        title: item.title as string,
        edition: item.edition as EditionType,
        quantity: item.quantity as number,
        documentId: item.document_id as Uuid,
        unitPrice: item.unit_price as number,
      })),
    };
    const [err, data] = await sendQuery(CREATE_ORDER, { data: order });
  }
}

export interface Order {
  faunaId?: string;
  id: Uuid;
  lang: Lang;
  paymentId: string;
  paymentStatus: PaymentStatus;
  amount: number;
  taxes: number;
  shipping: number;
  ccFeeOffset: number;
  email: string;
  created: string;
  updated: string;
  printJobId?: number;
  printJobStatus?: PrintJobStatus;
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

const CREATE_ORDER = graphql`
  mutation CreateOrder($data: OrderInput!) {
    result: createOrder(data: $data) {
      externalId
    }
  }
`;

export type QueryError = null | string[];

export async function sendQuery<T>(
  query: string,
  variables: Record<string, any> = {},
): Promise<[QueryError, null | T]> {
  try {
    const res = await fetch('https://graphql.fauna.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${SECRET}` },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors || !json.data) {
      console.error('graphql error', { json, query, variables });
    }

    return [
      json.errors ? json.errors.map((e: { message: string }) => e.message) : null,
      json.data ? json.data.result : null,
    ];
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'faunadb http/unknown error';
    return [[msg], null];
  }
}
