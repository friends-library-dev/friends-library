import { Schema } from 'jsonschema';

export default {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { $ref: '/uuid', required: true },
    name: {
      oneOf: [{ $ref: '/name' }, { enum: ['Compilations'] }],
      required: true,
    },
    gender: { enum: ['male', 'female', 'mixed'], required: true },
    description: { type: 'string', required: true },
    slug: { $ref: '/slug', required: true },
    documents: {
      type: 'array',
      required: true,
      uniqueItems: true,
      minItems: 1,
      items: {
        $ref: '/document',
      },
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

  chapter: {
    // @ts-ignore until https://github.com/tdegrunt/jsonschema/pull/293 merged
    oneOf: [
      {
        type: 'object',
        properties: {
          number: { type: 'integer', required: true },
          subtitle: { type: 'string' },
        },
      },
      {
        type: 'object',
        properties: {
          title: { type: 'string', required: true },
        },
      },
    ],
  },

  title: {
    type: 'string',
    minLength: 5,
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
    // @ts-ignore until https://github.com/tdegrunt/jsonschema/pull/293 merged
    properties: {
      reader: { $ref: '/name', required: true },
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
    // @ts-ignore until https://github.com/tdegrunt/jsonschema/pull/293 merged
    properties: {
      type: { enum: ['original', 'modernized', 'updated'], required: true },
      editor: { $ref: '/name', required: false },
      description: { type: 'string', required: false },
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
      chapters: {
        type: 'array',
        required: true,
        minItems: 1,
        uniqueItems: true,
        items: {
          $ref: '/chapter',
        },
      },
      audio: { $ref: '/audio', required: false },
    },
  },

  document: {
    type: 'object',
    additionalProperties: false,
    // @ts-ignore until https://github.com/tdegrunt/jsonschema/pull/293 merged
    properties: {
      id: { $ref: '/uuid', required: true },
      title: { type: 'string', required: true },
      original_title: { type: 'string', required: false },
      published: { type: 'integer', required: false },
      slug: { $ref: '/slug', required: true },
      filename: {
        type: 'string',
        pattern: /^[A-Z][A-Za-z0-9-_]+$/,
        required: true,
      },
      description: { type: 'string', required: true },
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
            'devotional',
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
