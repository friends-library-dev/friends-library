import { sendQuery, QueryError } from './db';
import {
  Uuid,
  Lang,
  PrintJobStatus,
  PaymentStatus,
  EditionType,
  syntax as graphql,
} from '@friends-library/types';

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

export function findById(id: Uuid): Promise<[QueryError, null | Order]> {
  return sendQuery<Order>(FIND_BY_ID, { id });
}

export async function findByPrintJobStatus(
  status: PrintJobStatus,
): Promise<[QueryError, null | Order[]]> {
  const [errors, result] = await sendQuery<{ orders: Order[] }>(
    ORDERS_BY_PRINT_JOB_STATUS,
    { status },
  );
  return [errors, result ? result.orders : null];
}

export async function save(order: Order): Promise<[QueryError, boolean]> {
  if (!order.faunaId) throw new Error(`Missing faunadb id`);
  const faunaId = order.faunaId;
  order.updated = new Date().toISOString();
  const [errors] = await sendQuery(SAVE_ORDER, { id: faunaId, data: faunaize(order) });
  return [errors, !errors];
}

export async function saveAll(orders: Order[]): Promise<[QueryError, boolean]> {
  const results = await Promise.all(orders.map(save));
  let error: QueryError = null;
  let allSucceeded = true;
  results.forEach(([err, result]) => {
    if (err) {
      error = err;
    }
    if (!result) {
      allSucceeded = false;
    }
  });
  return [error, allSucceeded];
}

export async function create(order: Order): Promise<[QueryError, boolean]> {
  const [errors] = await sendQuery(CREATE_ORDER, { data: faunaize(order) });
  return [errors, !errors];
}

function faunaize(order: Order): Record<string, any> {
  const data = { ...order, externalId: order.id };
  delete data.id;
  delete data.faunaId;
  return data;
}

const CREATE_ORDER = graphql`
  mutation CreateOrder($data: OrderInput!) {
    result: createOrder(data: $data) {
      externalId
    }
  }
`;

const SAVE_ORDER = graphql`
  mutation SaveOrder($id: ID!, $data: OrderInput!) {
    result: updateOrder(id: $id, data: $data) {
      id: externalId
    }
  }
`;

const ORDERS_BY_PRINT_JOB_STATUS = graphql`
  query findByPrintJobStatus($status: PrintJobStatus!) {
    result: ordersByPrintJobStatus(printJobStatus: $status) {
      orders: data {
        faunaId: _id
        id: externalId
        email
        lang
        created
        updated
        amount
        taxes
        shipping
        ccFeeOffset
        paymentId
        paymentStatus
        items {
          title
          documentId
          edition
          quantity
          unitPrice
        }
        printJobId
        printJobStatus
        address {
          name
          street
          street2
          city
          state
          zip
          country
        }
      }
    }
  }
`;

const FIND_BY_ID = graphql`
  query orderById($id: String!) {
    result: findOrderByExternalId(externalId: $id) {
      faunaId: _id
      id: externalId
      email
      lang
      created
      updated
      amount
      taxes
      shipping
      ccFeeOffset
      paymentId
      paymentStatus
      items {
        title
        documentId
        edition
        quantity
        unitPrice
      }
      printJobId
      printJobStatus
      address {
        name
        street
        street2
        city
        state
        zip
        country
      }
    }
  }
`;
