import mongoose from 'mongoose';

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
      match: /^(original|modernized|updated)$/,
    },
    format: {
      type: String,
      required: true,
      match: /^(pdf-web|pdf-print|mobi|epub)$/,
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
  },
  { timestamps: true },
);

const Download = mongoose.model('downloads', schema);

export default Download;
