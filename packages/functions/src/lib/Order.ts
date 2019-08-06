import mongoose from 'mongoose';
import connect from './db';

const schema = new mongoose.Schema(
  {
    charge_id: {
      type: String,
      required: false,
      match: /^ch_/,
    },
    payment_status: {
      type: String,
      required: false,
      enum: ['authorized', 'captured'],
    },
    print_id: {
      type: Number,
      required: false,
    },
    print_status: {
      type: String,
      required: false,
      enum: ['pending', 'accepted', 'rejected', 'shipped', 'canceled'],
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

export async function findById(id: string): Promise<mongoose.Document | null> {
  const db = await connect();
  const model = await Order.findById(id).exec();
  await db.close();
  await mongoose.disconnect();
  return model;
}
