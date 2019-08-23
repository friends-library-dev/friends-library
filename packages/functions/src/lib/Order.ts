import mongoose from 'mongoose';
import { PrintJobStatus } from '@friends-library/types';
import connect from './db';

const statuses: PrintJobStatus[] = [
  'pending',
  'accepted',
  'rejected',
  'shipped',
  'canceled',
];

const schema = new mongoose.Schema(
  {
    payment: {
      id: {
        type: String,
        required: true,
        match: /^ch_/,
      },
      status: {
        type: String,
        required: true,
        enum: ['authorized', 'captured'],
      },
      amount: {
        type: Number,
        required: true,
      },
      shipping: {
        type: Number,
        required: true,
      },
      taxes: {
        type: Number,
        required: true,
      },
      cc_fee_offset: {
        type: Number,
        required: true,
      },
    },
    print_job: {
      id: {
        type: Number,
        required: false,
      },
      status: {
        type: String,
        required: false,
        enum: statuses,
      },
    },
    email: {
      type: String,
      required: true,
      match: /\S+@\S+\.\S+/,
    },
    items: [
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unit_price: {
          type: Number,
          required: true,
        },
      },
    ],
    address: {
      name: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      street2: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        maxlength: 2,
        minLength: 2,
      },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('order', schema);

export default Order;

export async function persist(order: mongoose.Document): Promise<void> {
  const db = await connect();
  await order.save();
  await db.close();
  await mongoose.disconnect();
}

export async function persistAll(orders: mongoose.Document[]): Promise<void> {
  const db = await connect();
  await Promise.all(orders.map(o => o.save()));
  await db.close();
  await mongoose.disconnect();
}

export async function findById(id: string): Promise<mongoose.Document | null> {
  const db = await connect();
  const model = await Order.findById(id).exec();
  await db.close();
  await mongoose.disconnect();
  return model;
}

export async function find(query?: Record<string, string>): Promise<mongoose.Document[]> {
  const db = await connect();
  const results = await Order.find(query).exec();
  await db.close();
  await mongoose.disconnect();
  return results;
}
