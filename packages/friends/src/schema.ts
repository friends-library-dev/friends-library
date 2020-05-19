import { Schema } from 'jsonschema';

export default {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { $ref: '/uuid', required: true },
    name: {
      oneOf: [{ $ref: '/name' }, { enum: ['Compilations', 'Compilaciones'] }],
      required: true,
    },
    gender: { enum: ['male', 'female', 'mixed'], required: true },
    description: { type: 'string', required: true },
    slug: { $ref: '/slug', required: true },
    born: { type: 'integer', required: false, minimum: 1600, maximum: 1900 },
    died: { type: 'integer', required: true, minimum: 1640, maximum: 1950 },
    added: { type: 'date', required: false },
    quotes: {
      type: 'array',
      required: false,
      minItems: 1,
      items: { $ref: '/quote' },
    },
    residences: {
      type: 'array',
      required: true,
      minItems: 1,
      items: { $ref: '/residence' },
    },
    documents: {
      type: 'array',
      required: true,
      uniqueItems: true,
      minItems: 1,
      items: { $ref: '/document' },
    },
  },
};

const subSchemas: Record<string, Schema> = {
  uuid: {
    type: 'string',
    pattern: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  },

  name: {
    type: 'string',
    pattern: /^[A-Z][a-zA-Z]+ ([a-zA-Z]+\.?)?( [a-zA-Z.]+)?$/,
  },

  slug: {
    type: 'string',
    pattern: /^[a-z]+(-[a-z0-9-]+)?$/,
  },

  title: {
    type: 'string',
    minLength: 5,
  },

  quote: {
    type: 'object',
    additionalProperties: false,
    properties: {
      source: { type: 'string', required: true },
      text: { type: 'string', required: true, maxLength: 700 },
    },
  },

  'residence-duration': {
    type: 'object',
    additionalProperties: false,
    properties: {
      start: { type: 'integer', required: false, minimum: 1600, maximum: 1900 },
      end: { type: 'integer', required: true, minimum: 1600, maximum: 1900 },
    },
  },

  residence: {
    type: 'object',
    additionalProperties: false,
    properties: {
      city: { type: 'string', required: true },
      region: { type: 'string', required: true },
      durations: {
        type: 'array',
        required: false,
        items: { $ref: '/residence-duration', minItems: 1 },
      },
    },
  },

  'related-document': {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { $ref: '/uuid', required: true },
      description: { type: 'string', required: true, minLength: 85, maxLength: 450 },
    },
  },

  'audio-part': {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: { $ref: '/title' },
      external_id_lq: { type: 'integer' },
      external_id_hq: { type: 'integer' },
      filesize_lq: { type: 'integer' },
      filesize_hq: { type: 'integer' },
      seconds: { type: 'integer' },
      chapters: {
        type: 'array',
        items: { type: 'integer', minItems: 1, uniqueItems: true },
      },
    },
  },

  audio: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reader: { $ref: '/name', required: true },
      incomplete: { enum: [true], required: false },
      external_playlist_id_hq: { type: 'integer', required: false },
      external_playlist_id_lq: { type: 'integer', required: false },
      added: { type: 'date', required: true },
      parts: {
        type: 'array',
        required: true,
        minItems: 1,
        uniqueItems: true,
        items: { $ref: '/audio-part' },
      },
    },
  },

  edition: {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: { enum: ['original', 'modernized', 'updated'], required: true },
      editor: { $ref: '/name', required: false },
      description: { type: 'string', required: false },
      draft: { enum: [true], required: false },
      splits: {
        type: 'array',
        required: false,
        minItems: 1,
        uniqueItems: true,
        items: { type: 'integer' },
      },
      isbn: {
        type: 'string',
        pattern: /^978-1-64476-\d{3}-\d$/,
        required: true,
      },
      audio: { $ref: '/audio', required: false },
    },
  },

  document: {
    type: 'object',
    additionalProperties: false,
    properties: {
      id: { $ref: '/uuid', required: true },
      alt_language_id: { $ref: '/uuid', required: false },
      region: {
        enum: ['England', 'Ireland', 'Scotland', 'Western US', 'Eastern US'],
        required: false,
      },
      title: { type: 'string', required: true },
      original_title: { type: 'string', required: false },
      published: { type: 'integer', required: false },
      incomplete: { enum: [true], required: false },
      slug: { $ref: '/slug', required: true },
      partial_description: {
        type: 'string',
        maxLength: 400,
        required: true,
      },
      filename: {
        type: 'string',
        pattern: /^[A-Z][A-Za-z0-9-_]+$/,
        required: true,
      },
      description: { type: 'string', required: true },
      featured_description: { type: 'string', required: false },
      related_documents: {
        type: 'array',
        uniqueItems: true,
        required: false,
        minItems: 1,
        items: { $ref: '/related-document' },
      },
      tags: {
        type: 'array',
        uniqueItems: true,
        minItems: 1,
        required: true,
        items: {
          enum: [
            'journal',
            'letters',
            'exhortation',
            'doctrinal',
            'treatise',
            'history',
            'allegory',
            'spiritual life',
          ],
        },
      },
      editions: {
        type: 'array',
        required: true,
        minItems: 1,
        uniqueItems: true,
        items: { $ref: '/edition' },
      },
    },
  },
};

export { subSchemas };
