import mongoose from 'mongoose';
import connect from './db';
import { EditionType, AudioQuality } from '@friends-library/types';

export const format = [
  'web-pdf',
  'mobi',
  'epub',
  'mp3-zip',
  'm4b',
  'mp3',
  'podcast',
] as const;

const schema = new mongoose.Schema(
  {
    document_id: {
      type: String,
      required: true,
      match: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    },
    edition: {
      type: String,
      required: true,
      enum: ['original', 'modernized', 'updated'],
    },
    format: {
      type: String,
      required: true,
      enum: format,
    },
    audio_quality: {
      type: String,
      required: false,
      enum: ['LQ', 'HQ'],
    },
    audio_part_number: {
      type: Number,
      required: false,
    },
    is_mobile: {
      type: Boolean,
      required: true,
      default: true,
    },
    os: {
      type: String,
      required: false,
      max: 100,
    },
    browser: {
      type: String,
      required: false,
      max: 100,
    },
    platform: {
      type: String,
      required: false,
      max: 100,
    },
    user_agent: {
      type: String,
      required: false,
      max: 255,
    },
    referrer: {
      type: String,
      required: false,
      max: 255,
    },
    location: {
      ip: { type: String },
      city: { type: String },
      region: { type: String },
      postalCode: { type: String },
      country: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true },
);

const Download = mongoose.model('download', schema);

export type Format = typeof format[number];

interface DownloadData {
  document_id: string;
  edition: EditionType;
  format: Format;
  audio_quality?: AudioQuality;
  audio_part_number?: number;
  is_mobile: boolean;
  os?: string;
  browser?: string;
  platform?: string;
  user_agent?: string;
  referrer?: string;
}

export default Download;

export async function create(data: DownloadData): Promise<string> {
  const db = await connect();
  const download = await Download.create(data);
  await db.close();
  await mongoose.disconnect();
  return download.id;
}
